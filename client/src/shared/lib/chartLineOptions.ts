import * as momenttz from "moment-timezone";
import moment from "moment";
import ApexCharts from 'apexcharts'
momenttz.locale('RU-ru');
momenttz.tz.setDefault("Europe/Moscow");
export const chartLineOptions: ApexCharts.ApexOptions = {
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
    yaxis: [
        {
            show: true,
            stepSize: 50,
            axisBorder: {
                show: true,
                offsetX: -5,
                color: "gray",
                width: 2,
            },
        },
    ],
    xaxis: {
        tooltip: {
            formatter: (val: string) => {
                // console.log(new Date(val));

                return moment(val).format("HH:mm:ss");
                return momenttz(val).format("HH:mm:ss")
            },
        },
        labels: {
            // formatter(value, timestamp, opts) {
            //     // console.log(new Date(timestamp));

            //     return moment(value).format("HH:mm:ss");
            //     return momenttz(value).format("HH:mm:ss")
            // },
            datetimeUTC: false,
            datetimeFormatter: {
                year: "yyyy",
                month: "MMM 'yy",
                day: "dd MMM",
                hour: "HH:mm",
            },
        },
    },
    legend: {
        markers: {
            width: 20,
            height: 7,
            radius: 1,
        },
    }
}