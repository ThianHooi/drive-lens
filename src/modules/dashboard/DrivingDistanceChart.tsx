import React from "react";
import { Chart, type ChartWrapperOptions } from "react-google-charts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export const data = [
  ["Day", "Driving Distance"],
  ["1", 5],
  ["2", 10],
  ["3", 15],
  ["4", 20],
  ["6", 30],
  ["7", 10],
  ["8", 40],
  ["9", 45],
  ["15", 75],
  ["16", 80],
  ["17", 105],
  ["23", 10],
  ["24", 120],
  ["25", 125],
  ["26", 130],
  ["27", 5],
  ["28", 30],
  ["29", 100],
];

export const options: ChartWrapperOptions["options"] = {
  subtitle: "Driving distance in past 30 days",
  legend: {
    position: "bottom",
  },
  curveType: "function",
  hAxis: {
    title: "Day",
  },
  vAxis: {
    title: "Driving Distance (km)",
  },
};

const DrivingDistanceChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Driving Duration</CardTitle>
        <CardDescription>Driving distance in past 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <Chart
          chartType="LineChart"
          width="100%"
          height="400px"
          data={data}
          options={options}
        />
      </CardContent>
    </Card>
  );
};

export default DrivingDistanceChart;
