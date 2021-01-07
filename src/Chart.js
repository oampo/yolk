import React, { useState, useEffect, useCallback } from "react";
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
    clearSelection,
  } = props;

  const [drawing, setDrawing] = useState(false);
  const [currentStitches, setCurrentStitches] = useState([]);

  function handleMouseDown(e, rowIndex, columnIndex) {
    if (e.type === "mousedown") {
      e.preventDefault();
    }
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
    } else if (tool === "select") {
      setSelectionStart(rowIndex, columnIndex);
    }
  }

  const handleMouseOver = useCallback(
    (e, rowIndex, columnIndex) => {
      if (e.type === "mouseover") {
        const buttonPressed =
          e.buttons !== undefined ? e.buttons : e.nativeEvent.which;
        if (buttonPressed !== 1) {
          // Left button not pressed
          return;
        }
      }

      setDrawing(true);

      if (tool === "brush") {
        if (
          currentStitches.length &&
          currentStitches[currentStitches.length - 1].row === rowIndex &&
          currentStitches[currentStitches.length - 1].column === columnIndex
        ) {
          // Touch over the same stitch as before - no need to record it again
          return;
        }
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
      } else if (tool === "select") {
        if (drawing === false) {
          setSelectionStart(rowIndex, columnIndex);
        } else {
          setSelectionEnd(rowIndex, columnIndex);
        }
      }
    },
    [
      chart,
      currentStitches,
      drawing,
      selectedColor,
      setSelectionStart,
      setSelectionEnd,
      setStitch,
      tool,
    ]
  );

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
    document.addEventListener("touchend", onMouseUp);
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchend", onMouseUp);
    };
  }, [drawing, currentStitches, onDrawingEnd, tool]);

  useEffect(() => {
    if (!selectionBounds || tool !== "select") {
      return;
    }

    function onMouseDown(e) {
      if (
        e.target.classList.contains("chart-stitch") ||
        e.target.closest(".toolbar-copy-button") ||
        e.target.closest(".toolbar-paste-button") ||
        e.target.closest(".toolbar-select-button")
      ) {
        return;
      }
      clearSelection();
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [selectionBounds, tool, clearSelection]);

  useEffect(() => {
    if (!drawing) {
      return;
    }
    function onTouchMove(e) {
      const touch = e.touches[0];
      const element = document.elementFromPoint(
        touch.pageX - window.pageXOffset,
        touch.pageY - window.pageYOffset
      );
      if (!element.classList.contains("chart-stitch")) {
        return;
      }
      const row = Number(element.dataset.row);
      const column = Number(element.dataset.column);
      handleMouseOver(e, row, column);
    }
    document.addEventListener("touchmove", onTouchMove);
    return () => document.removeEventListener("touchmove", onTouchMove);
  }, [drawing, handleMouseOver]);

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
            data-row={rowIndex}
            data-column={columnIndex}
            onMouseDown={(e) => handleMouseDown(e, rowIndex, columnIndex)}
            onTouchStart={(e) => handleMouseDown(e, rowIndex, columnIndex)}
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
          data-row={rowIndex}
          data-column={columnIndex}
          onMouseDown={(e) => handleMouseDown(e, rowIndex, columnIndex)}
          onTouchStart={(e) => handleMouseDown(e, rowIndex, columnIndex)}
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
