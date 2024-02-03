import { Row, Col, Typography, Flex } from "antd";
import React, { FC, useState, useEffect } from "react";

import ApexChart from "react-apexcharts";
import { useGetProjectsQuery } from "../../entities/projects";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const ChartColumnCurrentAmount: FC = () => {
  const { Title } = Typography;

  const [categories, setCategories] = useState<[string, string][]>([]);
  const [colors, setColors] = useState<string[]>();
  const [series, setSeries] = useState([]);

  const [projectInfo, setProjectInfo] =
    useState<{ projectName: string; online: number }[]>();
  const navigate = useNavigate();

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      stacked: true,
      background: "none",
      id: "charts23",
      events: {
        dataPointSelection(event, chartContext, config) {
          const dp = config.dataPointIndex;
          if (projectInfo) {
            navigate(`/project/${projectInfo[dp].projectName}`);
          }
        },
      },
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "45%",
        distributed: true,
      },
    },
    grid: {
      borderColor: "rgba(110,170,220,0.3)",
      show: true,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          // offsetX: 312,
          show: true,
        },
      },
    },
    colors: colors,
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 1,
    },
    theme: {
      mode: "dark",
    },
    xaxis: {
      categories: categories,
    },
    legend: {
      show: false,
    },
    tooltip: { enabled: false },
  };

  const { data, isLoading, isSuccess } = useGetProjectsQuery({
    isRelations: true,
  });

  useEffect(() => {
    if (data) {
      let arrSeries: any = [];
      let arrColors: string[] = [];
      let names: [string, string][] = [];
      let onlines: number[] = [];
      let time: string;
      let arrProjectInfo: { projectName: string; online: number }[] = [];

      data.forEach((project) => {
        arrColors.push(project.color);
        let currentTimeOnline = 0;
        project.servers?.forEach((server) => {
          if (server.timestamps) {
            let stmp = server.timestamps[server.timestamps.length - 1];
            if (stmp) {
              currentTimeOnline += stmp ? stmp.amountPlayers : 0;
              time = moment(stmp.date).format("HH:mm");
            }
          }
        });

        names.push([project.projectName, `В ${time}: ${currentTimeOnline}`]);
        onlines.push(currentTimeOnline);
        arrProjectInfo.push({
          projectName: project.projectName,
          online: currentTimeOnline,
        });
      });

      arrSeries.push({
        data: onlines,
      });

      setProjectInfo(arrProjectInfo);
      setColors(arrColors);
      setSeries(arrSeries);
      setCategories(names);
    }
  }, [data]);

  return (
    <Row>
      <Col span={24}>
        <Flex justify="center" gap="middle" vertical align="center">
          <Title level={5}>Текущий онлайн DM проектов RAGEMP</Title>
        </Flex>

        {isLoading && "Loading"}

        {isSuccess && (
          <div className="chart" style={{ maxWidth: "100%" }}>
            <ApexChart
              options={chartOptions}
              series={series}
              height={500}
              type="bar"
            ></ApexChart>
          </div>
        )}
      </Col>
    </Row>
  );
};

export { ChartColumnCurrentAmount };
