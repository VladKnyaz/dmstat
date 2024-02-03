import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ConfigProvider, theme } from "antd";
import { BrowserRouter } from "react-router-dom";
import {} from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { store } from "../shared/store/index.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </Provider>
);
