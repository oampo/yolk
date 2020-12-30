import React from "react";

export default function Settings(props) {
  const { setSize, setNumRepeats, chart, numRepeats } = props;
  return (
    <form className="settings">
      <label htmlFor="rows">Rows</label>
      <input
        id="rows"
        type="number"
        min="2"
        value={chart.length}
        onChange={(e) => setSize(Number(e.target.value), chart[0].length)}
      />
      <label htmlFor="stitches">Stitches</label>
      <input
        id="stitches"
        type="number"
        min="2"
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
  );
}
