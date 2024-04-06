import { FC, useEffect, useState } from "react";
import ApexChart from "react-apexcharts";
import { IProject } from "../projects";

const ChartColumnProject: FC<{ projectData: IProject }> = ({ projectData }) => {
  const [categories, setCategories] = useState<number[]>([]);
  const [colors, setColors] = useState<string[]>();
  const [series, setSeries] = useState([]);

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      stacked: true,
      background: "none",
      id: "charts",
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

  useEffect(() => {
    if (projectData) {
      let arrSeries: any = [];
      let arrColors: string[] = [];
      let onlines: number[] = [];
      arrColors.push(projectData.color);

      //@ts-ignore
      projectData.servers?.forEach((server) => {
        if (server.timestamps) {
          onlines.push(server.timestamps[server.timestamps.length - 1].amountPlayers);
        }
      });

      arrSeries.push({
        data: onlines,
      });

      setColors(arrColors);
      setSeries(arrSeries);
      //@ts-ignore

      if (projectData.servers) {
        //@ts-ignore

        let cat: number[] = projectData.servers.map((_s, index) => index + 1);
        setCategories(cat);
      }
    }
  }, [projectData]);

  return (
    <div className="chart" style={{ maxWidth: "100%" }}>
      <ApexChart options={chartOptions} series={series} height={300} type="bar"></ApexChart>
    </div>
  );
};

export { ChartColumnProject };
