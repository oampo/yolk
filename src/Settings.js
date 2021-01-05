import React, { useState, useEffect, useRef } from "react";
import "./Settings.css";

export default function Settings(props) {
  const { setSize, setNumRepeats, chart, numRepeats, isOpen } = props;
  // Start negative margin as something large - it'll adjust to the correct
  // value on mount
  const [margin, setMargin] = useState("-400px");

  const form = useRef(null);

  useEffect(() => {
    if (!form.current) {
      return;
    }
    function updateMargin() {
      if (isOpen) {
        setMargin(0);
      } else {
        const { height } = form.current.getBoundingClientRect();
        setMargin(-height);
      }
    }

    updateMargin();
    window.addEventListener("resize", updateMargin);
    return () => window.removeEventListener("resize", updateMargin);
  }, [isOpen]);

  return (
    <section className={"settings " + (isOpen ? "settings-open" : "")}>
      <form className="settings-form" ref={form} style={{ marginTop: margin }}>
        <div className="input-group">
          <label htmlFor="rows">Rows</label>
          <input
            id="rows"
            className="settings-form-input"
            type="number"
            min="2"
            value={chart.length}
            onChange={(e) => setSize(Number(e.target.value), chart[0].length)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="stitches">Stitches</label>
          <input
            id="stitches"
            className="settings-form-input"
            type="number"
            min="2"
            value={chart[0].length}
            onChange={(e) => setSize(chart.length, Number(e.target.value))}
          />
        </div>
        <div className="input-group">
          <label htmlFor="repeats">Repeats</label>
          <input
            id="repeats"
            className="settings-form-input"
            type="number"
            min="3"
            value={numRepeats}
            onChange={(e) => setNumRepeats(Number(e.target.value))}
          />
        </div>
        <div className="input-group">
          <input
            type="radio"
            className="settings-form-input"
            name="direction"
            value="top-down"
            id="top-down"
            defaultChecked
          />
          <label htmlFor="top-down">Top Down</label>
        </div>
        <div className="input-group">
          <input
            type="radio"
            className="settings-form-input"
            name="direction"
            value="bottom-up"
            id="bottom-up"
          />
          <label htmlFor="bottom-up">Bottom Up</label>
        </div>
      </form>
    </section>
  );
}
