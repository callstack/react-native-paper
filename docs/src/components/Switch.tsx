interface SwitchProps {
  id: string;
  value: boolean;
  onValueChange?: () => void;
  color: string;
}

const Switch = ({ id, value, onValueChange, color }: SwitchProps) => {
  const background = value ? color : 'none';
  return (
    <>
      <input
        checked={value}
        onChange={onValueChange}
        className="react-switch-checkbox"
        id={id}
        type="checkbox"
      />
      <label style={{ background }} className="react-switch-label" htmlFor={id}>
        <span className={`react-switch-button`} />
      </label>
    </>
  );
};

export default Switch;
