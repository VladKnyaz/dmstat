import React, { FC, useState } from "react";
import "./App.css";
import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/home/";
import { Menu } from "../widgets/menu";
import { Chart } from "../widgets/chart";
import { isMobile } from "react-device-detect";

const App: FC = () => {
  const { Header, Content, Footer, Sider } = Layout;
  const [collapse, setCollapse] = useState<boolean>(true);
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
          <Route path="/chart" element={<Chart />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default App;
