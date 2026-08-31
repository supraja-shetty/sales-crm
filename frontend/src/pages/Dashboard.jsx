
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import api from "../services/api";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const response = await api.get("/dashboard/summary");
      setData(response.data);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(
        err.response?.data?.message || "Could not load dashboard"
      );
    }
  }

  if (error) {
    return (
      <div className="alert error">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="loading">
        Loading dashboard...
      </div>
    );
  }

  const stageCounts = Array.isArray(data.stageCounts)
    ? data.stageCounts
    : [];

  const chartData = stageCounts.map((item) => ({
    stage: item._id || "Unknown",
    deals: Number(item.count || 0),
    value: Number(item.value || 0),
  }));

  const pieData = stageCounts.map((item) => ({
    name: item._id || "Unknown",
    value: Number(item.count || 0),
  }));

  const COLORS = [
    "#6366f1",
    "#f59e0b",
    "#22c55e",
    "#ef4444",
    "#06b6d4",
  ];

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="page-heading dashboard-heading">
        <div>
          <h2>Sales Dashboard</h2>
          <p>
            Track your sales performance, pipeline and customer activity.
          </p>
        </div>

        <Link to="/deals" className="primary-btn">
          View Pipeline →
        </Link>
      </div>

      {/* STAT CARDS */}
      <div className="stats-grid">

        <StatCard
          label="Total Leads"
          value={data.totalLeads || 0}
          hint="All lead records"
        />

        <StatCard
          label="Contacts"
          value={data.totalContacts || 0}
          hint="Customer contacts"
        />

        <StatCard
          label="Total Deals"
          value={data.totalDeals || 0}
          hint="All opportunities"
        />

        <StatCard
          label="Won Revenue"
          value={`₹${Number(data.wonRevenue || 0).toLocaleString("en-IN")}`}
          hint={`${data.wonCount || 0} won deals`}
        />

        <StatCard
          label="Pipeline Value"
          value={`₹${Number(data.pipelineValue || 0).toLocaleString("en-IN")}`}
          hint="New + In Progress"
        />

        <StatCard
          label="Lost Value"
          value={`₹${Number(data.lostValue || 0).toLocaleString("en-IN")}`}
          hint={`${data.lostCount || 0} lost deals`}
        />

      </div>

      {/* QUICK ACTIONS */}
      <div className="dashboard-actions">

        <Link to="/leads" className="dashboard-action-card">
          <div className="action-icon">👥</div>
          <div>
            <strong>Manage Leads</strong>
            <span>Capture and qualify prospects</span>
          </div>
          <b>→</b>
        </Link>

        <Link to="/contacts" className="dashboard-action-card">
          <div className="action-icon">📇</div>
          <div>
            <strong>View Contacts</strong>
            <span>Manage customer relationships</span>
          </div>
          <b>→</b>
        </Link>

        <Link to="/deals" className="dashboard-action-card">
          <div className="action-icon">💰</div>
          <div>
            <strong>Sales Pipeline</strong>
            <span>Track deals and revenue</span>
          </div>
          <b>→</b>
        </Link>

      </div>

      {/* CHARTS */}
      <div className="chart-grid">

        {/* BAR CHART */}
        <div className="panel dashboard-panel">

          <div className="panel-header">
            <div>
              <h3>Deals by Stage</h3>
              <span className="panel-subtitle">
                Current sales pipeline distribution
              </span>
            </div>
          </div>

          <div className="chart-box">

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 0,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="stage"
                    tick={{ fontSize: 12 }}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                  />

                  <Tooltip
                    formatter={(value) => [value, "Deals"]}
                  />

                  <Bar
                    dataKey="deals"
                    fill="#6366f1"
                    radius={[8, 8, 0, 0]}
                    barSize={45}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">
                No deal data available yet.
              </div>
            )}

          </div>
        </div>

        {/* PIE CHART */}
        <div className="panel dashboard-panel">

          <div className="panel-header">
            <div>
              <h3>Stage Distribution</h3>
              <span className="panel-subtitle">
                Deal distribution by status
              </span>
            </div>
          </div>

          <div className="chart-box">

            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>

                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    outerRadius={105}
                    innerRadius={55}
                    paddingAngle={3}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">
                No stage data available yet.
              </div>
            )}

          </div>
        </div>

      </div>


     


        </div>

     
  );
}