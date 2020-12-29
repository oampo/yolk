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
      if (addToHistory) {
        setUndoHistory(
          history.push(undoHistory, history.resize(chart, newChart))
        );
      }
    },
    [chart, undoHistory]
  );

  function setStitch(rowIndex, columnIndex, colorId = selectedColor) {
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
  }

  const setStitches = useCallback(
    (stitches) => {
      const newChart = chart.map((row) => [...row]);
      stitches.forEach((stitch) => {
        newChart[stitch.row][stitch.column] = stitch.color;
      });
      setChart(newChart);
    },
    [chart]
  );

  function addStitchesToHistory(stitches) {
    setUndoHistory(history.push(undoHistory, history.setStitches(stitches)));
  }

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
        setChart(action.fromChart);
        break;
      }
      case history.SET_STITCHES: {
        setStitches(
          action.stitches
            .map((stitch) => ({
              row: stitch.row,
              column: stitch.column,
              color: stitch.fromColor,
            }))
            .reverse()
        );
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
  }, [undoHistory, setStitches, setColor, colors]);

  const redo = useCallback(() => {
    const [action, newHistory] = history.advance(undoHistory);
    if (!action) {
      return;
    }
    switch (action.type) {
      case history.RESIZE: {
        setChart(action.toChart);
        break;
      }
      case history.SET_STITCHES: {
        setStitches(
          action.stitches.map((stitch) => ({
            row: stitch.row,
            column: stitch.column,
            color: stitch.toColor,
          }))
        );
        break;
      }
      case history.SET_COLOR: {
        setColor(action.id, action.toColor, false);
        break;
      }
      case history.ADD_COLOR: {
        addColor(false);
        break;
      }
      case history.DELETE_COLOR: {
        deleteColor(action.id, false);
        break;
      }
      default:
        break;
    }

    setUndoHistory(newHistory);
  }, [undoHistory, setStitches, setColor, addColor, deleteColor]);

  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        // Only do our redo/undo actions
        event.preventDefault();
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="App">
      <form>
        <label htmlFor="rows">Rows</label>
        <input
          id="rows"
          type="number"
          min="1"
          value={chart.length}
          onChange={(e) => setSize(Number(e.target.value), chart[0].length)}
        />
        <label htmlFor="stitches">Stitches</label>
        <input
          id="stitches"
          type="number"
          min="1"
          value={chart[0].length}
          onChange={(e) => setSize(chart.length, Number(e.target.value))}
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
        colors={colors}
        setStitch={setStitch}
        selectedColor={selectedColor}
        onDrawingEnd={addStitchesToHistory}
      />

      <YokeView chart={chart} colors={colors} numRepeats={numRepeats} />
    </div>
  );
}
