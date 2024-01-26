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
} from "recharts";

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
          <ResponsiveContainer>
            <BarChart data={data2} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />

              <Tooltip cursor={{ fill: "transparent" }} content={<></>} />
              <Bar
                dataKey={"amount"}
                onClick={(data) => {
                  console.log(data);
                }}
              >
                {data2.map((srv, index) => {
                  return <Cell key={index} fill={srv.color}></Cell>;
                })}
                <LabelList
                  dataKey={"amount"}
                  position={"top"}
                  style={{ fill: "white" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <Flex gap={10} wrap="wrap">
            {data2.map((srv, index) => {
              return (
                <Flex key={index} justify="center" align="center" gap={10}>
                  <div
                    style={{
                      backgroundColor: srv.color,
                      width: 20,
                      height: 20,
                    }}
                  ></div>
                  <Text>{srv.name}</Text>
                  <Text strong>{srv.amount}</Text>
                </Flex>
              );
            })}
          </Flex>
        </Col>
      </Row>
    </>
  );
};

export { Home };
