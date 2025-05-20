import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Import Lucide icons
import { LineChart as LineChartIcon, BarChart3, Users, User, UserPlus, UserCheck, ArrowUpRight } from "lucide-react";

export default function UserDashboard({ inlineDashboard = false }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('7d');
  const [activeTab, setActiveTab] = useState('new-users');

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Updated API endpoint to match the correct route
        const response = await axiosInstance.get(`/api/users/admin/dashboard-metrics?period=${period}`);
        // Check if response data follows the format specified in the API docs
        if (response.data && response.data.data && response.data.data.charts) {
          setData(response.data.data.charts);
        } else {
          // For backwards compatibility or in case the API structure is different
          setData(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard metrics:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    // For development, generate sample data if API fails
    const generateSampleData = () => {
      const sampleData = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        sampleData.push({
          date: date.toLocaleDateString("vi-VN", { weekday: "short", day: "numeric", month: "numeric" }),
          newUsers: Math.floor(Math.random() * 90) + 10,
          totalUsers: 1000 + Math.floor(Math.random() * 500) + (6 - i) * 50,
          activeUsers: 800 + Math.floor(Math.random() * 200),
        });
      }
      
      setData(sampleData);
      setLoading(false);
    };

    fetchDashboardData().catch(() => generateSampleData());
  }, [period]);

  // Calculate metrics from the data
  const calculateMetrics = () => {
    if (!data || !data.length) return { totalNewUsers: 0, avgNewUsers: 0, growthRate: 0 };
    
    // Tính tổng số người dùng mới
    const totalNewUsers = data.reduce((sum, item) => sum + item.newUsers, 0);

    // Tính trung bình số người dùng mới mỗi ngày
    const avgNewUsers = Math.round(totalNewUsers / data.length);

    // Tính phần trăm tăng trưởng (so sánh nửa sau với nửa đầu của khoảng thời gian)
    const midpoint = Math.floor(data.length / 2);
    const recentUsers = data.slice(midpoint).reduce((sum, item) => sum + item.newUsers, 0);
    const previousUsers = data.slice(0, midpoint).reduce((sum, item) => sum + item.newUsers, 0);
    const growthRate = previousUsers ? Math.round(((recentUsers - previousUsers) / previousUsers) * 100) : 0;

    return { totalNewUsers, avgNewUsers, growthRate };
  };

  const { totalNewUsers, avgNewUsers, growthRate } = calculateMetrics();

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  // Inline dashboard doesn't need the header and has different styling
  const containerClasses = inlineDashboard
    ? "w-full flex-col"
    : "w-full flex-col bg-gray-50 min-h-screen";

  const mainContent = (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Stats Card - New Users */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total New Users</h3>
            <UserPlus className="h-4 w-4 text-gray-500" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold">{totalNewUsers}</div>
            <div className="flex items-center text-xs text-gray-500">
              <span className={`mr-1 ${growthRate >= 0 ? "text-green-500" : "text-red-500"}`}>
                {growthRate >= 0 ? "+" : ""}
                {growthRate}%
              </span>
              <ArrowUpRight className={`h-3 w-3 ${growthRate >= 0 ? "text-green-500" : "text-red-500"}`} />
              <span className="ml-1">compared to previous</span>
            </div>
          </div>
        </div>
        
        {/* Stats Card - Average Daily Users */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Daily Average</h3>
            <User className="h-4 w-4 text-gray-500" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold">{avgNewUsers}</div>
            <p className="text-xs text-gray-500">new users/day</p>
          </div>
        </div>
        
        {/* Stats Card - Total Users */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Users</h3>
            <Users className="h-4 w-4 text-gray-500" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold">{data.length > 0 && data[data.length - 1].totalUsers ? data[data.length - 1].totalUsers : 0}</div>
            <p className="text-xs text-gray-500">registered users</p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center bg-gray-100 p-1 border-b border-gray-200">
          <div className="flex rounded-md bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab('new-users')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'new-users' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
              }`}
            >
              New Users
            </button>
            <button
              onClick={() => setActiveTab('all-users')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'all-users' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
              }`}
            >
              All Users
            </button>
            <button
              onClick={() => setActiveTab('active-users')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'active-users' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
              }`}
            >
              Active Users
            </button>
          </div>
        </div>
        
        {/* New Users Tab Content */}
        {activeTab === 'new-users' && (
          <div className="p-6">
            <div>
              <h3 className="text-lg font-semibold">New Users in Last 7 Days</h3>
              <p className="text-sm text-gray-500 mt-1">Chart showing the number of new user registrations per day</p>
            </div>
            <div className="pl-2 mt-4 h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} users`, "New Users"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    name="New Users"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {/* All Users Tab Content */}
        {activeTab === 'all-users' && (
          <div className="p-6">
            <div>
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-sm text-gray-500 mt-1">Chart showing total users over time</p>
            </div>
            <div className="pl-2 mt-4 h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} users`, "Total Users"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalUsers"
                    name="Total Users"
                    stroke="#82ca9d"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {/* Active Users Tab Content */}
        {activeTab === 'active-users' && (
          <div className="p-6">
            <div>
              <h3 className="text-lg font-semibold">Active Users</h3>
              <p className="text-sm text-gray-500 mt-1">Chart showing daily active users</p>
            </div>
            <div className="pl-2 mt-4 h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} users`, "Active Users"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="activeUsers"
                    name="Active Users"
                    stroke="#ff7300"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // If inline dashboard, just return the main content
  if (inlineDashboard) {
    return mainContent;
  }

  // Otherwise return the full standalone dashboard with header
  return (
    <div className={containerClasses}>
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
          <h1 className="text-xl font-semibold">User Dashboard</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          {mainContent}
        </main>
      </div>
    </div>
  );
} 