import React, { useState, useEffect } from "react";
import "./Chart.css";

export default function Chart(props) {
  const {
    chart,
    colors,
    selectedColor,
    setStitch,
    onDrawingEnd,
    visible,
  } = props;

  const [drawing, setDrawing] = useState(false);
  const [currentStitches, setCurrentStitches] = useState([]);

  function handleClick(e, rowIndex, columnIndex) {
    e.preventDefault();
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

  function handleMouseOver(e, rowIndex, columnIndex) {
    const buttonPressed =
      e.buttons !== undefined ? e.buttons : e.nativeEvent.which;
    if (buttonPressed !== 1) {
      // Left button not pressed
      return;
    }

    setDrawing(true);
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

  useEffect(() => {
    if (!drawing) {
      return;
    }

    function onMouseUp() {
      setDrawing(false);
      onDrawingEnd(currentStitches);
      setCurrentStitches([]);
    }
    document.addEventListener("mouseup", onMouseUp);
    return () => document.removeEventListener("mouseup", onMouseUp);
  }, [drawing, currentStitches, onDrawingEnd]);

  const rows = chart.map((row, rowIndex) => {
    const stitches = row.map((stitch, columnIndex) => {
      if (stitch === null || colors[stitch] === null) {
        return (
          <div
            key={columnIndex}
            className="chart-stitch chart-stitch-ignore"
            onMouseDown={(e) => handleClick(e, rowIndex, columnIndex)}
            onMouseOver={(e) => handleMouseOver(e, rowIndex, columnIndex)}
          />
        );
      }

      const style = {
        backgroundColor: colors[stitch],
      };
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
