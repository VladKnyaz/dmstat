import React, { FC, ForwardedRef, useRef } from "react";
import {
  Col,
  Layout,
  Row,
  Typography,
  Flex,
  Tooltip as TooltipAntd,
} from "antd";

import {
  ResponsiveContainer,
  Cell,
  BarChart,
  CartesianGrid,
  YAxis,
  Tooltip,
  Bar,
  XAxis,
  LabelList,
  Legend,
  Brush,
} from "recharts";

import { ChartColumnCurrentAmount } from "../../widgets/chartColumnCurrentAmount";

const data2 = [
  { name: "majestic", amount: 32234, color: "red" },
  { name: "gta5rp", amount: 43344, color: "blue" },
  { name: "funnix", amount: 92234, color: "orange" },
  { name: "funnix", amount: 32234, color: "orange" },
  { name: "funnix", amount: 52234, color: "orange" },
  { name: "funnix", amount: 12234, color: "orange" },
];

const Home: FC = () => {
  const { Title, Text } = Typography;
  return (
    <>
      <Row justify={"center"}>
        <Col lg={{ span: 12 }} style={{ height: 320 }} flex="auto">
          <Flex justify="center" gap="middle" vertical align="center">
            <Title level={3}>Столбчатая диаграмма</Title>
          </Flex>
          <ChartColumnCurrentAmount/>
        </Col>
      </Row>
    </>
  );
};

export { Home };
