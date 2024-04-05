import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ConfigProvider, theme } from "antd";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../shared/store/index.ts";
import AuthLayout from "./AuthLayout.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <AuthLayout>
      <BrowserRouter>
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
          <App />
        </ConfigProvider>
      </BrowserRouter>
    </AuthLayout>
  </Provider>
);
