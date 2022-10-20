/* @flow */

import React, { useState, useEffect } from 'react';

import createDynamicThemeColors from '../utils/createDynamicColorTheme';

type SearchbarProps = {
  value: string,
  type: String,
  onChange?: SyntheticInputEvent<HTMLInputElement>,
  placeholder: String,
};

const Searchbar = (props: SearchbarProps) => {
  return <input {...props} style={styles.searchBar} />;
};

const defaultColor = 'purple';

const DynamicColorTheme = () => {
  const [color, setColor] = useState(defaultColor);
  const [schemes, setSchemes] = useState({ light: {} });

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (CSS.supports('color', color)) {
        setSchemes(createDynamicThemeColors({ sourceColor: color }));
        setError('');
      } else if (!color) {
        setColor(defaultColor);
      } else {
        // handle error
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [color]);

  const onSearch = (e: SyntheticInputEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  return (
    <div style={styles.container}>
      <Searchbar type="search" value={color} onChange={onSearch} />
      <div style={styles.grid}>
        {Object.entries(schemes.light).map((item, index) => {
          return (
            <span
              key={index}
              style={{
                backgroundColor: item[1],
                ...styles.colorView,
              }}
            >
              {item[0]}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    margin: '16px',
  },
  searchBar: {
    boxSizing: 'border-box',
    appearance: 'none',
    border: 0,
    display: 'block',
    width: '20%',
    padding: '12px',
    fontSize: '1em',
    backgroundColor: '#f0f0f0',
    borderRadius: '3px',
    outline: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'auto auto auto auto',
    gridGap: '10px',
  },
  colorView: {
    margin: '10px',
    border: '1px solid #ccc',
    padding: '5px',
  },
};

export default DynamicColorTheme;
