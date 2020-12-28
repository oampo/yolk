import React, { useState, useEffect, useCallback } from "react";
import ColorPalette from "./ColorPalette";
import Chart from "./Chart";
import YokeView from "./YokeView";
import * as history from "./history";

export default function App(props) {
  const [colors, setColors] = useState({ 0: "#e0e0e0", 1: "#f4eda1" });
  const [selectedColor, setSelectedColor] = useState(0);
  const [nextColorId, setNextColorId] = useState(2);
  const [chart, setChart] = useState([[null]]);
  const [numRows, setNumRows] = useState(1);
  const [numColumns, setNumColumns] = useState(1);
  const [numRepeats, setNumRepeats] = useState(16);
  const [undoHistory, setUndoHistory] = useState(history.create());

  const setSize = useCallback(
    (rows, columns, addToHistory = true) => {
      const newChart = [];
      for (let i = 0; i < rows; i++) {
        newChart.push([]);
        for (let j = 0; j < columns; j++) {
          if (i < chart.length && j < chart[i].length) {
            newChart[i].push(chart[i][j]);
          } else {
            newChart[i].push(null);
          }
        }
      }
      setChart(newChart);
      setNumRows(rows);
      setNumColumns(columns);
      if (addToHistory) {
        setUndoHistory(
          history.push(
            undoHistory,
            history.resize(numRows, numColumns, rows, columns)
          )
        );
      }
    },
    [chart, numColumns, numRows, undoHistory]
  );

  const setStitch = useCallback(
    (rowIndex, columnIndex, colorId = selectedColor, addToHistory = true) => {
      const newChart = chart.map((row, index) => {
        if (index !== rowIndex) {
          return row;
        }
        return row.map((stitch, index) => {
          if (index !== columnIndex) {
            return stitch;
          }
          if (colorId === null) {
            return null;
          }

          return colorId;
        });
      });

      setChart(newChart);

      if (addToHistory) {
        setUndoHistory(
          history.push(
            undoHistory,
            history.setStitch(
              rowIndex,
              columnIndex,
              chart[rowIndex][columnIndex],
              selectedColor
            )
          )
        );
      }
    },
    [chart, selectedColor, undoHistory]
  );

  const setColor = useCallback(
    (id, newColor, addToHistory = true) => {
      setColors({
        ...colors,
        [id]: newColor,
      });

      if (addToHistory) {
        setUndoHistory(
          history.push(undoHistory, history.setColor(id, colors[id], newColor))
        );
      }
    },
    [colors, undoHistory]
  );

  const addColor = useCallback(
    (addToHistory = true) => {
      setColors({ ...colors, [nextColorId]: "#FFFFFF" });
      setSelectedColor(nextColorId);
      setNextColorId(nextColorId + 1);
      if (addToHistory) {
        setUndoHistory(
          history.push(undoHistory, history.addColor(nextColorId))
        );
      }
      return nextColorId;
    },
    [colors, nextColorId, undoHistory]
  );

  const deleteColor = useCallback(
    (id, addToHistory = true) => {
      setColors({ ...colors, [id]: null });
      if (selectedColor === id) {
        setSelectedColor(null);
      }
      if (addToHistory) {
        setUndoHistory(
          history.push(undoHistory, history.deleteColor(id, colors[id]))
        );
      }
    },
    [colors, selectedColor, undoHistory]
  );

  const undo = useCallback(() => {
    const [action, newHistory] = history.pop(undoHistory);
    if (!action) {
      return;
    }
    switch (action.type) {
      case history.RESIZE: {
        setSize(action.fromRows, action.fromColumns, false);
        break;
      }
      case history.SET_STITCH: {
        setStitch(action.row, action.column, action.fromColor, false);
        break;
      }
      case history.SET_COLOR: {
        setColor(action.id, action.fromColor, false);
        break;
      }
      case history.ADD_COLOR: {
        const { [action.id]: found, ...rest } = colors;
        setColors(rest);
        setNextColorId(action.id);
        break;
      }
      case history.DELETE_COLOR: {
        setColors({ ...colors, [action.id]: action.color });
        break;
      }
      default:
        break;
    }
    setUndoHistory(newHistory);
  }, [setSize, undoHistory, setStitch, setColor, colors]);

  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key === "z") {
        undo();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [undo]);

  return (
    <div className="App">
      <form>
        <label htmlFor="rows">Rows</label>
        <input
          id="rows"
          type="number"
          min="1"
          value={numRows}
          onChange={(e) => setSize(Number(e.target.value), numColumns)}
        />
        <label htmlFor="stitches">Stitches</label>
        <input
          id="stitches"
          type="number"
          min="1"
          value={numColumns}
          onChange={(e) => setSize(numRows, Number(e.target.value))}
        />
        <label htmlFor="repeats">Repeats</label>
        <input
          id="repeats"
          type="number"
          min="3"
          value={numRepeats}
          onChange={(e) => setNumRepeats(Number(e.target.value))}
        />
      </form>
      <ColorPalette
        colors={colors}
        selectedColor={selectedColor}
        selectColor={setSelectedColor}
        setColor={setColor}
        addColor={addColor}
        deleteColor={deleteColor}
      />
      <Chart
        chart={chart}
        numRows={numRows}
        numColumns={numColumns}
        colors={colors}
        setStitch={setStitch}
      />

      <YokeView chart={chart} colors={colors} numRepeats={numRepeats} />
    </div>
  );
}
