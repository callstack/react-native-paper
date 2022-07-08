import React from 'react';
import renderer from 'react-test-renderer';
import Menu from '../../Menu/Menu';
import Appbar from '../../Appbar';
import AppbarAction from '../../Appbar/AppbarAction';
import AppbarContent from '../../Appbar/AppbarContent';
import AppbarBackAction from '../../Appbar/AppbarBackAction';
import AppbarHeader from '../../Appbar/AppbarHeader';
import { getAppbarColor, renderAppbarContent } from '../../Appbar/utils';
import Searchbar from '../../Searchbar';
import { tokens } from '../../../styles/themes/v3/tokens';
import { getTheme } from '../../../core/theming';
import overlay from '../../../styles/overlay';
import { Platform } from 'react-native';

describe('Appbar', () => {
  it('does not pass any additional props to Searchbar', () => {
    const tree = renderer
      .create(
        <Appbar>
          <Searchbar placeholder="Search" />
        </Appbar>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('passes additional props to AppbarBackAction, AppbarContent and AppbarAction', () => {
    const tree = renderer
      .create(
        <Appbar>
          <Appbar.BackAction onPress={() => {}} />
          <Appbar.Content title="Examples" />
          <Appbar.Action icon="menu" onPress={() => {}} />
        </Appbar>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});

describe('renderAppbarContent', () => {
  const children = [
    <Appbar.BackAction onPress={() => {}} key={0} />,
    <Appbar.Content title="Examples" key={1} />,
    <Appbar.Action icon="magnify" onPress={() => {}} key={2} />,
    <Appbar.Action icon="menu" onPress={() => {}} key={3} />,
  ];

  it('should render all children types if renderOnly is not specified', () => {
    const result = renderAppbarContent({
      children,
      isDark: false,
    });

    expect(result).toHaveLength(4);
  });

  it('should render all children types except specified in renderExcept', () => {
    const result = renderAppbarContent({
      children: [
        ...children,
        <Menu
          key={4}
          anchor={<Appbar.Action icon="menu" onPress={() => {}} />}
        />,
      ],
      isDark: false,
      renderExcept: [Appbar, AppbarHeader, AppbarBackAction, AppbarContent],
    });

    expect(result).toHaveLength(3);
  });

  it('should render only children types specifed in renderOnly', () => {
    const result = renderAppbarContent({
      children,
      isDark: false,
      renderOnly: [AppbarAction],
    });

    expect(result).toHaveLength(2);
  });

  it('should render AppbarContent with correct mode', () => {
    const result = renderAppbarContent({
      children,
      isDark: false,
      renderOnly: [AppbarContent],
      mode: 'large',
    });

    expect(result[0].props.mode).toBe('large');
  });

  it('should render centered AppbarContent', () => {
    const renderResult = (isV3 = true) =>
      renderAppbarContent({
        children,
        isDark: false,
        isV3,
        renderOnly: [AppbarContent],
        mode: 'center-aligned',
        shouldCenterContent: true,
      });

    const centerAlignedContent = {
      alignItems: 'center',
    };

    expect(renderResult()[0].props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(centerAlignedContent)])
    );

    expect(renderResult(false)[0].props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(centerAlignedContent)])
    );
  });

  it('should not render centered AppbarContent for Android, if not V3', () => {
    Platform.OS = 'android';
    const renderResult = (isV3 = true) =>
      renderAppbarContent({
        children,
        isDark: false,
        isV3,
        renderOnly: [AppbarContent],
        mode: 'center-aligned',
        shouldCenterContent: !isV3 && Platform.OS === 'ios',
      });

    const centerAlignedContent = {
      alignItems: 'center',
    };

    expect(renderResult(false)[0].props.style).not.toEqual(
      expect.arrayContaining([expect.objectContaining(centerAlignedContent)])
    );
  });

  it('should render centered AppbarContent always for iOS, if not V3', () => {
    Platform.OS = 'ios';
    const renderResult = (isV3 = true) =>
      renderAppbarContent({
        children,
        isDark: false,
        isV3,
        renderOnly: [AppbarContent],
        mode: 'center-aligned',
        shouldCenterContent: !isV3 && Platform.OS === 'ios',
      });

    const centerAlignedContent = {
      alignItems: 'center',
    };

    expect(renderResult(false)[0].props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(centerAlignedContent)])
    );
  });

  it('should render AppbarContent with correct spacings', () => {
    const renderResult = (isV3 = true, withAppbarBackAction = false) =>
      renderAppbarContent({
        children,
        isDark: false,
        isV3,
        renderOnly: [AppbarContent, withAppbarBackAction && AppbarBackAction],
      });

    const v2Spacing = {
      marginLeft: 8,
    };

    const v3Spacing = {
      marginLeft: 12,
    };

    expect(renderResult()[0].props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(v3Spacing)])
    );

    expect(renderResult(false, true)[1].props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(v2Spacing)])
    );
  });
});

describe('getAppbarColors', () => {
  const elevation = 4;
  const customBackground = 'aquamarine';

  it('should return custom color no matter what is the theme version', () => {
    expect(getAppbarColor(getTheme(), elevation, customBackground)).toBe(
      customBackground
    );
  });

  it('should return v3 light color if theme version is 3', () => {
    expect(getAppbarColor(getTheme(), elevation)).toBe(
      tokens.md.ref.palette.neutral99
    );
  });

  it('should return v3 dark color if theme version is 3', () => {
    expect(getAppbarColor(getTheme(true), elevation)).toBe(
      tokens.md.ref.palette.neutral10
    );
  });

  it('should return v2 light color if theme version is 2', () => {
    expect(getAppbarColor(getTheme(false, false), elevation)).toBe('#6200ee');
  });

  it('should return v2 dark color if theme version is 2', () => {
    expect(getAppbarColor(getTheme(true, false), elevation)).toBe(
      overlay(elevation, '#121212')
    );
  });
});
