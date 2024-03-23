import { Row, Col, Typography, Flex } from "antd";
import { FC, useState, useEffect } from "react";

import ApexChart from "react-apexcharts";
import { useGetProjectsQuery } from "../../entities/projects";
import { chartLineOptions } from "../../shared/lib/chartLineOptions";

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
      tooltip: chartLineOptions.xaxis?.tooltip,
      type: "datetime",
      categories: categories,
      axisBorder: {
        show: true,
        color: "gray",
      },

      labels: chartLineOptions.xaxis?.labels,
    },
    tooltip: {
      custom({ dataPointIndex, w }) {
        let text = ``;
        w.globals.initialSeries.forEach((opts: any, index: number) => {
          const color = w.globals.colors[index];
          const currentOnline = opts.data[dataPointIndex];
          text += `<div class="tooltipPie" style="border: 2px solid ${color}; margin-bottom: 14px">
              <strong>${currentOnline}</strong>  
            </div>`;
        });

        return text;
      },
    },
    legend: {
      tooltipHoverFormatter: function (seriesName, opts) {
        return (
          seriesName +
          " - <strong>" +
          opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
          "</strong>"
        );
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
      labels: chartLineOptions.xaxis?.labels,
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

        if (
          project.timestamps &&
          project.timestamps.length > arrTimestamps.length
        ) {
          arrTimestamps = project.timestamps.map((stamp) =>
            new Date(stamp.date).getTime()
          );

          let lengthStamp = project.timestamps.length;

          const minDated = new Date(project.timestamps[0].date).getTime();

          const maxDated = new Date(
            project.timestamps[lengthStamp - 1].date
          ).getTime();

          setMinDate(minDated);

          if (lengthStamp > 1) setMaxDate(maxDated);
        }

        let dataPeak: number[] = [];

        arrTimestamps.forEach((mainStampTime) => {
          let timestampInProject = project.timestamps!.find(
            (tms) => new Date(tms.date).getTime() == mainStampTime
          );
          dataPeak.push(timestampInProject ? timestampInProject.peak : 0);
        });

        arrSeries.push({
          name: project.projectName,
          data: dataPeak,
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
          <Title level={5}>Пиковый онлайн DM проектов RAGEMP</Title>
        </Flex>

        {isLoading && "Загрузка..."}

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

export { ChartLinePeaks };
