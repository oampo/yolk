import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaintBrush,
  faVectorSquare,
  faCopy,
  faPaste,
  faArrowsAltV,
  faUndo,
  faRedo,
} from "@fortawesome/free-solid-svg-icons";
import "./Toolbar.scss";

export default function Toolbar(props) {
  const {
    tool,
    setTool,
    copy,
    paste,
    undo,
    redo,
    canUndo,
    canRedo,
    flip,
  } = props;
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
      <div className="toolbar-row">
        <button
          className="toolbar-button toolbar-button-small toolbar-copy-button"
          onClick={copy}
        >
          <FontAwesomeIcon icon={faCopy} />
        </button>
        <button
          className="toolbar-button toolbar-button-small toolbar-paste-button"
          onClick={paste}
        >
          <FontAwesomeIcon icon={faPaste} />
        </button>
      </div>
      <button className="toolbar-button toolbar-flip-button" onClick={flip}>
        <FontAwesomeIcon icon={faArrowsAltV} />
      </button>
      <div className="toolbar-row">
        <button
          className="toolbar-button toolbar-button-small toolbar-copy-button"
          onClick={undo}
          disabled={!canUndo}
        >
          <FontAwesomeIcon icon={faUndo} />
        </button>
        <button
          className="toolbar-button toolbar-button-small toolbar-paste-button"
          onClick={redo}
          disabled={!canRedo}
        >
          <FontAwesomeIcon icon={faRedo} />
        </button>
      </div>
    </section>
  );
}
