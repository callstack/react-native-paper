import color from 'color';
import type { InternalTheme } from 'src/types';

export const getAccordionColors = ({
  theme,
  isExpanded,
}: {
  theme: InternalTheme;
  isExpanded?: boolean;
}) => {
  const titleColor = theme.isV3
    ? theme.colors.onSurface
    : color(theme.colors.text).alpha(0.87).rgb().string();

  const descriptionColor = theme.isV3
    ? theme.colors.onSurfaceVariant
    : color(theme.colors.text).alpha(0.54).rgb().string();

  const titleTextColor = isExpanded ? theme.colors?.primary : titleColor;

  const rippleColor = color(titleTextColor).alpha(0.12).rgb().string();

  return {
    titleColor,
    descriptionColor,
    titleTextColor,
    rippleColor,
  };
};
