import React from "react";
import { ChromePicker } from "react-color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette, faTrash } from "@fortawesome/free-solid-svg-icons";

import "./ColorPaletteColor.css";

export default function ColorPaletteColor(props) {
  const {
    color,
    isSelected,
    index,
    selectColor,
    setColor,
    isEditing,
    setEditing,
  } = props;

  function updateColor(color) {
    setColor(index, color.hex);
  }

  return (
    <div className="color-palette-color-wrapper">
      <div
        className={`toolbar-button color-palette-color ${
          isSelected ? "color-palette-color-selected" : ""
        }`}
        style={{ backgroundColor: color }}
        onClick={() => selectColor(index)}
      >
        <div className="color-palette-color-controls">
          <button
            className="color-palette-color-control color-palette-color-edit"
            onClick={(e) => {
              // Don't select the color when we choose to edit it
              e.stopPropagation();
              setEditing(isEditing ? null : index);
            }}
          >
            <FontAwesomeIcon icon={faPalette} />
          </button>
          <button className="color-palette-color-control color-palette-color-delete">
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
      {isEditing && (
        <div className="color-palette-color-picker-tooltip">
          <ChromePicker disableAlpha color={color} onChange={updateColor} />
        </div>
      )}
    </div>
  );
}
