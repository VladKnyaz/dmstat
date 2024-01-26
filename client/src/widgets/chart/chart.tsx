import { Row, Col, Typography, Flex } from "antd";
import React, { FC, Fragment } from "react";
import {
  ResponsiveContainer,
  Line,
  LineChart,
  CartesianAxis,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import moment from "moment";

type chartData = {
  dataora: string | number;
  projects: {
    [key: string]: number;
  };
};

const Chart: FC = () => {
  const data: chartData[] = [
    {
      dataora: "Tue Jan 23 2024 14:26:48",
      projects: {
        funix: 21,
        gta5rp: 123,
      },
    },
    {
      dataora: "Tue Jan 23 2024 14:30:48",
      projects: {
        funix: 234,
        gta5rp: 21,
      },
    },
    {
      dataora: "Tue Jan 23 2024 14:49:48",
      projects: {
        funix: 546,
        gta5rp: 231,
      },
    },
    {
      dataora: "Tue Jan 23 2024 15:04:48",
      projects: {
        funix: 523,
        gta5rp: 744,
      },
    },
    {
      dataora: "Tue Jan 23 2024 15:10:48",
      projects: {
        funix: 700,
        gta5rp: 345,
      },
    },
    {
      dataora: "Tue Jan 23 2024 15:19:48",
      projects: {
        funix: 412,
        gta5rp: 231,
      },
    },
    {
      dataora: "Tue Jan 23 2024 15:27:48",
      projects: {
        funix: 21,
        gta5rp: 21,
      },
    },
    {
      dataora: "Tue Jan 23 2024 15:57:48",
      projects: {
        funix: 234,
        gta5rp: 221,
      },
    },
    {
      dataora: "Tue Jan 23 2024 16:10:48",
      projects: {
        funix: 412,
        gta5rp: 231,
      },
    },
    {
      dataora: "Tue Jan 23 2024 16:20:48",
      projects: {
        funix: 21,
        gta5rp: 21,
      },
    },
    {
      dataora: "Tue Jan 23 2024 16:30:48",
      projects: {
        funix: 234,
        gta5rp: 221,
        kek: 12,
      },
    },
    {
      dataora: "Tue Jan 23 2024 16:49:48",
      projects: {
        funix: 412,
        gta5rp: 221,
        kek: 124,
      },
    },
    {
      dataora: "Tue Jan 24 2024 16:49:48",
      projects: {
        funix: 4212,
        gta5rp: 2221,
        kek: 1224,
      },
    },
  ];

  const DateFormatter = (date: any) => {
    // return moment(date).unix();
    return moment(date).format("DD/MM/YY HH:mm");
  };

  data.forEach((d) => {
    d.dataora = moment(d.dataora).valueOf();
  });
  const { Text, Title } = Typography;
  const data2 = [
    { name: "majestic", amount: 32234, color: "red" },
    { name: "gta5rp", amount: 43344, color: "blue" },
    { name: "kek", amount: 43344, color: "green" },
  ];
  return (
    <Row>
      <Col style={{ height: 320, width: "100%" }}>
        <Flex justify="center" gap="middle" vertical align="center">
          <Title level={5}>Пиковый онлайн DM проектов RAGEMP</Title>
        </Flex>
        <ResponsiveContainer>
          <LineChart width={600} height={300} data={data}>
            <Tooltip></Tooltip>
            <CartesianGrid stroke="#ccc" />
            <XAxis
              dataKey="dataora"
              domain={[data[0].dataora, data[data.length - 1].dataora]}
              type="number"
              scale="time"
              tickFormatter={DateFormatter}
            />
            <Line dot={false} dataKey="projects.funix" fill="red" stroke="red"></Line>
            <Line dot={false} dataKey="projects.gta5rp" fill="blue" stroke="blue"></Line>
            <Line dot={false} dataKey="projects.kek" fill="green" stroke="green"></Line>
            <YAxis />
          </LineChart>
        </ResponsiveContainer>
        <Flex gap={10} wrap="wrap">
          {data2.map((srv, index) => {
            return (
              <Flex key={index} justify="center" align="center" gap={10}>
                <div
                  style={{
                    backgroundColor: srv.color,
                    width: 20,
                    height: 4,
                  }}
                ></div>
                <Text>{srv.name}</Text>
              </Flex>
            );
          })}
        </Flex>
      </Col>
    </Row>
  );
};

export { Chart };
