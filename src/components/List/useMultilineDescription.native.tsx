import * as React from 'react';
import type {
  NativeSyntheticEvent,
  TextLayoutEventData,
  TextProps,
  View,
} from 'react-native';

type MultilineDescription = {
  isMultiline: boolean;
  contentRef: React.RefObject<View | null>;
  descriptionProps: Pick<TextProps, 'onTextLayout'>;
};

export const useMultilineDescription = (
  hasDescription: boolean
): MultilineDescription => {
  const contentRef = React.useRef<View>(null);
  const [isMultiline, setIsMultiline] = React.useState(false);

  const onTextLayout = React.useCallback(
    (event: NativeSyntheticEvent<TextLayoutEventData>) => {
      setIsMultiline(event.nativeEvent.lines.length >= 2);
    },
    []
  );

  return {
    isMultiline: hasDescription && isMultiline,
    contentRef,
    descriptionProps: { onTextLayout },
  };
};
