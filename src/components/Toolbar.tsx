import React from "react";

type ToolbarProps = {
  onAddBox: () => void;
};

const Toolbar: React.FC<ToolbarProps> = ({ onAddBox }) => {
  return (
    <div className="toolbar">
      <button onClick={onAddBox}>Add Box</button>
      <button>Remove Box</button>
      <input aria-label="Box color" type="color" />
      <span>No boxes selected</span>
    </div>
  );
};

export default Toolbar;
