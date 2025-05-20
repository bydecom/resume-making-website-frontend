import React, { createContext, useContext, useState } from 'react';

// Create context for sidebar state
const SidebarContext = createContext({
  isOpen: true,
  setIsOpen: () => {},
  transitionDuration: '300ms'
});

export const SidebarProvider = ({ children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const Sidebar = ({ children, className = '', transitionDuration = '300ms' }) => {
  const { isOpen } = useContext(SidebarContext);

  return (
    <aside
      className={`overflow-hidden ${className}`}
      style={{ 
        width: isOpen ? '16rem' : '0',  // 16rem = 64px, 0 to completely hide
        opacity: isOpen ? '1' : '0',
        transition: `width ${transitionDuration} ease-in-out, opacity ${transitionDuration} ease-in-out`
      }}
    >
      <div className="h-full flex flex-col w-64">{children}</div>
    </aside>
  );
};

export const SidebarHeader = ({ children, className = '' }) => {
  const { isOpen } = useContext(SidebarContext);
  
  if (!isOpen) {
    return null; // Don't render header when sidebar is collapsed
  }
  
  return <div className={`${className}`}>{children}</div>;
};

export const SidebarContent = ({ children, className = '' }) => {
  return <div className={`flex-1 overflow-y-auto overflow-x-hidden ${className}`}>{children}</div>;
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
        {isOpen ? (
          children
        ) : (
          // When sidebar is collapsed, only show icons
          React.Children.map(children, child => {
            if (React.isValidElement(child) && 
                (child.type === 'span' || 
                 (typeof child.type === 'object' && child.type.displayName === 'ChevronDown'))) {
              return null;
            }
            return child;
          })
        )}
      </button>
    );
  }
);

SidebarMenuButton.displayName = 'SidebarMenuButton';

export const SidebarMenuSub = ({ children, className = '' }) => {
  const { isOpen } = useContext(SidebarContext);
  
  if (!isOpen) {
    return null; // Don't show submenu when sidebar is collapsed
  }
  
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

// Export the context for direct use
export { SidebarContext }; 