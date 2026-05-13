"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Package, Zap, AlertCircle, TrendingUp, Activity } from "lucide-react";
import { useAuthStore } from "@/store/auth";

interface DashboardStats {
  active_users: number;
  total_users: number;
  current_version: string;
  total_releases: number;
  failed_builds: number;
  system_uptime_percent: number;
}

const mockData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 450 },
  { name: "Mar", value: 500 },
  { name: "Apr", value: 520 },
  { name: "May", value: 580 },
  { name: "Jun", value: 630 },
];

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: React.ComponentType<{ className: string }>;
  label: string;
  value: string | number;
  trend?: string;
}) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{label}</p>
          <p className="text-white text-3xl font-bold mt-2">{value}</p>
          {trend && <p className="text-green-400 text-xs mt-2">{trend}</p>}
        </div>
        <div className="bg-blue-600/20 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-blue-400" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { token, hydrateFromStorage } = useAuthStore();

  useEffect(() => {
    const fetchStats = async () => {
      hydrateFromStorage();

      try {
        const tokenToUse = token || localStorage.getItem("access_token");
        if (!tokenToUse) {
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:3001/api/admin/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${tokenToUse}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token, hydrateFromStorage]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-700 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-700 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back! Here's your system overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Users}
          label="Active Users"
          value={stats?.active_users || 0}
          trend="+12% from last month"
        />
        <StatCard
          icon={Package}
          label="Current Version"
          value={stats?.current_version || "0.0.0"}
        />
        <StatCard
          icon={Zap}
          label="Total Releases"
          value={stats?.total_releases || 0}
        />
        <StatCard
          icon={AlertCircle}
          label="Failed Builds"
          value={stats?.failed_builds || 0}
          trend="0 critical issues"
        />
        <StatCard
          icon={Activity}
          label="System Uptime"
          value={`${stats?.system_uptime_percent || 99.9}%`}
        />
        <StatCard
          icon={TrendingUp}
          label="Growth"
          value="+8.2%"
          trend="vs last period"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Chart */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Users Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                labelStyle={{ color: "#f1f5f9" }}
              />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Builds Chart */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Build Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                labelStyle={{ color: "#f1f5f9" }}
              />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 pb-4 border-b border-slate-700 last:border-0">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Version 1.0.{i} released</p>
                <p className="text-slate-400 text-sm">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
