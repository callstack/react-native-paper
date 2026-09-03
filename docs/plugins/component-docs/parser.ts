import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

import type {
  ComponentDoc,
  ComponentPageConfig,
  ComponentProp,
  ExtendsAttribute,
} from './types.ts';

const DEFAULT_PROPS_TYPE = 'Props';

const fail = (sourcePath: string, message: string): never => {
  throw new Error(`Unable to generate docs for ${sourcePath}: ${message}`);
};

const readDocComment = (sourceFile: ts.SourceFile, node: ts.Node) => {
  const ranges = ts.getLeadingCommentRanges(sourceFile.text, node.pos) ?? [];
  const range = ranges.findLast(
    (item) =>
      item.kind === ts.SyntaxKind.MultiLineCommentTrivia &&
      sourceFile.text.startsWith('/**', item.pos)
  );

  if (!range) {
    return '';
  }

  return sourceFile.text
    .slice(range.pos + 3, range.end - 2)
    .split('\n')
    .map((line) => line.replace(/^\s*\* ?/, ''))
    .join('\n')
    .trim();
};

const getDefaultExportName = (sourceFile: ts.SourceFile) => {
  for (const statement of sourceFile.statements) {
    if (
      (ts.isClassDeclaration(statement) ||
        ts.isFunctionDeclaration(statement)) &&
      statement.modifiers?.some(
        (modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword
      )
    ) {
      const name = statement.name;

      if (!name) {
        return fail(sourceFile.fileName, 'the default export must be named');
      }

      return name.text;
    }

    if (ts.isExportAssignment(statement)) {
      const expression = statement.expression;

      if (!ts.isIdentifier(expression)) {
        return fail(
          sourceFile.fileName,
          'the default export must be an identifier, or set component in the page config'
        );
      }

      return expression.text;
    }
  }

  return fail(sourceFile.fileName, 'a default export was not found');
};

const findComponentDeclaration = (
  sourceFile: ts.SourceFile,
  componentName: string
) => {
  for (const statement of sourceFile.statements) {
    if (
      (ts.isClassDeclaration(statement) ||
        ts.isFunctionDeclaration(statement)) &&
      statement.name?.text === componentName
    ) {
      return {
        declaration: statement,
        docNode: statement,
      };
    }

    if (ts.isVariableStatement(statement)) {
      const declaration = statement.declarationList.declarations.find(
        (item) => ts.isIdentifier(item.name) && item.name.text === componentName
      );

      if (declaration) {
        return {
          declaration,
          docNode: statement,
        };
      }
    }
  }

  return fail(sourceFile.fileName, `component ${componentName} was not found`);
};

const findPropsType = (sourceFile: ts.SourceFile, typeName: string) => {
  const declaration = sourceFile.statements.find(
    (statement): statement is ts.TypeAliasDeclaration =>
      ts.isTypeAliasDeclaration(statement) && statement.name.text === typeName
  );

  if (!declaration) {
    return fail(sourceFile.fileName, `type alias ${typeName} was not found`);
  }

  if (
    !declaration.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
    )
  ) {
    fail(sourceFile.fileName, `type alias ${typeName} must be exported`);
  }

  return declaration;
};

const validatePropsType = (
  sourceFile: ts.SourceFile,
  declaration: ts.TypeAliasDeclaration
) => {
  const literals: ts.TypeLiteralNode[] = [];

  const visit = (node: ts.TypeNode) => {
    if (ts.isTypeLiteralNode(node)) {
      literals.push(node);
      return;
    }

    if (ts.isIntersectionTypeNode(node)) {
      node.types.forEach(visit);
      return;
    }

    if (ts.isParenthesizedTypeNode(node)) {
      visit(node.type);
    }
  };

  visit(declaration.type);

  if (literals.length !== 1) {
    return fail(
      sourceFile.fileName,
      `type alias ${declaration.name.text} must contain exactly one inline object type`
    );
  }

  return declaration;
};

const isPathInside = (parentPath: string, childPath: string) => {
  const relativePath = path.relative(parentPath, childPath);

  return !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
};

const getProps = (
  checker: ts.TypeChecker,
  sourceRootDir: string,
  sourceFile: ts.SourceFile,
  declaration: ts.TypeAliasDeclaration,
  defaults: ReadonlyMap<string, string>
) =>
  checker
    .getPropertiesOfType(checker.getTypeAtLocation(declaration))
    .flatMap((symbol): ComponentProp[] => {
      const name = symbol.getName();
      const allDeclarations = symbol.getDeclarations() ?? [];
      const declarations = allDeclarations.filter((item) =>
        isPathInside(sourceRootDir, item.getSourceFile().fileName)
      );
      const property =
        declarations.find((item) => item.getSourceFile() === sourceFile) ??
        declarations[0] ??
        (defaults.has(name)
          ? allDeclarations.find(
              (item): item is ts.PropertySignature =>
                ts.isPropertySignature(item) && Boolean(item.type)
            )
          : undefined);

      if (!property) {
        return [];
      }

      if (!ts.isPropertySignature(property) || !property.type) {
        return fail(
          sourceFile.fileName,
          `unsupported member ${property.getText(property.getSourceFile())} in ${declaration.name.text}`
        );
      }

      const propertySourceFile = property.getSourceFile();
      const declarationTypes = declarations.flatMap((item) =>
        ts.isPropertySignature(item) && item.type
          ? [item.type.getText(item.getSourceFile())]
          : []
      );
      const hasUnionDeclarations = declarations.some((item) => {
        let parent: ts.Node | undefined = item.parent;

        while (parent && !ts.isTypeAliasDeclaration(parent)) {
          if (ts.isUnionTypeNode(parent)) {
            return true;
          }

          parent = parent.parent;
        }

        return false;
      });
      const type =
        (hasUnionDeclarations && new Set(declarationTypes).size > 1) ||
        !declarations.includes(property)
          ? checker.typeToString(
              checker.getTypeOfSymbolAtLocation(symbol, property),
              property,
              ts.TypeFormatFlags.NoTruncation |
                ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope
            )
          : property.type.getText(propertySourceFile);

      return [
        {
          defaultValue: defaults.get(name),
          description: readDocComment(propertySourceFile, property),
          name,
          required: !(symbol.flags & ts.SymbolFlags.Optional),
          type,
        },
      ];
    });

const resolveLiteralDefault = (
  checker: ts.TypeChecker,
  expression: ts.Expression,
  visitedSymbols = new Set<ts.Symbol>()
): string | undefined => {
  let value = expression;

  while (
    ts.isAsExpression(value) ||
    ts.isParenthesizedExpression(value) ||
    ts.isSatisfiesExpression(value)
  ) {
    value = value.expression;
  }

  if (
    ts.isStringLiteral(value) ||
    ts.isNoSubstitutionTemplateLiteral(value) ||
    ts.isNumericLiteral(value) ||
    value.kind === ts.SyntaxKind.TrueKeyword ||
    value.kind === ts.SyntaxKind.FalseKeyword ||
    value.kind === ts.SyntaxKind.NullKeyword
  ) {
    return value.getText(value.getSourceFile());
  }

  if (!ts.isIdentifier(value)) {
    return undefined;
  }

  let symbol = checker.getSymbolAtLocation(value);

  if (!symbol) {
    return undefined;
  }

  if (symbol.flags & ts.SymbolFlags.Alias) {
    symbol = checker.getAliasedSymbol(symbol);
  }

  if (visitedSymbols.has(symbol)) {
    return undefined;
  }

  visitedSymbols.add(symbol);

  const declaration = symbol
    .getDeclarations()
    ?.find(
      (item): item is ts.VariableDeclaration =>
        ts.isVariableDeclaration(item) &&
        Boolean(item.initializer) &&
        ts.isVariableDeclarationList(item.parent) &&
        Boolean(item.parent.flags & ts.NodeFlags.Const)
    );

  return declaration?.initializer
    ? resolveLiteralDefault(checker, declaration.initializer, visitedSymbols)
    : undefined;
};

const getParameterDefaults = (
  checker: ts.TypeChecker,
  sourceFile: ts.SourceFile,
  declaration: ts.Declaration
) => {
  let parameter: ts.ParameterDeclaration | undefined;

  if (ts.isFunctionDeclaration(declaration)) {
    parameter = declaration.parameters[0];
  } else if (ts.isVariableDeclaration(declaration)) {
    let initializer = declaration.initializer;

    while (
      initializer &&
      (ts.isAsExpression(initializer) ||
        ts.isParenthesizedExpression(initializer) ||
        ts.isSatisfiesExpression(initializer))
    ) {
      initializer = initializer.expression;
    }

    if (
      initializer &&
      (ts.isArrowFunction(initializer) || ts.isFunctionExpression(initializer))
    ) {
      parameter = initializer.parameters[0];
    }
  }

  if (!parameter || !ts.isObjectBindingPattern(parameter.name)) {
    return new Map<string, string>();
  }

  return new Map(
    parameter.name.elements.flatMap((element): [string, string][] => {
      if (!element.initializer || element.dotDotDotToken) {
        return [];
      }

      const propertyName = element.propertyName ?? element.name;

      if (!ts.isIdentifier(propertyName) && !ts.isStringLiteral(propertyName)) {
        return [];
      }

      return [
        [
          propertyName.text,
          resolveLiteralDefault(checker, element.initializer) ??
            element.initializer.getText(sourceFile),
        ],
      ];
    })
  );
};

const getDisplayName = (
  sourceFile: ts.SourceFile,
  componentName: string,
  declaration: ts.Declaration
) => {
  if (ts.isClassDeclaration(declaration)) {
    const displayName = declaration.members.find(
      (member): member is ts.PropertyDeclaration =>
        ts.isPropertyDeclaration(member) &&
        member.modifiers?.some(
          (modifier) => modifier.kind === ts.SyntaxKind.StaticKeyword
        ) === true &&
        ts.isIdentifier(member.name) &&
        member.name.text === 'displayName'
    )?.initializer;

    if (displayName && ts.isStringLiteral(displayName)) {
      return displayName.text;
    }
  }

  for (const statement of sourceFile.statements) {
    if (!ts.isExpressionStatement(statement)) {
      continue;
    }

    const expression = statement.expression;

    if (
      ts.isBinaryExpression(expression) &&
      expression.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      ts.isPropertyAccessExpression(expression.left) &&
      ts.isIdentifier(expression.left.expression) &&
      expression.left.expression.text === componentName &&
      expression.left.name.text === 'displayName' &&
      ts.isStringLiteral(expression.right)
    ) {
      return expression.right.text;
    }
  }

  return componentName;
};

const extractExtendsAttributes = (description: string) => {
  const extendsAttributes: ExtendsAttribute[] = [];
  const lines = description.split('\n').filter((line) => {
    if (!line.startsWith('@extends ')) {
      return true;
    }

    const parts = line.slice('@extends '.length).split(' ');
    const link = parts.pop();

    if (link) {
      extendsAttributes.push({
        link,
        name: parts.join(' '),
      });
    }

    return false;
  });

  return {
    description: lines.join('\n').trim(),
    extendsAttributes,
  };
};

export const createComponentParser = (tsconfigPath: string) => {
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
  const program = ts.createProgram(
    parsedConfig.fileNames,
    parsedConfig.options
  );
  const checker = program.getTypeChecker();

  return (sourceRootDir: string, page: ComponentPageConfig): ComponentDoc => {
    const sourcePath = path.join(sourceRootDir, `${page.source}.tsx`);
    const sourceFile = program.getSourceFile(sourcePath);

    if (!sourceFile || !fs.existsSync(sourcePath)) {
      return fail(
        sourcePath,
        'source file was not found in the TypeScript program'
      );
    }

    const componentName = page.component ?? getDefaultExportName(sourceFile);
    const component = findComponentDeclaration(sourceFile, componentName);
    const propsType = findPropsType(
      sourceFile,
      page.props ?? DEFAULT_PROPS_TYPE
    );
    validatePropsType(sourceFile, propsType);
    const defaults = getParameterDefaults(
      checker,
      sourceFile,
      component.declaration
    );
    const props = getProps(
      checker,
      sourceRootDir,
      sourceFile,
      propsType,
      defaults
    );
    const componentDocs = extractExtendsAttributes(
      readDocComment(sourceFile, component.docNode)
    );

    if (!componentDocs.description) {
      return fail(
        sourcePath,
        `component ${componentName} must have a JSDoc comment`
      );
    }

    return {
      ...componentDocs,
      props,
      title:
        page.title ??
        getDisplayName(sourceFile, componentName, component.declaration),
    };
  };
};
