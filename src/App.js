import React, { useState } from "react";
import ColorPalette from "./ColorPalette";
import Chart from "./Chart";
import YokeView from "./YokeView";

export default function App(props) {
  const [colors, setColors] = useState(["#e0e0e0", "#f4eda1"]);
  const [selectedColor, setSelectedColor] = useState(0);
  const [chart, setChart] = useState([[null]]);
  const [numRows, setNumRows] = useState(1);
  const [numColumns, setNumColumns] = useState(1);

  function createRow(length) {
    return Array(length).fill(null);
  }

  function setRows(numRows) {
    let newChart = [];
    for (let i = 0; i < numRows; i++) {
      newChart.push(chart.length > i ? chart[i] : createRow(numColumns));
    }
    setChart(newChart);
    setNumRows(numRows);
  }

  function setColumns(numColumns) {
    const newChart = chart.map((row) =>
      row.length > numColumns
        ? row.slice(0, numColumns)
        : [...row, ...createRow(numColumns - row.length)]
    );

    setChart(newChart);
    setNumColumns(numColumns);
  }

  function setStitch(rowIndex, columnIndex) {
    const newChart = chart.map((row, index) => {
      if (index !== rowIndex) {
        return row;
      }
      return row.map((stitch, index) => {
        if (index !== columnIndex) {
          return stitch;
        }
        if (selectedColor === null) {
          return null;
        }

        return {
          color: selectedColor,
        };
      });
    });

    setChart(newChart);
  }

  return (
    <div className="App">
      <form>
        <label htmlFor="rows">Rows</label>
        <input
          id="rows"
          type="number"
          min="1"
          value={numRows}
          onChange={(e) => setRows(Number(e.target.value))}
        />
        <label htmlFor="stitches">Stitches</label>
        <input
          id="stitches"
          type="number"
          min="1"
          value={numColumns}
          onChange={(e) => setColumns(Number(e.target.value))}
        />
      </form>
      <ColorPalette
        colors={colors}
        selectedColor={selectedColor}
        selectColor={setSelectedColor}
      />
      <Chart
        chart={chart}
        numRows={numRows}
        numColumns={numColumns}
        colors={colors}
        setRows={setRows}
        setColumns={setColumns}
        setStitch={setStitch}
      />

      <YokeView chart={chart} colors={colors} />
    </div>
  );
}
