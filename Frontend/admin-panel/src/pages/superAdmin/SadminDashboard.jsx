import AdminLayout from "../../layouts/AdminLayout";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import StatusCard from "../../components/statusCards";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ["#c2db6c", "#4b2e1f"];

  // Fetch stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost/EthioEvents/Backend/public/admin-status"
        );

        if (res.data.status === "success") {
          setStats(res.data.data);
        } else {
          setError("Failed to fetch stats");
        }
      } catch (err) {
        setError(err.message || "Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Loading and error states
  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  // Pie chart data
  const pieData = [
    { name: "Active Admins", value: stats?.activeAdmins ?? 0 },
    { name: "Inactive Admins", value: stats?.inactiveAdmins ?? 0 },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-6 text-primary dark:text-text1">
        Super Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <StatusCard
          title="Total Admins"
          value={stats?.totalAdmins ?? 0}
          borderColor="border-secondary"
        />
        <StatusCard
          title="Active Admins"
          value={stats?.activeAdmins ?? 0}
          borderColor="border-success"
        />
        <StatusCard
          title="Inactive Admins"
          value={stats?.inactiveAdmins ?? 0}
          borderColor="border-error"
        />
        <StatusCard
          title="Total Events"
          value={stats?.totalEvents ?? 0}
          borderColor="border-secondary"
        />
      </div>

      {/* Pie Chart */}
      <div className="bg-text1 dark:bg-bgDark p-6 rounded-2xl shadow w-full h-[350px]">
        <h2 className="text-lg font-semibold mb-4 text-primary dark:text-text1">
          Admin Status Overview
        </h2>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={110}
              dataKey="value"
              label
            >
              {pieData.map((entry, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </AdminLayout>
  );
}
