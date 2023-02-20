import React, { useState } from 'react';

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';

const icons: { [key in string]: number } = {
  ...MaterialCommunityIcons,
};

export default function IconsList() {
  const [query, setQuery] = useState('');

  const iconNames = Object.keys(icons).filter(
    (item) =>
      item.includes(query.replace(/\s/g, '-')) ||
      item.replace(/-/g, '').includes(query)
  );

  return (
    <div className="icons-list-container">
      <input
        className="icons-list-searchbar"
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
        }}
        placeholder="Find icon by name…"
      />
      {iconNames.length ? (
        <div className="icons-list-results">
          {iconNames.map((name) => (
            <div className="icons-list-icon-container" key={name}>
              <span className="icons-list-icon">
                {String.fromCodePoint(icons[name])}
              </span>
              <span className="icons-list-icon-name">{name}</span>
            </div>
          ))}
        </div>
      ) : (
        <p>No matching icon found :(</p>
      )}
    </div>
  );
}
