import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";

export default function Header(props) {
  const { toggleSettings } = props;
  return (
    <header>
      <h1 className="main-heading">Yolk</h1>
      <nav className="main-nav">
        <ul className="main-nav-list">
          <li className="main-nav-list-item">
            <button className="main-nav-settings-button" onClick={toggleSettings}>
              <FontAwesomeIcon name="settings" icon={faCogs} />
            </button>
          </li>
          <li className="main-nav-list-item">
            <button>
              <FontAwesomeIcon icon={faSignInAlt} />
              Log in to save
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
