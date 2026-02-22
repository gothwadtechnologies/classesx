
import React, { createContext, useContext, useState } from 'react';

interface AdminViewContextType {
  isAdminViewMode: boolean;
  setIsAdminViewMode: (mode: boolean) => void;
}

const AdminViewContext = createContext<AdminViewContextType | undefined>(undefined);

export const AdminViewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminViewMode, setIsAdminViewMode] = useState(true);

  return (
    <AdminViewContext.Provider value={{ isAdminViewMode, setIsAdminViewMode }}>
      {children}
    </AdminViewContext.Provider>
  );
};

export const useAdminView = () => {
  const context = useContext(AdminViewContext);
  if (context === undefined) {
    throw new Error('useAdminView must be used within an AdminViewProvider');
  }
  return context;
};
