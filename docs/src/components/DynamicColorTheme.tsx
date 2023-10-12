import React, { useState, ReactNode } from 'react';

import Color from 'color';
//@ts-ignore
import { BlockPicker } from 'react-color';

import Switch from './Switch';
import {
  getMatchingColor,
  getPreviewColors,
  hexThemeFromColor,
  prepareThemes,
} from '../utils/themes';

type ColorProps = {
  color?: string;
  setColor: (hex: string) => void;
};

type AdditionalColorPickerProps = ColorProps & {
  base: string;
  setColor: (hex?: string) => void;
  children: ReactNode | undefined;
};

type ColorPickerProps = ColorProps & { additional?: boolean };

type CustomColorEntry = {
  key: string;
  name: string;
  hex: string;
};

const defaultColor = '#663399';

const colorPalette = [
  '#FBC02D',
  '#FFA000',
  '#F57C00',
  '#E64A19',
  '#D32F2F',
  '#C2185B',
  '#7B1FA2',
  '#512DA8',
  '#303F9F',
  '#1976D2',
  '#0288D1',
  '#0097A7',
  '#00796B',
  '#388E3C',
  '#689F38',
  '#AFB42B',
  '#5D4037',
  '#616161',
  '#455A64',
];

const ColorPicker = ({ color, setColor, additional }: ColorPickerProps) => {
  const [open, setOpen] = useState(false);
  const labelColor = Color(color).isDark() ? '#fff' : '#000';

  return (
    <div className="color-picker-anchor">
      <button
        className={
          additional ? 'color-picker-button-additional' : 'color-picker-button'
        }
        style={{
          background: color,
          color: labelColor,
        }}
        onClick={() => setOpen(true)}
      >
        {color}
      </button>
      {open ? (
        <div>
          <div
            className="color-picker-cover"
            onClick={() => setOpen(false)}
          ></div>
          <div className="color-picker-popup">
            <BlockPicker
              color={color}
              //@ts-ignore
              onChangeComplete={(change) => setColor(change.hex)}
              colors={colorPalette}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

const BaseColor = ({ color, setColor }: ColorProps) => {
  return (
    <tr>
      <td>Primary</td>
      <td className="color-picker-button-col">
        <ColorPicker color={color} setColor={setColor} />
      </td>
    </tr>
  );
};

const AdditionalColor = ({
  color,
  base,
  setColor,
  children,
}: AdditionalColorPickerProps) => {
  const custom = color && color !== base;

  if (custom) {
    return (
      <tr>
        <td>{children} (custom)</td>
        <td>
          <ColorPicker color={color} setColor={setColor} additional />
          <button
            className="color-picker-button-cancel"
            onClick={() => setColor(undefined)}
          >
            ✕
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td>{children}</td>
      <td>
        <ColorPicker color={base} setColor={setColor} />
      </td>
    </tr>
  );
};

const CodePreview = ({
  theme,
  children,
}: {
  theme: Record<string, any>;
  children: ReactNode | undefined;
}) => {
  const [copied, setCopied] = useState(false);

  const getColorScheme = () => {
    return JSON.stringify(
      {
        colors: theme,
      },
      null,
      2
    );
  };

  const onCopy = () => {
    navigator.clipboard.writeText(getColorScheme());
    setCopied(true);

    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div>
      <div className="color-picker-schema-copy-header">
        <h4>{children}</h4>
        <button onClick={onCopy} className="color-picker-action-button">
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre>
        <code className="language-json">{getColorScheme()}</code>
      </pre>
    </div>
  );
};

let uniqColorKey = 0;

const CustomColors = ({
  customColors,
  setCustomColors,
}: {
  customColors: CustomColorEntry[];
  setCustomColors: React.Dispatch<React.SetStateAction<CustomColorEntry[]>>;
}) => {
  const addCustomColor = () => {
    const newColor = {
      key: `custom${++uniqColorKey}`,
      name: `custom${customColors.length}`,
      hex: defaultColor,
    };
    setCustomColors((colors) => [...colors, newColor]);
  };

  const setCustomColor = (key: string, hex: string) => {
    setCustomColors((colors) =>
      colors.map((color) => (color.key === key ? { ...color, hex } : color))
    );
  };

  const setCustomName = (key: string, name: string) => {
    setCustomColors((colors) =>
      colors.map((color) => (color.key === key ? { ...color, name } : color))
    );
  };

  const deleteCustomColor = (key: string) =>
    setCustomColors((colors) => colors.filter((color) => key !== color.key));

  return (
    <>
      {customColors.map(({ key, name, hex }, index) => (
        <CustomColor
          key={key}
          uniqKey={key}
          name={name}
          index={index}
          color={hex}
          setCustomColor={setCustomColor}
          deleteCustomColor={deleteCustomColor}
          setCustomName={setCustomName}
        />
      ))}

      <tr>
        <td colSpan={2} align="center">
          <button
            onClick={addCustomColor}
            className="color-picker-action-button"
          >
            + Add custom color
          </button>
        </td>
      </tr>
    </>
  );
};

const CustomColor = ({
  name,
  color,
  index,
  uniqKey,
  setCustomColor,
  deleteCustomColor,
  setCustomName,
}: {
  name: string;
  color: string;
  uniqKey: string;
  index: number;
  setCustomColor: (key: string, hex: string) => void;
  deleteCustomColor: (key: string) => void;
  setCustomName: (key: string, name: string) => void;
}) => {
  // const [colorName, setColorName] = useState<string>(name);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setCustomName(uniqKey, event.target.value);
  };

  if (name) {
    return (
      <tr>
        <td>
          Custom color #{index + 1}:{' '}
          <input
            value={name}
            onChange={onNameChange}
            className="color-picker-name-input"
          />
        </td>
        <td>
          <ColorPicker
            color={color}
            setColor={(hex) => setCustomColor(uniqKey, hex)}
            additional
          />
          <button
            className="color-picker-button-cancel"
            onClick={() => deleteCustomColor(uniqKey)}
          >
            ✕
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td colSpan={2}>
        Custom color #{index + 1}:{' '}
        <input
          value={name}
          onChange={onNameChange}
          className="color-picker-name-input"
        />
        <button
          className="color-picker-button-cancel"
          onClick={() => deleteCustomColor(uniqKey)}
        >
          ✕
        </button>
      </td>
    </tr>
  );
};

const DynamicColorTheme = () => {
  const [isDark, setIsDark] = useState(false);

  const [primary, setPrimary] = useState<string>(defaultColor);
  const [secondary, setSecondary] = useState<string | undefined>();
  const [tertiary, setTertiary] = useState<string | undefined>();
  const [customColors, setCustomColors] = useState<CustomColorEntry[]>([]);

  const darkMode = isDark ? 'dark' : 'light';
  const baseTheme = hexThemeFromColor(primary);
  const themes = prepareThemes({
    primary,
    secondary,
    tertiary,
    custom: customColors.map(({ name, hex }) => [name, hex]),
  });

  return (
    <div>
      <table className="color-picker">
        <tbody>
          <BaseColor color={primary} setColor={setPrimary} />
          <AdditionalColor
            color={secondary}
            setColor={setSecondary}
            base={baseTheme.secondary}
          >
            Secondary
          </AdditionalColor>
          <AdditionalColor
            color={tertiary}
            setColor={setTertiary}
            base={baseTheme.tertiary}
          >
            Tertiary
          </AdditionalColor>

          <CustomColors
            customColors={customColors}
            setCustomColors={setCustomColors}
          />
        </tbody>
      </table>

      <div
        className="color-picker-preview"
        style={{
          //@ts-ignore
          background: themes[darkMode].background,
          //@ts-ignore
          color: themes[darkMode].onBackground,
          //@ts-ignore
          borderColor: themes[darkMode].outlineVariant,
        }}
      >
        <div className="color-picker-preview-header">
          <h3>Preview</h3>
          <div>
            <p>Dark Mode:</p>
            <Switch
              value={isDark}
              color="green"
              onValueChange={() => setIsDark(!isDark)}
            />
          </div>
        </div>

        <div className="color-picker-grid-column">
          {getPreviewColors(themes[darkMode]).map(([key, color]) => {
            const gridColumn = key === 'outline' ? 'span 2' : undefined;
            return (
              <div
                key={key}
                className="color-picker-preview-box"
                style={{
                  backgroundColor: color,
                  color: getMatchingColor(key, themes[darkMode]),
                  gridColumn,
                }}
              >
                {key}
              </div>
            );
          })}
        </div>
      </div>

      <div className="color-picker-themes">
        <CodePreview theme={themes.light}>Light theme</CodePreview>
        <CodePreview theme={themes.dark}>Dark theme</CodePreview>
      </div>
    </div>
  );
};

export default DynamicColorTheme;
