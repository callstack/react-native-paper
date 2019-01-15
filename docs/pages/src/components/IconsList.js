/* @flow */

import * as React from 'react';
import { css } from 'linaria';
import icons from 'react-native-vector-icons/glyphmaps/MaterialIcons.json';

const container = css`
  margin: 16px 0;
`;

const iconContainer = css`
  appearance: none;
  border: 0;
  background: 0;
  outline: 0;
  display: flex;
  flex-direction: column;
  width: 124px;
  height: 124px;
  align-items: center;
  text-align: center;

  @media (max-width: 680px) {
    width: 96px;
  }
`;

const icon = css`
  display: block;
  margin: 16px;
  font-family: 'MaterialIcons';
  font-size: 48px;
`;

const iconName = css`
  display: block;
  font-size: 12px;
`;

const results = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 24px 0;

  &:last-child {
    justify-content: flex-start;
  }
`;

const searchbar = css`
  box-sizing: border-box;
  appearance: none;
  border: 0;
  display: block;
  width: 100%;
  padding: 12px;
  font-size: 1em;
  background-color: #f0f0f0;
  border-radius: 3px;
  transition: background-color 0.3s;
  outline: 0;

  &:focus,
  &:hover {
    background-color: #e7e7e7;
  }

  *:focus-visible {
    outline: auto;
  }
`;

type State = {
  query: string,
};

export default class IconsList extends React.Component<{}, State> {
  state = { query: '' };

  _getIconCharacter = (name: string) => String.fromCharCode(icons[name]);

  _getResults = () => {
    const iconNames = Object.keys(icons);

    if (this.state.query) {
      const query = this.state.query.toLowerCase();

      return iconNames.filter(
        item =>
          item.includes(query.replace(/\s/g, '-')) ||
          item.replace(/-/g, '').includes(query)
      );
    }

    return iconNames;
  };

  _handleInputChange = (e: SyntheticInputEvent<HTMLInputElement>) =>
    this.setState({ query: e.target.value });

  _handleIconClick = (e: SyntheticEvent<HTMLButtonElement>) => {
    const range = document.createRange();

    range.selectNode(e.currentTarget.childNodes[1]);

    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  };

  render() {
    const searchResults = this._getResults();

    return (
      <div className={container}>
        <input
          type="search"
          value={this.state.query}
          onChange={this._handleInputChange}
          placeholder="Find icon by name…"
          className={searchbar}
        />
        {searchResults.length ? (
          <div className={results}>
            {searchResults.map(name => (
              <button
                key={name}
                type="button"
                onClick={this._handleIconClick}
                className={iconContainer}
              >
                <span className={icon}>{this._getIconCharacter(name)}</span>
                <span className={iconName}>{name}</span>
              </button>
            ))}
          </div>
        ) : (
          <p>No matching icon found :(</p>
        )}
      </div>
    );
  }
}
