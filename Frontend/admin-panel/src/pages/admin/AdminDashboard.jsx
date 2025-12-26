import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import StatusCard from "../../components/statusCards";
import API from "../../api/adminApi";

export default function AdminDashboard() {
  // State for stats
  const [stats, setStats] = useState({
    upcomingEvents: 0,
    pastEvents: 0,
    totalEvents: 0,
  });

  // State for chart data
  const [eventData, setEventData] = useState([]);

  // Loading states
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats
    // Fetch dashboard stats
    API.get("/admin/dashboard/stats")
      .then(res => {
        const data = res.data;
        if (data.success) setStats(data.stats);
      })
      .catch(err => console.error("Stats fetch error:", err))
      .finally(() => setLoadingStats(false));

    // Fetch event trend chart
    API.get("/admin/dashboard/event-trend")
      .then(res => {
        const data = res.data;
        if (data.success) setEventData(data.eventData);
      })
      .catch(err => console.error("Chart fetch error:", err))
      .finally(() => setLoadingChart(false));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-6 text-primary dark:text-text1">
        Admin Dashboard
      </h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
        {loadingStats ? (
          <p>Loading stats...</p>
        ) : (
          <>
            <StatusCard
              title="Total Events"
              value={stats.totalEvents}
              borderColor="border-secondary"
            />
            <StatusCard
              title="Upcoming Events"
              value={stats.upcomingEvents}
              borderColor="border-success"
            />
            <StatusCard
              title="Past Events"
              value={stats.pastEvents}
              borderColor="border-error"
            />
          </>
        )}
      </div>

      {/* Line Chart */}
      <div className="bg-text1 dark:bg-bgDark p-6 rounded-2xl shadow w-full h-[380px]">
        <h2 className="text-lg font-semibold mb-4 text-primary dark:text-text1">
          Events Trend Overview
        </h2>

        {loadingChart ? (
          <p>Loading chart...</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={eventData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="events"
                stroke="#4b2e1f"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </AdminLayout>
  );
}
