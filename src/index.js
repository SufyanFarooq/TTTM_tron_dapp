import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./container/app";

import './i18next';

// import App from './App';
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Suspense } from "react";

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={(<div>Loading ...</div>)}>
      <App />
    </Suspense>
  </React.StrictMode>,

  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
