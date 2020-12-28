import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import ColorPaletteColor from "./ColorPaletteColor";
import "./ColorPalette.css";

export default function ColorPalette(props) {
  const { colors, selectedColor, selectColor, setColor, addColor } = props;

  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    function hideColorPicker(e) {
      if (editingIndex === null) {
        return;
      }

      if (e.target.closest(".color-palette-color-picker-tooltip")) {
        return;
      }

      setEditingIndex(null);
    }

    document.addEventListener("click", hideColorPicker);
    return () => document.removeEventListener("click", hideColorPicker);
  }, [editingIndex]);

  function renderNone() {
    let classes = "toolbar-button color-palette-color-none";
    if (selectedColor === null) {
      classes += " color-palette-color-selected";
    }
    return (
      <div className={classes} onClick={() => selectColor(null)}>
        X
      </div>
    );
  }

  const colorButtons = colors.map((color, index) => (
    <ColorPaletteColor
      key={index}
      color={color}
      selectColor={selectColor}
      setColor={setColor}
      setEditing={setEditingIndex}
      isSelected={index === selectedColor}
      isEditing={index === editingIndex}
      index={index}
    />
  ));

  return (
    <div className="color-palette">
      {renderNone()}
      {colorButtons}
      <div className="toolbar-button color-palette-add" onClick={addColor}>
        <FontAwesomeIcon icon={faPlus} />
      </div>
    </div>
  );
}
