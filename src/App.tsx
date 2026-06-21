import "./App.css";
import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";
import Watch from "./pages/Watch";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<div>Collections</div>} />
        <Route path="/recent" element={<div>Recent</div>} />
      </Route>
      <Route path="/watch/:videoId" element={<Watch />} />
      <Route path="*" element={<div>Not found</div>} />
    </Routes>
  );
}

export default App;
