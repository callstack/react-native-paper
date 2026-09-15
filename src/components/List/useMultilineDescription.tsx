import * as React from 'react';
import type { TextProps, View } from 'react-native';

type MultilineDescription = {
  isMultiline: boolean;
  contentRef: React.RefObject<View | null>;
  descriptionProps: Pick<TextProps, 'onTextLayout'>;
};

const LINE_TOLERANCE_PX = 1;

/**
 * Web has no `onTextLayout`, so the description is measured from the DOM.
 * `useLayoutEffect` runs before paint, so the row is laid out at its final
 * height in the frame it first appears. `ResizeObserver` re-measures on
 * reflow, for example when a web font swaps in or the column is resized.
 */
export const useMultilineDescription = (
  hasDescription: boolean
): MultilineDescription => {
  const contentRef = React.useRef<View>(null);
  const [isMultiline, setIsMultiline] = React.useState(false);

  React.useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    const content = contentRef.current as unknown as HTMLElement | null;

    if (!hasDescription || !content) {
      setIsMultiline(false);
      return undefined;
    }

    // The description is rendered after the title, as the last node of the column.
    const description = content.lastElementChild;

    if (!description) {
      return undefined;
    }

    const measure = () => {
      const { height } = description.getBoundingClientRect();

      if (height === 0) {
        return;
      }

      const computed = window.getComputedStyle(description);
      const lineHeight = Number.parseFloat(computed.lineHeight);
      const resolvedLineHeight = Number.isNaN(lineHeight)
        ? Number.parseFloat(computed.fontSize) * 1.2 // `line-height: normal` fallback
        : lineHeight;

      setIsMultiline(height > resolvedLineHeight + LINE_TOLERANCE_PX);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(description);

    return () => observer.disconnect();
  }, [hasDescription]);

  return { isMultiline, contentRef, descriptionProps: {} };
};
