import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaintBrush,
  faVectorSquare,
  faCopy,
  faPaste,
  faArrowsAltV,
} from "@fortawesome/free-solid-svg-icons";
import "./Toolbar.scss";

export default function Toolbar(props) {
  const { tool, setTool, copy, paste, flip } = props;
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
      <div className="toolbar-copy-paste">
        <button className="toolbar-button toolbar-copy-button" onClick={copy}>
          <FontAwesomeIcon icon={faCopy} />
        </button>
        <button className="toolbar-button toolbar-paste-button" onClick={paste}>
          <FontAwesomeIcon icon={faPaste} />
        </button>
      </div>
      <button className="toolbar-button toolbar-flip-button" onClick={flip}>
        <FontAwesomeIcon icon={faArrowsAltV} />
      </button>
    </section>
  );
}
