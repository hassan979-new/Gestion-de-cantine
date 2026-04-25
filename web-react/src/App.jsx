import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Menus from "./pages/Menus";
import Orders from "./pages/Orders";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-100">

        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg p-5">
          <h1 className="text-2xl font-bold mb-6">Cantine</h1>

          <div className="flex flex-col gap-3">
            <Link to="/" className="hover:text-blue-500">Dashboard</Link>
            <Link to="/menus" className="hover:text-blue-500">Menus</Link>
            <Link to="/orders" className="hover:text-blue-500">Orders</Link>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/menus" element={<Menus />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>

        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;