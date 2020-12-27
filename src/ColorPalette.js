import React from "react";
import "./ColorPalette.css";

export default function ColorPalette(props) {
  const { colors, selectedColor, selectColor } = props;

  function renderNone() {
    let classes = "color-palette-color color-palette-color-none";
    if (selectedColor === null) {
      classes += " color-palette-color-selected";
    }
    return <div className={classes} onClick={() => selectColor(null)} />;
  }

  const colorButtons = colors.map((color, index) => (
    <div
      key={index}
      className={`color-palette-color ${
        index === selectedColor ? "color-palette-color-selected" : ""
      }`}
      style={{ backgroundColor: color }}
      onClick={() => selectColor(index)}
    />
  ));
  return (
    <div className="color-palette">
      {renderNone()}
      {colorButtons}
    </div>
  );
}
