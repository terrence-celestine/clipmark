import "./App.css";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Home</div>} />
      <Route path="/watch/:videoId" element={<div>Watch</div>} />
    </Routes>
  );
}

export default App;
