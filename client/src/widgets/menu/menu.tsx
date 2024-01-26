import React, { FC } from "react";
import { Flex, Menu as MenuAnt, MenuProps, Layout, theme, Button } from "antd";
import {
  BarChartOutlined,
  HomeOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { BrowserView, MobileView } from "react-device-detect";

const Menu: FC = () => {
  const [items, setItems] = React.useState<MenuProps["items"]>([
    {
      key: 1,
      label: <MenuOutlined style={{ justifySelf: "center" }} />,
      children: [
        {
          key: 1,
          label: <Link to={"/"}>Главная</Link>,
          icon: <HomeOutlined />,
        },
        {
          key: 2,
          label: <Link to={"/chart"}>Пиковый онлайн проектов</Link>,
          icon: <BarChartOutlined />,
        },
        {
          key: 3,
          label: <Link to={"/"}>Текущий онлайн проектов</Link>,
          icon: <BarChartOutlined />,
        },
      ],
    },
  ]);
  const { Header, Sider } = Layout;
  return (
    <>
      <BrowserView style={{ background: "#001529" }}>
        <Sider width={250} collapsible style={{ padding: 0 }}>
          <MenuAnt
            theme="dark"
            selectedKeys={["0"]}
            // @ts-ignore
            items={items[0].children}
          />
        </Sider>
      </BrowserView>
      <MobileView>
        <Header
          style={{
            padding: "0px 10px",
            position: "sticky",
            zIndex: 20,
            width: "100%",
          }}
        >
          <MenuAnt
            theme="dark"
            mode="horizontal"
            selectedKeys={["0"]}
            items={items}
          />
        </Header>
      </MobileView>
    </>
  );
};

export { Menu };
