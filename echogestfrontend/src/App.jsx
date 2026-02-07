import { BrowserRouter, Routes, Route } from "react-router-dom";
import Controllers from "./pages/Controllers";
import Dashboard from "./pages/Dashboard";
import AddController from "./pages/AddController";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Controllers />} />
        <Route path="/controllers" element={<Controllers />} />
        <Route path="/add-controller" element={<AddController />} />
        <Route path="/dashboard/:controllerId" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
