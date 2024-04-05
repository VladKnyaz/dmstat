import { FC, useEffect } from "react";
import "./App.css";
import { Layout, message, Spin } from "antd";
import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/home/";
import { Menu } from "../widgets/menu";
import { ChartLinePeaks } from "../widgets/chartLinePeaks";
import { Admin } from "../pages/admin/";
import { ChartLineCurrentAmount } from "../widgets/chartLineCurrentAmount";
import { Project } from "../pages/project";
import LoginPage from "./../pages/login/login";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../shared/store";

import Cookies from "universal-cookie";
const cookies = new Cookies();

const App: FC = () => {
  const { Content } = Layout;
  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  const isAuth = useSelector((state: RootState) => state.user.isAuth);

  if (!isLoading && !isAuth) {
    return <LoginPage></LoginPage>;
  }

  return (
    <Layout className="container">
      <Menu />
      <Content
        style={{
          padding: "20px 20px",
          backgroundColor: "#141414",
          overflow: "auto",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chart" element={<ChartLinePeaks />} />
          <Route path="/project/:projectName" element={<Project />} />
          <Route path="/chartCurrentOnline" element={<ChartLineCurrentAmount />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default App;
