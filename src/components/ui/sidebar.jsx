import React, { createContext, useContext, useState } from 'react';

// Create context for sidebar state
const SidebarContext = createContext({
  isOpen: true,
  setIsOpen: () => {},
});

export const SidebarProvider = ({ children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ children, className = '' }) => {
  const { isOpen } = useContext(SidebarContext);

  return (
    <aside
      className={`border-r border-gray-200 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      } ${className}`}
    >
      <div className="h-full flex flex-col">{children}</div>
    </aside>
  );
};

export const SidebarHeader = ({ children, className = '' }) => {
  return <div className={`${className}`}>{children}</div>;
};

export const SidebarContent = ({ children, className = '' }) => {
  return <div className={`flex-1 overflow-y-auto ${className}`}>{children}</div>;
};

export const SidebarMenu = ({ children, className = '' }) => {
  return <ul className={`py-2 ${className}`}>{children}</ul>;
};

export const SidebarMenuItem = ({ children, className = '' }) => {
  return <li className={`${className}`}>{children}</li>;
};

export const SidebarMenuButton = React.forwardRef(
  ({ children, onClick, asChild, className = '', ...props }, ref) => {
    const { isOpen } = useContext(SidebarContext);
    
    if (asChild) {
      const child = React.Children.only(children);
      return React.cloneElement(child, {
        ref,
        className: `flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full ${className}`,
        onClick,
        ...props,
      });
    }

    return (
      <button
        ref={ref}
        className={`flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full ${className}`}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

SidebarMenuButton.displayName = 'SidebarMenuButton';

export const SidebarMenuSub = ({ children, className = '' }) => {
  return <ul className={`pl-6 mt-1 ${className}`}>{children}</ul>;
};

export const SidebarMenuSubItem = ({ children, className = '' }) => {
  return <li className={`${className}`}>{children}</li>;
};

export const SidebarMenuSubButton = React.forwardRef(
  ({ children, onClick, asChild, className = '', ...props }, ref) => {
    if (asChild) {
      const child = React.Children.only(children);
      return React.cloneElement(child, {
        ref,
        className: `flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full ${className}`,
        onClick,
        ...props,
      });
    }

    return (
      <button
        ref={ref}
        className={`flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full ${className}`}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

SidebarMenuSubButton.displayName = 'SidebarMenuSubButton'; 