import "./App.css";
import DuongDanURL from "../src/Components/DuongDanURL/DuongDanURL";
import { AuthContext } from "./Context/AuthContext";
import { useContext } from "react";
import Header from "./Components/Header/Header";

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="App">
      {isAuthenticated ? <Header /> : null}
      <DuongDanURL />
    </div>
  );
}

export default App;
