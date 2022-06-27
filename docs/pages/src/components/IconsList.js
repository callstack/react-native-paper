/* @flow */

import * as React from 'react';
import { styled } from 'linaria/react';
import icons from 'react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';

type State = {
  query: string,
};

export default class IconsList extends React.Component<{}, State> {
  state = { query: '' };

  _getIconCharacter = (name: string) => String.fromCodePoint(icons[name]);

  _getResults = () => {
    const iconNames = Object.keys(icons);

    if (this.state.query) {
      const query = this.state.query.toLowerCase();

      return iconNames.filter(
        (item) =>
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

    range.selectNode(e.currentTarget.childNodes[1].childNodes[0]);

    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  };

  render() {
    const searchResults = this._getResults();

    return (
      <Container>
        <Searchbar
          type="search"
          value={this.state.query}
          onChange={this._handleInputChange}
          placeholder="Find icon by name…"
        />
        {searchResults.length ? (
          <Results>
            {searchResults.map((name) => (
              <IconContainer
                key={name}
                type="button"
                onClick={this._handleIconClick}
              >
                <Icon>{this._getIconCharacter(name)}</Icon>
                <IconName>{name}</IconName>
              </IconContainer>
            ))}
          </Results>
        ) : (
          <p>No matching icon found :(</p>
        )}
      </Container>
    );
  }
}

const Container = styled.div`
  margin: 16px 0;
`;

const IconContainer = styled.button`
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

const Icon = styled.span`
  display: block;
  margin: 16px;
  font-family: 'MaterialCommunityIcons';
  font-size: 48px;
  color: var(--theme-text-color);
`;

const IconName = styled.span`
  display: block;
  font-size: 12px;
  color: var(--theme-text-color);
`;

const Results = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 24px 0;

  &:last-child {
    justify-content: flex-start;
  }
`;

const Searchbar = styled.input`
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
