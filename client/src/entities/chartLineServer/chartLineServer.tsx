import React, { FC, useEffect, useState } from "react";
import ApexChart from "react-apexcharts";
import { IProject, IServer } from "../projects";

const ChartLineServer: FC<{ server: IServer; color: string }> = ({
  server,
  color,
}) => {
  const [categories, setCategories] = useState<number[]>([]);
  const [minDate, setMinDate] = useState<number>();
  const [maxDate, setMaxDate] = useState<number>();

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      stacked: true,
      background: "none",
      id: server.serverId,
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
    colors: [color],
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

      type: "line",
      brush: {
        target: server.serverId,
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
    colors: [color],
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

  useEffect(() => {
    if (server) {
      let arrSeries: any = [];
      let arrTimestamps: number[] = [];

      let dataAmountPlayers: number[] = [];

      if (server.timestamps) {
        arrTimestamps = server.timestamps.map((stamp) =>
          new Date(stamp.date).getTime()
        );

        let len = server.timestamps.length;

        const minDated = new Date(server.timestamps[0].date).getTime();
        const maxDated = new Date(server.timestamps[len - 1].date).getTime();

        setMinDate(minDated);
        setMaxDate(maxDated);
      }

      arrTimestamps.forEach((mainStampTime) => {
        let currentTimeOnline = 0;

        let stmp = server.timestamps?.find(
          (tms) => mainStampTime == new Date(tms.date).getTime()
        );

        if (stmp) {
          currentTimeOnline += stmp ? stmp.amountPlayers : 0;

          dataAmountPlayers.push(currentTimeOnline);
        }
      });

      arrSeries.push({
        data: dataAmountPlayers,
      });

      setSeries(arrSeries);
      setCategories(arrTimestamps);
    }
  }, [server]);

  return (
    <div className="chart" style={{ maxWidth: "100%" }}>
      {server && (
        <>
          <ApexChart
            options={options2}
            series={series}
            height={100}
          ></ApexChart>
          <ApexChart
            options={chartOptions}
            series={series}
            height={400}
          ></ApexChart>
        </>
      )}
    </div>
  );
};

export { ChartLineServer };
