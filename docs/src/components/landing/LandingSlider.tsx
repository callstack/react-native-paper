import { useRef, useState, type ReactNode } from 'react';

import type { CSSVars } from './cssVars';
import { asset } from './LandingSection';

type Props = {
  children: ReactNode;
  slidesAmount: number;
  initialSlide: number;
  label: string;
};

const SWIPE_THRESHOLD = 40;

export default function LandingSlider({
  children,
  slidesAmount,
  initialSlide,
  label,
}: Props) {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);

  const prevSlide = () =>
    setCurrentSlide((slide) => (slide === 1 ? slide : slide - 1));
  const nextSlide = () =>
    setCurrentSlide((slide) => (slide === slidesAmount ? slide : slide + 1));

  const swipeStart = useRef<number | null>(null);

  const handlePointerDown = (event: React.PointerEvent) => {
    swipeStart.current = event.clientX;
  };

  const handlePointerEnd = (event: React.PointerEvent) => {
    const start = swipeStart.current;

    swipeStart.current = null;

    if (start === null || event.type === 'pointercancel') {
      return;
    }

    const travelled = event.clientX - start;

    if (travelled <= -SWIPE_THRESHOLD) {
      nextSlide();
    } else if (travelled >= SWIPE_THRESHOLD) {
      prevSlide();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prevSlide();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      nextSlide();
    }
  };

  const offset = (slideWidth: number) =>
    currentSlide * -slideWidth + slideWidth / 2;

  const track: CSSVars = {
    '--i15993hv-0': `${slidesAmount * 320}px`,
    '--i15993hv-1': `${offset(320)}px`,
    '--i15993hv-2': `${slidesAmount * 450}px`,
    '--i15993hv-3': `${offset(450)}px`,
    '--i15993hv-4': `${slidesAmount * 620}px`,
    '--i15993hv-5': `${offset(620)}px`,
  };

  return (
    <div className="wibeo8m">
      <div
        aria-label={label}
        aria-roledescription="carousel"
        className="landing-slider__swipe"
        onKeyDown={handleKeyDown}
        onPointerCancel={handlePointerEnd}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerEnd}
        role="group"
        tabIndex={0}
      >
        <div className="i15993hv" style={track}>
          {children}
        </div>
        <div className="awvlien">
          {currentSlide > 1 ? (
            <button
              aria-label="Previous slide"
              className="a19n5qcz a1fnk6ch"
              onClick={prevSlide}
              type="button"
            >
              <img
                alt=""
                draggable={false}
                src={asset('images/arrow-left.svg')}
              />
            </button>
          ) : null}
          {currentSlide < slidesAmount ? (
            <button
              aria-label="Next slide"
              className="a19nei0v a1fnk6ch"
              onClick={nextSlide}
              type="button"
            >
              <img
                alt=""
                draggable={false}
                src={asset('images/arrow-right.svg')}
              />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
