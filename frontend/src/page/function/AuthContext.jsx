import { createContext, useState, useEffect } from "react";
import { getCookie, setCookie, removeCookie } from "../../helper/cookieHelper";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUserStr = getCookie("user");
    const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;
    console.log("Stored user from cookie:", storedUser);
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
      console.log("isAuthenticated set to true from cookie");
    } else {
      console.log("No user in cookie");
    }
  }, []);

  const login = (userData) => {
    console.log("Logging in with userData:", userData);
    setCookie("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    console.log("isAuthenticated set to true after login");
  };

  const logout = () => {
    console.log("Logging out");
    removeCookie("user");
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


