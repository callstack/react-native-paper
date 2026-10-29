import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import {
  Button,
  Carousel,
  CarouselItem,
  CarouselItemContent,
  Switch,
  Text,
  useTheme,
  type CarouselHandle,
  type CarouselLayout,
} from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const photos = [
  {
    id: 'beach',
    title: 'Beach',
    source: require('../../assets/images/beach.jpg'),
  },
  {
    id: 'bridge',
    title: 'Bridge',
    source: require('../../assets/images/bridge.jpg'),
  },
  {
    id: 'city',
    title: 'City',
    source: require('../../assets/images/city.jpg'),
  },
  {
    id: 'forest',
    title: 'Forest',
    source: require('../../assets/images/forest.jpg'),
  },
  {
    id: 'chameleon',
    title: 'Chameleon',
    source: require('../../assets/images/chameleon.jpg'),
  },
  {
    id: 'strawberries',
    title: 'Strawberries',
    source: require('../../assets/images/strawberries.jpg'),
  },
];

const Section = ({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text variant="titleSmall">{title}</Text>
    {caption ? (
      <Text variant="bodySmall" style={styles.caption}>
        {caption}
      </Text>
    ) : null}
    <View style={styles.carousel}>{children}</View>
  </View>
);

type PhotoCarouselProps = {
  layout: CarouselLayout;
  alignment?: 'start' | 'center';
  itemWidth?: number;
  height?: number;
  outlined?: boolean;
  disabled?: boolean;
  onIndexChange?: (index: number) => void;
  ref?: React.RefObject<CarouselHandle | null>;
};

const PhotoCarousel = ({
  layout,
  alignment,
  itemWidth = 220,
  height = 200,
  outlined,
  disabled,
  onIndexChange,
  ref,
}: PhotoCarouselProps) => {
  const theme = useTheme();

  return (
    <Carousel
      ref={ref}
      data={photos}
      layout={layout}
      alignment={alignment}
      height={height}
      itemWidth={itemWidth}
      itemSpacing={8}
      outlined={outlined}
      disabled={disabled}
      onIndexChange={onIndexChange}
      keyExtractor={(photo) => photo.id}
      aria-label="Photos"
      renderItem={({ item, mask }) => (
        <CarouselItem mask={mask}>
          <Image
            source={item.source}
            style={styles.image}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
          {/* Pinned to the mask's leading edge, so it slides with the visible
              rectangle and fades out as the item collapses. */}
          <CarouselItemContent mask={mask} style={styles.label}>
            <View
              style={[
                styles.labelPill,
                {
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.shapes.corner.small,
                },
              ]}
            >
              <Text variant="labelLarge">{item.title}</Text>
            </View>
          </CarouselItemContent>
        </CarouselItem>
      )}
    />
  );
};

const CarouselExample = () => {
  const carouselRef = React.useRef<CarouselHandle>(null);
  const [focused, setFocused] = React.useState(0);
  const [outlined, setOutlined] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  return (
    <ScreenWrapper contentContainerStyle={styles.container}>
      <Text variant="bodySmall" style={styles.caption}>
        Items are never resized. What changes as an item moves through the
        keylines is its mask rectangle and a translation — every item stays
        measured at the large size throughout, which is why the photos never
        reflow.
      </Text>

      <Section
        title="Multi-browse"
        caption="One or two large items, then a medium and a small one. Momentum decays across several items before it settles."
      >
        <PhotoCarousel
          ref={carouselRef}
          layout="multi-browse"
          onIndexChange={setFocused}
        />
      </Section>
      <Text variant="bodySmall" style={styles.caption}>
        Focused item: {photos[focused]?.title}
      </Text>
      {/* Programmatic moves settle on the same spring a fling does. */}
      <View style={styles.row}>
        <Button
          mode="outlined"
          onPress={() => carouselRef.current?.scrollToIndex(focused - 1)}
        >
          Previous
        </Button>
        <Button
          mode="outlined"
          onPress={() => carouselRef.current?.scrollToIndex(focused + 1)}
        >
          Next
        </Button>
      </View>

      <Section
        title="Hero, start-aligned"
        caption="A single large item with one peek. One item per fling."
      >
        <PhotoCarousel layout="hero" alignment="start" />
      </Section>

      <Section
        title="Hero, centre-aligned"
        caption="A peek on either side. Falls back to start-aligned below three items."
      >
        <PhotoCarousel layout="hero" alignment="center" />
      </Section>

      <Section
        title="Uncontained"
        caption="Items keep the width they were given and the carousel does not snap — the layout to use when aspect ratios matter."
      >
        <PhotoCarousel layout="uncontained" itemWidth={260} />
      </Section>

      <Section title="Full-screen" caption="One item filling the container.">
        <PhotoCarousel layout="full-screen" height={260} />
      </Section>

      <Section
        title="Outlined and disabled"
        caption="Outlined draws a 1dp border on each item; disabled stops scrolling and drops the items to 38% opacity."
      >
        <PhotoCarousel
          layout="multi-browse"
          outlined={outlined}
          disabled={disabled}
        />
      </Section>

      <View style={styles.row}>
        <Text variant="bodyMedium">Outlined</Text>
        <Switch value={outlined} onValueChange={setOutlined} />
      </View>
      <View style={styles.row}>
        <Text variant="bodyMedium">Disabled</Text>
        <Switch value={disabled} onValueChange={setDisabled} />
      </View>
    </ScreenWrapper>
  );
};

CarouselExample.title = 'Carousel';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    gap: 8,
  },
  section: {
    gap: 4,
    paddingTop: 16,
  },
  caption: {
    opacity: 0.7,
    paddingHorizontal: 16,
  },
  carousel: {
    paddingHorizontal: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  label: {
    padding: 16,
  },
  labelPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default CarouselExample;
