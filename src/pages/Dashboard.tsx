import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import fetchData from "../../utils/fetchData";
import { useCookies } from "react-cookie";

export type ChartOptions = {
  series: ApexAxisChartSeries | number[];
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  stroke?: ApexStroke;
  dataLabels?: ApexDataLabels;
  yaxis?: ApexYAxis;
  title?: ApexTitleSubtitle;
  labels?: string[];
  legend?: ApexLegend;
  subtitle?: ApexTitleSubtitle;
};

const Dashboard = () => {
  const [usersPerMonthStats, setUsersPerMonthStats] = useState<Partial<ChartOptions> | null>(null);
  const [communitiesPerMonthStats, setCommunitiesPerMonthStats] = useState<Partial<ChartOptions> | null>(null);
  const [cookies] = useCookies(["auth_token"])
  const handleFetchData = async () => {
    try {
      const [userStats,communityStats] = await Promise.all(
        [
          fetchData("/user/users","GET",{},cookies.auth_token,"json","json"),
          fetchData("/community/","GET",{},cookies.auth_token,"json","json")
        ]
        );
      if(userStats.usersPerMonth){
        const users = userStats.usersPerMonth;
        const series = users.map((user) => user.count);
        setUsersPerMonthStats({
          series: series,
          title: {
            text: "User account per month",
          },
          chart: {
            type: "area",
          },
          xaxis: {
            type: "datetime",
          },
          stroke: {
            curve: "smooth",
          },
          dataLabels: {
            enabled: true,
          },
          labels:users.map(u=>u.month),
          yaxis: {
            title: {
              text: "users count",
            },
          },
          legend: {
            position: "top",
          },
        });        
      }
      if(communityStats.communitiesPerMonth){
        const communities = communityStats.communitiesPerMonth;
        const series = communities.map((community) => community.count);
        setCommunitiesPerMonthStats({
          series: series,
          title: {
            text: "Community account per month",
          },
          chart: {
            type: "area",
          },
          xaxis: {
            type: "datetime",
          },
          stroke: {
            curve: "smooth",
          },
          dataLabels: {
            enabled: true,
          },
          labels:communities.map(c=>c.month),
          yaxis: {
            title: {
              text: "communities count",
            },
          }
          , legend: {
            position: "top",
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    handleFetchData();
  }, []);

  return (
    <div className="p-6 rounded-lg shadow-md mb-8 swapy-container">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="p-6 rounded-lg shadow-md">
          {usersPerMonthStats?.series && (
            <Chart
              options={usersPerMonthStats as ApexOptions}
              series={usersPerMonthStats.series}
              type="line"
              height={350}
            />
          )}
        </div>

        <div className="p-6 rounded-lg shadow-md">
        {communitiesPerMonthStats?.series && (
            <Chart
              options={communitiesPerMonthStats as ApexOptions}
              series={communitiesPerMonthStats.series}
              type="line"
              height={350}
            />
          )}
        </div>
      </div>

      <div className="p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Activity</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border">2025-03-01</td>
              <td className="py-2 px-4 border">Dashboard Setup</td>
              <td className="py-2 px-4 border text-green-600">Completed</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border">2025-03-02</td>
              <td className="py-2 px-4 border">Data Update</td>
              <td className="py-2 px-4 border text-yellow-600">Pending</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border">2025-03-03</td>
              <td className="py-2 px-4 border">Chart Analysis</td>
              <td className="py-2 px-4 border text-red-600">Error</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
