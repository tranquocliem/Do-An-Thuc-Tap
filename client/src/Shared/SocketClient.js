import React, { useContext, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";

function SocketClient() {
  const { user, socket } = useContext(AuthContext);

  useEffect(() => {
    socket.emit("joinUser", user._id);
  }, [socket, user._id]);

  return <></>;
}

export default SocketClient;
