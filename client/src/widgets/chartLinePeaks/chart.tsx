import { Row, Col, Typography, Flex } from "antd";
import { FC, useState, useEffect } from "react";

import ApexChart from "react-apexcharts";
import { useGetProjectsMainInfoQuery, useGetProjectsPeakQuery } from "../../entities/projects";
import { chartLineOptions } from "../../shared/lib/chartLineOptions";
import moment from "moment";

const ChartLinePeaks: FC = () => {
  const { Title } = Typography;

  const [categories, setCategories] = useState<number[]>([]);
  const [minDate, setMinDate] = useState<number>();
  const [maxDate, setMaxDate] = useState<number>();
  const [colors, setColors] = useState<string[]>();

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      background: "none",
      id: "charts23",
      type: "line",
      height: 500,
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
    markers: {
      size: 0,
    },
    grid: chartLineOptions.grid,
    colors: colors,
    dataLabels: {
      enabled: false,
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
    yaxis: chartLineOptions.yaxis,
    xaxis: {
      tooltip: {
        formatter: (val: string) => {
            return moment(val).format("DD MMMM HH:mm:ss");
        },
      },
      type: "datetime",
      categories: categories,
      axisBorder: {
        show: true,
        color: "gray",
      },
      labels: {
        showDuplicates:true,
        trim:true,
          formatter(value) {
            return moment(value).format("DD MMMM");
              
          },
      },
    },
    tooltip: {
      custom({ dataPointIndex, w }) {
        let text = ``;
        let data: { color: string; online: number }[] = [];
        w.globals.initialSeries.forEach((opts: any, index: number) => {
          const color = w.globals.colors[index];
          const currentOnline = opts.data[dataPointIndex];
          data.push({
            color,
            online: currentOnline,
          });
        });

        data = data.sort((a, b) => b.online - a.online);

        data.forEach((project) => {
          text += `<div class="tooltipPie" style="border: 2px solid ${project.color}; margin-bottom: 14px">
          <strong>${project.online}</strong>  
        </div>`;
        });

        return text;
      },
    },
    legend: {
      tooltipHoverFormatter: function (seriesName, opts) {
        return seriesName + " - <strong>" + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + "</strong>";
      },
      position: "top",
      markers: chartLineOptions.legend?.markers,
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
      labels: {
        formatter: (val: string) => {
          return moment(val).format("DD MMMM");
        },
      },
    
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

  const { data, isLoading, isSuccess } = useGetProjectsPeakQuery();

  const { data: infoPorjects } = useGetProjectsMainInfoQuery();

  useEffect(() => {
    if (data && infoPorjects) {
      if (data.length < 1 || infoPorjects.length < 1) return;
      console.log(data);

      let arrSeries: any = [];
      let arrTimestamps: number[] = data.map((project) => new Date(project.time).getTime());
      let arrColors: string[] = [];

      infoPorjects.forEach((project) => {
        arrColors.push(project.color);
      });

      const datalength = data.length;

      const minDated = new Date(data[0].time).getTime();
      const maxDated = new Date(data[datalength - 1].time).getTime();
      setMinDate(minDated);
      if (datalength > 1) setMaxDate(maxDated);

      infoPorjects.forEach((infProj) => {
        let players = data.map((project) => {
          const projectNameInfProj = String(infProj.projectName).replace(new RegExp(" ", "g"), "_").toLocaleLowerCase();

          if (project[projectNameInfProj]) return project[projectNameInfProj];
          return 0;
        });

        arrSeries.push({
          name: infProj.projectName,
          data: players,
        });
      });
      console.log(arrTimestamps);

      setColors(arrColors);
      setSeries(arrSeries);
      setCategories(arrTimestamps);
    }
  }, [data, infoPorjects]);

  return (
    <Row>
      <Col span={24}>
        <Flex justify="center" gap="middle" vertical align="center">
          <Title level={5}>Пиковый онлайн DM проектов RAGEMP</Title>
        </Flex>

        {isLoading && "Загрузка..."}

        {isSuccess && (
          <div className="chart" style={{ maxWidth: "100%" }}>
            <ApexChart options={chartOptions} series={series} height={500}></ApexChart>
            <ApexChart options={options2} series={series} height={100}></ApexChart>
          </div>
        )}
      </Col>
    </Row>
  );
};

export { ChartLinePeaks };
