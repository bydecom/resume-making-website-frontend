import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FileText, FileCheck, Download, Calendar } from "lucide-react";

export default function ResumeDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/user-logs/statistics?period=${period}`);
        setData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load resume statistics.");
        setLoading(false);
      }
    };
    fetchStats();
  }, [period]);

  if (loading) return <div className="flex justify-center items-center h-64">Loading resume statistics...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!data) return null;

  const { cv, resume, timeBasedStats } = data;

  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <FileText className="h-5 w-5 text-blue-600" /> Resume Dashboard
      </h3>
      {/* Period Filter */}
      <div className="mb-4 flex gap-2">
        {['7d', '30d', '90d', '365d', 'all'].map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${period === p ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
          >
            {p === '7d' ? '7 days' : p === '30d' ? '30 days' : p === '90d' ? '90 days' : p === '365d' ? '1 year' : 'All'}
          </button>
        ))}
      </div>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 pb-2">
            <FileText className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">CVs Created</span>
          </div>
          <div className="text-2xl font-bold">{cv.totalCreated}</div>
          <div className="text-xs text-gray-500">Total CVs created</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 pb-2">
            <FileCheck className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Active CVs</span>
          </div>
          <div className="text-2xl font-bold">{cv.activeCount}</div>
          <div className="text-xs text-gray-500">CVs in use</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 pb-2">
            <FileText className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Resumes Created</span>
          </div>
          <div className="text-2xl font-bold">{resume.totalCreated}</div>
          <div className="text-xs text-gray-500">Total Resumes created</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 pb-2">
            <FileCheck className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Active Resumes</span>
          </div>
          <div className="text-2xl font-bold">{resume.activeCount}</div>
          <div className="text-xs text-gray-500">Resumes in use</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 pb-2">
            <Download className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">CV Downloads</span>
          </div>
          <div className="text-2xl font-bold">{cv.totalDownloads}</div>
          <div className="text-xs text-gray-500">Total CV downloads</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 pb-2">
            <Download className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">Resume Downloads</span>
          </div>
          <div className="text-2xl font-bold">{resume.totalDownloads}</div>
          <div className="text-xs text-gray-500">Total Resume downloads</div>
        </div>
      </div>
      {/* Charts */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Creation by Month */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Monthly Creation Count</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeBasedStats.creationByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cvCount" name="CV" fill="#8884d8" />
              <Bar dataKey="resumeCount" name="Resume" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Downloads by Month */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Download className="h-4 w-4 text-purple-500" />
            <span className="font-medium">Monthly Downloads</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeBasedStats.downloadsByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cvDownloads" name="CV Downloads" fill="#8884d8" />
              <Bar dataKey="resumeDownloads" name="Resume Downloads" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 