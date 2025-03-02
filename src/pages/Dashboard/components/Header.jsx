import React from "react";
import { Search, Menu, FileText } from "lucide-react";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="border-b bg-white">
      <div className="flex items-center h-16 px-4">
        <button 
          className="p-2 rounded-md hover:bg-gray-100" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center ml-4 gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold hidden md:block">CV Builder</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="search"
              placeholder="Tìm kiếm..."
              className="w-full bg-gray-100 border border-gray-200 rounded-md pl-8 pr-4 py-2 md:w-[300px] lg:w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="rounded-full overflow-hidden">
            <img
              alt="Avatar"
              className="rounded-full"
              height="32"
              src="https://placehold.co/32x32"
              style={{ aspectRatio: "32/32", objectFit: "cover" }}
              width="32"
            />
            <span className="sr-only">Toggle user menu</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 