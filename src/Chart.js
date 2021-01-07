import React, { useState, useEffect } from "react";
import "./Chart.scss";

const SELECTION_BORDER_STYLE = "3px dashed black";

export default function Chart(props) {
  const {
    chart,
    colors,
    selectedColor,
    setStitch,
    onDrawingEnd,
    visible,
    tool,
    selectionBounds,
    setSelectionStart,
    setSelectionEnd,
    clearSelection
  } = props;

  const [drawing, setDrawing] = useState(false);
  const [currentStitches, setCurrentStitches] = useState([]);

  function handleClick(e, rowIndex, columnIndex) {
    e.preventDefault();
    setDrawing(true);

    if (tool === "brush") {
      setStitch(rowIndex, columnIndex);
      setDrawing(true);
      setCurrentStitches([
        {
          row: rowIndex,
          column: columnIndex,
          fromColor: chart[rowIndex][columnIndex],
          toColor: selectedColor,
        },
      ]);
    }
    else if (tool === "select") {
      setSelectionStart(rowIndex, columnIndex);
    }
  }

  function handleMouseOver(e, rowIndex, columnIndex) {
    const buttonPressed =
      e.buttons !== undefined ? e.buttons : e.nativeEvent.which;
    if (buttonPressed !== 1) {
      // Left button not pressed
      return;
    }

    setDrawing(true);

    if (tool === "brush") {
      setStitch(rowIndex, columnIndex);
      setCurrentStitches([
        ...currentStitches,
        {
          row: rowIndex,
          column: columnIndex,
          fromColor: chart[rowIndex][columnIndex],
          toColor: selectedColor,
        },
      ]);
    }
    else if (tool === "select") {
      if (drawing === false) {
        setSelectionStart(rowIndex, columnIndex);
      }
      else {
        setSelectionEnd(rowIndex, columnIndex);
      }
    }
  }

  useEffect(() => {
    if (!drawing) {
      return;
    }

    function onMouseUp() {
      setDrawing(false);

      if (tool === "brush") {
        onDrawingEnd(currentStitches);
        setCurrentStitches([]);
      }
    }
    document.addEventListener("mouseup", onMouseUp);
    return () => document.removeEventListener("mouseup", onMouseUp);
  }, [drawing, currentStitches, onDrawingEnd, tool]);

  useEffect(() => {
    if (!selectionBounds || tool !== 'select') {
      return;
    }

    function onMouseDown(e) {
      if (e.target.classList.contains('chart-stitch')) {
        return;
      }
      clearSelection();
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [selectionBounds, tool, clearSelection]);

  function getBorders(rowIndex, columnIndex, selectionBounds) {
    if (!selectionBounds) {
      return {};
    }

    return {
      borderTop:
        columnIndex >= selectionBounds.left &&
        columnIndex <= selectionBounds.right &&
        rowIndex === selectionBounds.top
          ? SELECTION_BORDER_STYLE
          : undefined,
      borderBottom:
        columnIndex >= selectionBounds.left &&
        columnIndex <= selectionBounds.right &&
        rowIndex === selectionBounds.bottom
          ? SELECTION_BORDER_STYLE
          : undefined,
      borderLeft:
        rowIndex >= selectionBounds.top &&
        rowIndex <= selectionBounds.bottom &&
        columnIndex === selectionBounds.left
          ? SELECTION_BORDER_STYLE
          : undefined,
      borderRight:
        rowIndex >= selectionBounds.top &&
        rowIndex <= selectionBounds.bottom &&
        columnIndex === selectionBounds.right
          ? SELECTION_BORDER_STYLE
          : undefined,
    };
  }

  const rows = chart.map((row, rowIndex) => {
    const stitches = row.map((stitch, columnIndex) => {
      const style = getBorders(rowIndex, columnIndex, selectionBounds);

      if (stitch === null || colors[stitch] === null) {
        return (
          <div
            key={columnIndex}
            style={style}
            className="chart-stitch chart-stitch-ignore"
            onMouseDown={(e) => handleClick(e, rowIndex, columnIndex)}
            onMouseOver={(e) => handleMouseOver(e, rowIndex, columnIndex)}
          />
        );
      }

      style.backgroundColor = colors[stitch];

      return (
        <div
          key={columnIndex}
          className="chart-stitch"
          style={style}
          onMouseDown={(e) => handleClick(e, rowIndex, columnIndex)}
          onMouseOver={(e) => handleMouseOver(e, rowIndex, columnIndex)}
        />
      );
    });

    return (
      <div className="chart-row" key={rowIndex}>
        {stitches}
        <div className="chart-row-index">{chart.length - rowIndex}</div>
      </div>
    );
  });
  return (
    <div className={"chart " + (visible ? "" : "chart-hidden")}>{rows}</div>
  );
}
