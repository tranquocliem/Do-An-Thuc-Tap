import React, { createContext, useEffect, useState } from "react";
import { isAuthenticated as chechAuth } from "../Service/AccountService";
import Loading from "../Components/Loading/Loading";

export const AuthContext = createContext();

const Auth = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    chechAuth().then((data) => {
      setTimeout(() => {
        setUser(data.user);
        setIsAuthenticated(data.isAuthenticated);
        setIsLoaded(true);
      }, 2000);
    });
  }, []);

  return (
    <div>
      {!isLoaded ? (
        <Loading />
      ) : (
        <AuthContext.Provider
          value={{ user, setUser, isAuthenticated, setIsAuthenticated }}
        >
          {children}
        </AuthContext.Provider>
      )}
    </div>
  );
};

export default Auth;
