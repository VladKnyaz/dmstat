import { Row, Col, Typography, Flex } from "antd";
import React, { FC, useState, useEffect } from "react";

import ApexChart from "react-apexcharts";
import { useGetProjectsQuery } from "../../entities/projects";

const ChartLineCurrentAmount: FC = () => {
  const { Text, Title } = Typography;

  const [categories, setCategories] = useState<number[]>([]);
  const [minDate, setMinDate] = useState<number>();
  const [maxDate, setMaxDate] = useState<number>();
  const [colors, setColors] = useState<string[]>();

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      stacked: true,
      background: "none",
      id: "charts23",
      type: "line",
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: "pan",
        show: false,
      },
    },
    grid: {
      borderColor: "rgba(110,170,220,0.3)",
      show: true,
      position: "back",
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
    stroke: {
      width: 3,
    },
    fill: {
      opacity: 1,
    },

    xaxis: {
      type: "datetime",
      categories: categories,
    },
    legend: {
      position: "top",
    },
  };

  const options2: ApexCharts.ApexOptions = {
    chart: {
      background: "none",
      id: "daads",
      height: 130,
      width: 650,
      type: "line",
      brush: {
        target: "charts23",
        enabled: true,
      },
      selection: {
        enabled: true,
        fill: {
          color: "#2F3240",
          opacity: 0.9,
        },
        xaxis: {
          min: minDate,
          max: maxDate,
        },
      },
      toolbar: {
        show: false,
      },
    },
    colors: colors,
    grid: {
      show: false,
    },
    xaxis: {
      type: "datetime",
      categories: categories,
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    theme: {
      mode: "dark",
    },
  };

  const [series, setSeries] = useState([
    {
      name: "Игроки",
      data: [30, 91],
    },
    {
      name: "Игроки",
      data: [30, 91],
    },
  ]);

  const { data, isLoading, isSuccess } = useGetProjectsQuery({
    isRelations: true,
  });

  useEffect(() => {
    if (data) {
      let arrSeries: any = [];
      let arrTimestamps: number[] = [];
      let arrColors: string[] = [];

      data.forEach((project) => {
        arrColors.push(project.color);
        let dataAmountPlayers: number[] = [];

        project.servers?.forEach((server) => {
          if (
            server.timestamps &&
            server.timestamps.length > arrTimestamps.length
          ) {
            arrTimestamps = server.timestamps.map((stamp) =>
              new Date(stamp.date).getTime()
            );

            let len = server.timestamps.length;

            const minDated = new Date(server.timestamps[0].date).getTime();
            const maxDated = new Date(
              server.timestamps[len - 1].date
            ).getTime();

            setMinDate(minDated);
            setMaxDate(maxDated);
          }
        });

        arrTimestamps.forEach((mainStampTime) => {
          let currentTimeOnline = 0;

          project.servers?.forEach((server) => {
            let stmp = server.timestamps?.find(
              (tms) => mainStampTime == new Date(tms.date).getTime()
            );

            currentTimeOnline += stmp ? stmp.amountPlayers : 0;
          });

          dataAmountPlayers.push(currentTimeOnline);
        });

        arrSeries.push({
          name: project.projectName,
          data: dataAmountPlayers,
        });
      });

      setColors(arrColors);
      setSeries(arrSeries);
      setCategories(arrTimestamps);
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
            ></ApexChart>
            <ApexChart
              options={options2}
              series={series}
              height={100}
            ></ApexChart>
          </div>
        )}
      </Col>
    </Row>
  );
};

export { ChartLineCurrentAmount };
