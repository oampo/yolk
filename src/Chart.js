import React from "react";
import "./Chart.css";

export default function Chart(props) {
  const { chart, colors, setStitch } = props;

  function handleClick(e, rowIndex, columnIndex) {
    setStitch(rowIndex, columnIndex);
  }

  function handleMouseOver(e, rowIndex, columnIndex) {
    const buttonPressed =
      e.buttons !== undefined ? e.buttons : e.nativeEvent.which;
    if (buttonPressed !== 1) {
      // Left button not pressed
      return;
    }

    setStitch(rowIndex, columnIndex);
  }

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
      </div>
    );
  });
  return <div className="chart">{rows}</div>;
}
