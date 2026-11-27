import SearchbarComponent from './Searchbar';
import SearchbarResults from './SearchbarResults';

const Searchbar = Object.assign(
  // @component ./Searchbar.tsx
  SearchbarComponent,
  {
    // @component ./SearchbarResults.tsx
    Results: SearchbarResults,
  }
);

export default Searchbar;
