import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Role } from "@/types";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => Promise<void>;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("user");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("profeandres_role").then((saved) => {
      if (saved) setRoleState(saved as Role);
      setIsLoading(false);
    });
  }, []);

  const setRole = async (newRole: Role) => {
    await AsyncStorage.setItem("profeandres_role", newRole);
    setRoleState(newRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, isLoading }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within a RoleProvider");
  return ctx;
}
