import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs/*, faSignInAlt*/ } from "@fortawesome/free-solid-svg-icons";
import logo from './images/logo.svg';
import "./Header.scss";

export default function Header(props) {
  const { toggleSettings } = props;
  return (
    <header>
      <img className="logo" src={logo} alt="Yolk logo"  />
      <h1 className="main-heading">Yolk</h1>
      <nav className="main-nav">
        <ul className="main-nav-list">
          <li className="main-nav-list-item">
            <button className="main-nav-settings-button button-primary button-large" onClick={toggleSettings}>
              <FontAwesomeIcon name="settings" icon={faCogs} />
            </button>
          </li>
          {/*
          <li className="main-nav-list-item">
            <button className="button-primary button-large">
              <FontAwesomeIcon icon={faSignInAlt} />
              Log in to save
            </button>
          </li>
          */}
        </ul>
      </nav>
    </header>
  );
}
