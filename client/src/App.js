import "./App.css";
import DuongDanURL from "../src/Components/DuongDanURL/DuongDanURL";
import { AuthContext } from "./Context/AuthContext";
import { useContext } from "react";
import Header from "./Components/Header/Header";
import Toastify from "./Components/Toastify/Toastify";
import SocketClient from "./Shared/SocketClient";

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="App">
      {isAuthenticated ? <Header /> : null}
      {isAuthenticated && <SocketClient />}
      <DuongDanURL />
      <Toastify autoClose={2000} pauseOnHover={false} closeOnClick={false} />
    </div>
  );
}

export default App;
