import { useEffect, useRef, useState, type ReactNode } from 'react';

import type { CSSVars } from './cssVars';
import { asset } from './LandingSection';

type Props = {
  children: ReactNode;
  slidesAmount: number;
  initialSlide: number;
};

/** Below this, the source hides the arrows and the track is swipe-only. */
const SWIPE_THRESHOLD = 40;

/**
 * components/Slider.js. The track's width and offset are responsive, so the
 * source feeds linaria six interpolations - one width and one translate per
 * breakpoint - which compile to the custom properties `i15993hv` reads.
 */
export default function LandingSlider({
  children,
  slidesAmount,
  initialSlide,
}: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  // The source sets the initial slide on mount rather than in state, so the
  // track starts centred only once the window width is known.
  useEffect(() => {
    setCurrentSlide(initialSlide);

    const handleResize = () => setWindowWidth(document.body.clientWidth);

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [initialSlide]);

  const prevSlide = () =>
    setCurrentSlide((slide) => (slide === 1 ? slide : slide - 1));
  const nextSlide = () =>
    setCurrentSlide((slide) => (slide === slidesAmount ? slide : slide + 1));

  // Stands in for react-swipeable, which the docs site does not depend on.
  const swipeStart = useRef<number | null>(null);

  const handlePointerDown = (event: React.PointerEvent) => {
    swipeStart.current = event.clientX;
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    const start = swipeStart.current;

    swipeStart.current = null;

    if (start === null) {
      return;
    }

    const travelled = event.clientX - start;

    if (travelled <= -SWIPE_THRESHOLD) {
      nextSlide();
    } else if (travelled >= SWIPE_THRESHOLD) {
      prevSlide();
    }
  };

  const offset = (slideWidth: number) =>
    currentSlide * -slideWidth + windowWidth / 2 + slideWidth / 2;

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
      <div onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
        <div className="i15993hv" style={track}>
          {children}
        </div>
        <div className="awvlien">
          {currentSlide > 1 ? (
            <img
              alt="Previous"
              className="a19n5qcz a1fnk6ch"
              onClick={prevSlide}
              src={asset('images/arrow-left.svg')}
            />
          ) : null}
          {currentSlide < slidesAmount ? (
            <img
              alt="Next"
              className="a19nei0v a1fnk6ch"
              onClick={nextSlide}
              src={asset('images/arrow-right.svg')}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
