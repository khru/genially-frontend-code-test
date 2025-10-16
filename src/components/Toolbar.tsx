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
    <div className="toolbar" role="region" aria-label="Canvas controls">
      <button className="toolbar__button toolbar__button--primary" onClick={onAddBox} type="button">
        Add Box
      </button>
      <button className="toolbar__button toolbar__button--danger" onClick={onRemoveBox} type="button">
        Remove Box
      </button>
      <label className="toolbar__colorControl">
        <span className="toolbar__colorLabel">Color</span>
        <input
          className="toolbar__colorInput"
          aria-label="Box color"
          type="color"
          value={colorValue}
          onChange={handleColorInput}
          onInput={handleColorInput}
          disabled={isColorPickerDisabled}
        />
      </label>
      <span className="toolbar__summary">{selectionLabel}</span>
    </div>
  );
};

export default Toolbar;
