import React from 'react';

interface SwitchProps {
  value: boolean;
  onValueChange?: () => void;
  color: string;
}

const Switch = ({ value, onValueChange, color }: SwitchProps) => {
  return (
    <>
      <input
        checked={value}
        onChange={onValueChange}
        className="react-switch-checkbox"
        id={`react-switch-new`}
        type="checkbox"
      />
      <label
        style={{ background: value ? color : 'none' }}
        className="react-switch-label"
        htmlFor={`react-switch-new`}
      >
        <span className={`react-switch-button`} />
      </label>
    </>
  );
};

export default Switch;
