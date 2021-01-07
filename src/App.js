import React, { useState, useEffect, useCallback } from "react";
import Header from "./Header";
import ColorPalette from "./ColorPalette";
import Chart from "./Chart";
import Settings from "./Settings";
import Toolbar from "./Toolbar";
import YokeView from "./YokeView";
import * as history from "./history";
import "./App.scss";

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
  const [selection, setSelection] = useState(null);
  const [clipboard, setClipboard] = useState(null);

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
    (stitches, addToHistory = true) => {
      const newChart = chart.map((row) => [...row]);
      stitches.forEach((stitch) => {
        newChart[stitch.row][stitch.column] = stitch.color;
      });
      setChart(newChart);

      if (addToHistory) {
        const stitchesForHistory = stitches.map((stitch) => ({
          row: stitch.row,
          column: stitch.column,
          fromColor: chart[stitch.row][stitch.column],
          toColor: stitch.color,
        }));
        setUndoHistory(
          history.push(undoHistory, history.setStitches(stitchesForHistory))
        );
      }
    },
    [chart, undoHistory]
  );

  function addStitchesToHistory(stitches) {
    setUndoHistory(history.push(undoHistory, history.setStitches(stitches)));
  }

  function setSelectionStart(row, column) {
    setSelection({
      start: { row, column },
      end: { row, column },
    });
  }

  function setSelectionEnd(row, column) {
    setSelection({
      ...selection,
      end: { row, column },
    });
  }

  function clearSelection() {
    setSelection(null);
  }

  const getSelectionBounds = useCallback(() => {
    if (!selection) {
      return null;
    }

    return {
      top: Math.min(selection.start.row, selection.end.row),
      bottom: Math.max(selection.start.row, selection.end.row),
      left: Math.min(selection.start.column, selection.end.column),
      right: Math.max(selection.start.column, selection.end.column),
    };
  }, [selection]);

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

  const flip = useCallback(
    (addToHistory = true) => {
      setChart(chart.slice().reverse());
      if (addToHistory) {
        setUndoHistory(history.push(undoHistory, history.flip()));
      }
    },
    [chart, undoHistory]
  );

  const copy = useCallback(() => {
    if (selection === null) {
      return;
    }
    const bounds = getSelectionBounds();
    const region = [];
    for (let i = bounds.top; i <= bounds.bottom; i++) {
      const row = [];
      for (let j = bounds.left; j <= bounds.right; j++) {
        row.push(chart[i][j]);
      }
      region.push(row);
    }
    setClipboard(region);
  }, [chart, getSelectionBounds, selection]);

  const paste = useCallback(() => {
    if (clipboard === null || selection === null) {
      return;
    }
    const stitches = [];
    const selectionBounds = getSelectionBounds();

    for (let i = 0; i < clipboard.length; i++) {
      const pasteRow = i + selectionBounds.top;
      if (pasteRow >= chart.length) {
        // Would paste below the edge of the chart
        break;
      }
      const row = clipboard[i];
      for (let j = 0; j < row.length; j++) {
        const pasteColumn = j + selectionBounds.left;
        if (pasteColumn >= chart[0].length) {
          // Would paste beyond the right of the chart
          break;
        }
        const color = row[j];
        stitches.push({ color, row: pasteRow, column: pasteColumn });
      }
    }
    setStitches(stitches);
  }, [chart, clipboard, getSelectionBounds, selection, setStitches]);

  const deleteSelection = useCallback(() => {
    if (selection === null) {
      return;
    }
    const selectionBounds = getSelectionBounds();
    const stitches = [];
    for (let i = selectionBounds.top; i <= selectionBounds.bottom; i++) {
      for (let j = selectionBounds.left; j <= selectionBounds.right; j++) {
        stitches.push({ row: i, column: j, color: null });
      }
    }
    setStitches(stitches);
  }, [getSelectionBounds, selection, setStitches]);

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
            .reverse(),
          false
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
      case history.FLIP: {
        flip(false);
        break;
      }
      default:
        break;
    }
    setUndoHistory(newHistory);
  }, [undoHistory, setStitches, setColor, colors, flip]);

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
          })),
          false
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
      case history.FLIP: {
        flip(false);
        break;
      }
      default:
        break;
    }

    setUndoHistory(newHistory);
  }, [undoHistory, setStitches, setColor, addColor, deleteColor, flip]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "z": {
            event.preventDefault();
            undo();
            break;
          }
          case "Z": {
            // Only do our redo actions
            event.preventDefault();
            redo();
            break;
          }
          case "c": {
            copy();
            break;
          }
          case "x": {
            copy();
            deleteSelection();
            break;
          }
          case "v": {
            paste();
            break;
          }
          default:
            break;
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, copy, paste, deleteSelection]);

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
            selectionBounds={getSelectionBounds()}
            setStitch={setStitch}
            tool={tool}
            selectedColor={selectedColor}
            onDrawingEnd={addStitchesToHistory}
            visible={view === "edit"}
            setSelectionStart={setSelectionStart}
            setSelectionEnd={setSelectionEnd}
            clearSelection={clearSelection}
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
