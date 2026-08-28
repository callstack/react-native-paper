import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

import type { ComponentProp } from '../component-docs-plugin/generatePageMDX.ts';

type TypeScriptPropsConfig = {
  sourcePath: string;
  typeName: string;
};

const repoRootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..'
);
const tsconfigPath = path.join(repoRootDir, 'tsconfig.source.json');

let program: ts.Program | undefined;

const getProgram = () => {
  if (program) {
    return program;
  }

  const config = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

  if (config.error) {
    throw new Error(
      ts.flattenDiagnosticMessageText(config.error.messageText, '\n')
    );
  }

  const parsedConfig = ts.parseJsonConfigFileContent(
    config.config,
    ts.sys,
    path.dirname(tsconfigPath)
  );

  program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
  return program;
};

const getDeclarationTypeTexts = (
  symbol: ts.Symbol,
  sourceFile: ts.SourceFile
) => {
  const typeTexts = (symbol.declarations ?? [])
    .filter(
      (declaration): declaration is ts.PropertySignature =>
        declaration.getSourceFile() === sourceFile &&
        ts.isPropertySignature(declaration) &&
        Boolean(declaration.type)
    )
    .map((declaration) => declaration.type?.getText(sourceFile) ?? '')
    .filter((typeText) => typeText !== '' && typeText !== 'never');

  return [...new Set(typeTexts)];
};

const formatType = (
  checker: ts.TypeChecker,
  symbol: ts.Symbol,
  typeDeclaration: ts.TypeAliasDeclaration,
  sourceFile: ts.SourceFile
) => {
  const declarationTypeTexts = getDeclarationTypeTexts(symbol, sourceFile);

  if (declarationTypeTexts.length === 1) {
    return declarationTypeTexts[0];
  }

  const propType = checker.getTypeOfSymbolAtLocation(symbol, typeDeclaration);

  return checker
    .typeToString(
      propType,
      typeDeclaration,
      ts.TypeFormatFlags.NoTruncation |
        ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope
    )
    .replace(/ \| undefined/g, '');
};

const formatDescription = (checker: ts.TypeChecker, symbol: ts.Symbol) => {
  const description = ts.displayPartsToString(
    symbol.getDocumentationComment(checker)
  );
  const tags = symbol
    .getJsDocTags(checker)
    .map((tag) => {
      const text = ts.displayPartsToString(tag.text);
      return `@${tag.name}${text ? ` ${text}` : ''}`;
    })
    .filter((tag, index, allTags) => allTags.indexOf(tag) === index);

  return [description, ...tags].filter(Boolean).join('\n');
};

export const extractTypeScriptProps = (
  { sourcePath, typeName }: TypeScriptPropsConfig,
  parsedProps: Record<string, ComponentProp>
) => {
  const currentProgram = getProgram();
  const checker = currentProgram.getTypeChecker();
  const resolvedSourcePath = fs.realpathSync(sourcePath);
  const sourceFile = currentProgram
    .getSourceFiles()
    .find((file) => fs.realpathSync(file.fileName) === resolvedSourcePath);

  if (!sourceFile) {
    throw new Error(`Could not find TypeScript props source: ${sourcePath}`);
  }

  const typeDeclaration = sourceFile.statements.find(
    (statement): statement is ts.TypeAliasDeclaration =>
      ts.isTypeAliasDeclaration(statement) && statement.name.text === typeName
  );

  if (!typeDeclaration) {
    throw new Error(`Could not find type ${typeName} in ${sourcePath}`);
  }

  const propsType = checker.getTypeAtLocation(typeDeclaration.name);
  const props = checker
    .getPropertiesOfType(propsType)
    .filter((symbol) =>
      symbol.declarations?.some(
        (declaration) => declaration.getSourceFile() === sourceFile
      )
    )
    .map((symbol): [string, ComponentProp] => {
      const parsedProp = parsedProps[symbol.name];
      const type = formatType(checker, symbol, typeDeclaration, sourceFile);

      return [
        symbol.name,
        {
          defaultValue: parsedProp?.defaultValue,
          description:
            formatDescription(checker, symbol) || parsedProp?.description || '',
          required: (symbol.flags & ts.SymbolFlags.Optional) === 0,
          tsType: {
            name: type,
            raw: type,
          },
        },
      ];
    });

  return Object.fromEntries(props);
};
