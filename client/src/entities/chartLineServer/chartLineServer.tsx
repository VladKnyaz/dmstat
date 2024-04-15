import { FC, useEffect, useState } from "react";
import ApexChart from "react-apexcharts";
import { IServer } from "../projects";
import { chartLineOptions } from "../../shared/lib/chartLineOptions";

const ChartLineServer: FC<{ server: IServer; color: string }> = ({ server, color }) => {
  const [categories, setCategories] = useState<number[]>([]);
  const [minDate, setMinDate] = useState<number>();
  const [maxDate, setMaxDate] = useState<number>();

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      background: "none",
      id: server.serverId,
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
    grid: {
      borderColor: "rgba(110,170,220,0.1)",
      show: true,
      position: "back",
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
    colors: [color],
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

    yaxis: {
      show: true,
      stepSize: 50,
      forceNiceScale: true,
      axisBorder: {
        show: true,
        offsetX: -5,
        color: "gray",
        width: 2,
      },
    },
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
        return seriesName + " - <strong>" + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + "</strong>";
      },
      position: "top",
      markers: chartLineOptions.legend?.markers,
    },
  };

  const options2: ApexCharts.ApexOptions = {
    chart: {
      background: "none",
      id: server.serverName,
      height: 100,
      width: 650,
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

  useEffect(() => {
    if (server) {
      let arrSeries: any = [];
      let arrTimestamps: number[] = [];

      let dataAmountPlayers: number[] = [];

      if (server.timestamps) {
        arrTimestamps = server.timestamps.map((stamp) => new Date(stamp.date).getTime());

        let lengthStamp = server.timestamps.length;

        let percentOnDateStamp10 = Math.floor((lengthStamp * 10) / 100);

        const minDated = new Date(server.timestamps[lengthStamp - percentOnDateStamp10].date).getTime();
        const maxDated = new Date(server.timestamps[lengthStamp - 1].date).getTime();

        setMinDate(minDated);

        if (lengthStamp > 1) setMaxDate(maxDated);
      }

      arrTimestamps.forEach((mainStampTime) => {
        let currentTimeOnline = 0;

        let stmp = server.timestamps?.find((tms) => mainStampTime == new Date(tms.date).getTime());

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
          <ApexChart options={chartOptions} series={series} height={400}></ApexChart>
          <ApexChart options={options2} series={series} height={100}></ApexChart>
        </>
      )}
    </div>
  );
};

export { ChartLineServer };
