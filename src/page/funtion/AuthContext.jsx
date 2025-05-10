import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log("Stored user from localStorage:", storedUser);
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
      console.log("isAuthenticated set to true from localStorage");
    } else {
      console.log("No user in localStorage");
    }
  }, []);

  const login = (userData) => {
    console.log("Logging in with userData:", userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    console.log("isAuthenticated set to true after login");
  };

  const logout = () => {
    console.log("Logging out");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    console.log("isAuthenticated set to false after logout");
  };

  console.log("AuthProvider state:", { isAuthenticated, user });

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
