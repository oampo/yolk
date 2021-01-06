import React, { useState, useEffect, useCallback } from "react";
import Header from "./Header";
import ColorPalette from "./ColorPalette";
import Chart from "./Chart";
import Settings from "./Settings";
import Toolbar from './Toolbar';
import YokeView from "./YokeView";
import * as history from "./history";
import "./App.css";

export default function App(props) {
  const [colors, setColors] = useState({ 0: "#e0e0e0", 1: "#f4eda1" });
  const [selectedColor, setSelectedColor] = useState(0);
  const [nextColorId, setNextColorId] = useState(2);
  const [chart, setChart] = useState([
    [null, null],
    [null, null],
  ]);
  const [numRepeats, setNumRepeats] = useState(16);
  const [direction, setDirection] = useState("top-down");
  const [undoHistory, setUndoHistory] = useState(history.create());
  const [tool, setTool] = useState("brush");
  const [view, setView] = useState("edit");
  const [settingsOpen, setSettingsOpen] = useState(false);

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

  const flip = useCallback((addToHistory=true) => {
    setChart(chart.slice().reverse());
  });



  function toggleSettings() {
    setSettingsOpen(!settingsOpen);
  }

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
    <div className="app">
      <div className="top">
        <Header toggleSettings={toggleSettings} />
        <Settings
          setSize={setSize}
          setNumRepeats={setNumRepeats}
          setDirection={setDirection}
          chart={chart}
          numRepeats={numRepeats}
          isOpen={settingsOpen}
          direction={direction}
        />
      </div>
      <div className="bottom">
        <section className="sidebar">
          <Toolbar tool={tool} setTool={setTool} flip={flip} />
          <ColorPalette
            colors={colors}
            selectedColor={selectedColor}
            selectColor={setSelectedColor}
            setColor={setColor}
            addColor={addColor}
            deleteColor={deleteColor}
          />
        </section>
        <main>
          <Chart
            chart={chart}
            colors={colors}
            setStitch={setStitch}
            selectedColor={selectedColor}
            onDrawingEnd={addStitchesToHistory}
            visible={view === "edit"}
          />

          <div className="divider">
            <div
              className="divider-tab divider-view-tab"
              onClick={() => setView("view")}
            >
              View
            </div>
            <div
              className="divider-tab divider-edit-tab"
              onClick={() => setView("edit")}
            >
              Edit
            </div>
          </div>

          <YokeView
            chart={chart}
            colors={colors}
            direction={direction}
            numRepeats={numRepeats}
            visible={view === "view"}
          />
        </main>
      </div>
    </div>
  );
}
