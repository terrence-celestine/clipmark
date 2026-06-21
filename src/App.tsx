import "./App.css";
import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";
function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<div>Collections</div>} />
        <Route path="/recent" element={<div>Recent</div>} />
      </Route>
      <Route path="/watch/:videoId" element={<div>Watch</div>} />
      <Route path="*" element={<div>Not found</div>} />
    </Routes>
  );
}

export default App;
