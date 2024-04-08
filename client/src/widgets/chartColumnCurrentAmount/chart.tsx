import { Row, Col, Typography, Flex } from "antd";
import { FC, useState, useEffect } from "react";

import ApexChart from "react-apexcharts";
import { useGetProjectsCurrentQuery } from "../../entities/projects";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import { NumericArrayToPercantageArr } from "./lib/arrayToPercentages";
const ChartColumnCurrentAmount: FC = () => {
  const { Title } = Typography;

  const [categories, setCategories] = useState<[string, string][]>([]);
  const [colors, setColors] = useState<string[]>();
  const [series, setSeries] = useState<ApexAxisChartSeries | ApexNonAxisChartSeries>([]);
  const [seriesPie, setSeriesPie] = useState<number[]>([]);
  const [allOnline, setAllOnline] = useState<number>(0);

  const [projectInfo, setProjectInfo] = useState<{ projectName: string; online: number }[]>();
  const navigate = useNavigate();

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      stacked: true,
      background: "none",
      id: "charts23",
      events: {
        dataPointSelection(_event, _chartContext, config) {
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
      borderColor: "rgba(110,170,220,0.1)",
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

  const { data: dataCurrent, isLoading, isSuccess } = useGetProjectsCurrentQuery();

  useEffect(() => {
    if (dataCurrent) {
      let arrSeries: any[] = [];
      let arrColors: string[] = [];
      let names: [string, string][] = [];
      let onlines: number[] = [];
      let time: string;
      let arrProjectInfo: { projectName: string; online: number }[] = [];

      dataCurrent.forEach((project) => {
        arrColors.push(project.color);
        time = moment(project.time).format("HH:mm");
        names.push([project.projectName, `В ${time}: ${project.currentOnline}`]);

        arrProjectInfo.push({
          projectName: project.projectName,
          online: project.currentOnline,
        });
      });

      dataCurrent.forEach((prj) => {
        setAllOnline((prev) => prj.currentOnline + prev);
      });

      onlines = dataCurrent.map((proj) => proj.currentOnline);

      arrSeries.push({
        data: onlines,
      });

      setSeriesPie(onlines);

      setProjectInfo(arrProjectInfo);
      setColors(arrColors);
      setSeries(arrSeries);
      setCategories(names);
    }
  }, [dataCurrent]);

  const chartOptionsPie: ApexCharts.ApexOptions = {
    chart: {
      id: "pieChartHome",
      type: "pie",
    },

    plotOptions: {
      pie: {
        dataLabels: {
          offset: -10,
          minAngleToShowLabel: 10,
        },
      },
    },
    colors: colors,
    legend: {
      markers: {
        width: 20,
        height: 7,
        radius: 1,
      },
      position: "bottom",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    labels: projectInfo
      ? projectInfo.map((i) => {
          return i.projectName;
        })
      : [],
    tooltip: {
      custom({ seriesIndex, w }) {
        const percent = NumericArrayToPercantageArr(w.globals.initialSeries)[seriesIndex];

        const data = w.globals.initialSeries[seriesIndex];
        const color = w.globals.colors[seriesIndex];
        const name = w.globals.labels[seriesIndex];

        let text = `
          <div class="tooltipPie" style="border: 2px solid ${color};">
            <p>${name}</p>
            <strong>${data} (${percent}%)</strong>
          </div>
        `;
        return text;
      },
    },
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Flex justify="center" gap="middle" vertical align="center">
            <Title level={5}>Текущий онлайн DM проектов RAGEMP</Title>
          </Flex>
          {isLoading && "Загрузка..."}
          {isSuccess && (
            <div className="chart" style={{ maxWidth: "100%" }}>
              <ApexChart options={chartOptions} series={series} height={500} type="bar"></ApexChart>
              <Flex justify="center" gap="middle" vertical align="center">
                <Title level={5}>Доля проекта от текущего онлайна</Title>
              </Flex>

              <div className="chartPieMain">
                <ApexChart options={chartOptionsPie} series={seriesPie} height={300} type="pie"></ApexChart>
              </div>
            </div>
          )}
        </Col>
      </Row>
      <Row>
        <div className="info_online">
          <p className="text_online">Общий онлайн DM серверов: {allOnline}</p>
        </div>
      </Row>
    </>
  );
};

export { ChartColumnCurrentAmount };
