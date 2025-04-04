import React from "react";
import { FileText, User, Settings } from "lucide-react";

const Sidebar = ({ isOpen }) => {
  return (
    <div
      className={`${
        isOpen ? "w-32" : "w-0"
      } transition-all duration-300 overflow-hidden border-r bg-white flex-shrink-0 relative`}
    >
      <div className="p-4 flex items-center gap-2">
        <FileText className="h-6 w-6 text-blue-600" />
        <h1 className="text-xl font-bold">CV Builder</h1>
      </div>
      <hr className="border-t border-gray-200" />
      <div className="py-4">
        <div className="px-4 py-2 text-sm font-medium text-gray-500">MENU</div>
        <div className="space-y-1 px-2">
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Tài liệu của tôi</span>
          </button>
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Hồ sơ</span>
          </button>
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Cài đặt</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 