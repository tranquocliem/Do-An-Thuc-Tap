import React, { createContext, useEffect, useState } from "react";
import { isAuthenticated as chechAuth } from "../Service/AccountService";
import Loading from "../Components/Loading/Loading";
import io from "socket.io-client";

export const AuthContext = createContext();

const Auth = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [socket, setSocket] = useState();

  useEffect(() => {
    chechAuth().then((data) => {
      setTimeout(() => {
        setUser(data.user);
        setIsAuthenticated(data.isAuthenticated);
        setIsLoaded(true);
      }, 2000);
    });
  }, []);

  useEffect(() => {
    const sk = io();
    setSocket(sk);
    return () => sk.close();
  }, []);

  return (
    <div>
      {!isLoaded ? (
        <Loading bg="black" />
      ) : (
        <AuthContext.Provider
          value={{
            user,
            setUser,
            isAuthenticated,
            setIsAuthenticated,
            socket,
            setSocket,
          }}
        >
          {children}
        </AuthContext.Provider>
      )}
    </div>
  );
};

export default Auth;
