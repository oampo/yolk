import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import ColorPaletteColor from "./ColorPaletteColor";
import "./ColorPalette.scss";

export default function ColorPalette(props) {
  const {
    colors,
    selectedColor,
    selectColor,
    setColor,
    addColor,
    deleteColor,
  } = props;

  const [editingId, setEditingId] = useState(null);

  function addColorAndEdit(e) {
    e.stopPropagation();
    const id = addColor();
    setEditingId(id);
  }

  useEffect(() => {
    function hideColorPicker(e) {
      if (editingId === null) {
        return;
      }

      if (e.target.closest(".color-palette-color-picker-tooltip")) {
        return;
      }

      setEditingId(null);
    }

    document.addEventListener("click", hideColorPicker);
    return () => document.removeEventListener("click", hideColorPicker);
  }, [editingId]);

  function renderNone() {
    let classes = "toolbar-button color-palette-color-none";
    if (selectedColor === null) {
      classes += " color-palette-color-selected";
    }
    return (
      <button
        className={classes}
        aria-pressed={selectedColor === null}
        onClick={() => selectColor(null)}
      >
        X
      </button>
    );
  }

  const colorButtons = Object.entries(colors)
    .filter(([_, color]) => color !== null)
    .map(([stringId, color]) => {
      const id = Number(stringId);
      return (
        <ColorPaletteColor
          key={id}
          color={color}
          selectColor={selectColor}
          setColor={setColor}
          setEditing={setEditingId}
          deleteColor={deleteColor}
          isSelected={id === selectedColor}
          isEditing={id === editingId}
          id={id}
        />
      );
    });

  return (
    <div className="color-palette">
      {renderNone()}
      {colorButtons}
      <div
        className="toolbar-button color-palette-add"
        onClick={addColorAndEdit}
      >
        <FontAwesomeIcon icon={faPlus} />
      </div>
    </div>
  );
}
