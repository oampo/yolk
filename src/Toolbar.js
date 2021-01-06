import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaintBrush,
  faVectorSquare,
  faArrowsAltV,
} from "@fortawesome/free-solid-svg-icons";
import "./Toolbar.css";

export default function Toolbar(props) {
  const { tool, setTool, flip } = props;
  return (
    <section className="toolbar">
      <button
        className="toolbar-button toolbar-paint-button"
        aria-pressed={tool === "brush"}
        onClick={() => setTool("brush")}
      >
        <FontAwesomeIcon icon={faPaintBrush} />
      </button>
      <button
        className="toolbar-button toolbar-select-button"
        aria-pressed={tool === "select"}
        onClick={() => setTool("select")}
      >
        <FontAwesomeIcon icon={faVectorSquare} />
      </button>
      <button className="toolbar-button toolbar-flip-button" onClick={flip}>
        <FontAwesomeIcon icon={faArrowsAltV} />
      </button>
    </section>
  );
}
