import React from "react";

type ToolbarProps = {
  onAddBox: () => void;
  onRemoveBox: () => void;
  colorValue: string;
  onChangeColor: (color: string) => void;
  isColorPickerDisabled: boolean;
  selectionLabel: string;
};

const Toolbar: React.FC<ToolbarProps> = ({
  onAddBox,
  onRemoveBox,
  colorValue,
  onChangeColor,
  isColorPickerDisabled,
  selectionLabel,
}) => {
  const handleColorInput = React.useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      onChangeColor(event.currentTarget.value);
    },
    [onChangeColor],
  );

  return (
    <div className="toolbar">
      <button onClick={onAddBox}>Add Box</button>
      <button onClick={onRemoveBox}>Remove Box</button>
      <input
        aria-label="Box color"
        type="color"
        value={colorValue}
        onChange={handleColorInput}
        onInput={handleColorInput}
        disabled={isColorPickerDisabled}
      />
      <span>{selectionLabel}</span>
    </div>
  );
};

export default Toolbar;
