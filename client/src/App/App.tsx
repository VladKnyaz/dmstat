import { FC } from "react";
import "./App.css";
import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/home/";
import { Menu } from "../widgets/menu";
import { ChartLinePeaks } from "../widgets/chartLinePeaks";
import { Admin } from "../pages/admin/";
import { ChartLineCurrentAmount } from "../widgets/chartLineCurrentAmount";
import { Project } from "../pages/project";

const App: FC = () => {
  const { Content } = Layout;
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
          <Route
            path="/chartCurrentOnline"
            element={<ChartLineCurrentAmount />}
          />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default App;
