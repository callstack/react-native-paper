import BannerExample from './BannerExample';

const lightImages = [
  'button.png',
  'input.png',
  'card.png',
  'searchbar.png',
  'appbar.png',
  'snackbar.png',
  'chip.png',
  'list.png',
  'list-accordion.png',
  'typography.png',
  'bottom-navigation.png',
  'fab.png',
];

const darkImages = [
  'button-dark.png',
  'input-dark.png',
  'card-dark.png',
  'searchbar-dark.png',
  'appbar-dark.png',
  'snackbar-dark.png',
  'chip-dark.png',
  'list-dark.png',
  'list-accordion-dark.png',
  'typography-dark.png',
  'bottom-navigation-dark.png',
  'fab-dark.png',
];

const renderGallery = (images: string[]) =>
  images.map((imageName) => (
    <img
      alt=""
      className="paper-home-showcase__gallery-image"
      key={imageName}
      src={`/react-native-paper/gallery/${imageName}`}
    />
  ));

export default function PaperHomeShowcase() {
  return (
    <section className="paper-home-showcase">
      <div className="paper-home-showcase__intro">
        <div>
          <p className="paper-home-showcase__eyebrow">In practice</p>
          <h2 className="paper-home-showcase__title">
            Material components, typography, and controls
          </h2>
        </div>
        <p className="paper-home-showcase__copy">
          Browse the component surface the way it appears in real product UI,
          not as generic documentation chrome.
        </p>
      </div>

      <div className="paper-home-showcase__links">
        Or check the demo app on{' '}
        <a href="https://apps.apple.com/app/react-native-paper/id1548934513">
          iOS
        </a>{' '}
        or{' '}
        <a href="https://play.google.com/store/apps/details?id=com.callstack.reactnativepaperexample">
          Android
        </a>
        .
      </div>

      <BannerExample />

      <div className="paper-home-showcase__gallery gallery-light">
        {renderGallery(lightImages)}
      </div>

      <div className="paper-home-showcase__gallery gallery-dark">
        {renderGallery(darkImages)}
      </div>
    </section>
  );
}
