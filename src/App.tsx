import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import AdminRoute from "./components/AdminRoute";
import About from "./pages/About";

import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <BrowserRouter>
      <nav className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-8 py-4 text-white">
  <div className="text-2xl font-bold text-purple-400">
    AcillNet 🚀
  </div>

  <div className="flex items-center gap-6">
    <Link to="/">Home</Link>

    {!user ? (
      <>
        <Link to="/login">
          Login
        </Link>

        <Link to="/register">
          Register
        </Link>
      </>
    ) : (
      <>
        <span className="text-slate-300">
          {user.email}
        </span>

        <button
          onClick={logout}
          className="rounded-lg bg-red-500 px-4 py-2 hover:bg-red-600"
        >
          Logout
        </button>
      </>
    )}

    <Link
      to="/admin"
      className="rounded-lg bg-purple-600 px-4 py-2 hover:bg-purple-700"
    >
      Admin
    </Link>
  </div>
</nav>

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

       <Route
  path="/admin"
  element={
    <AdminRoute>
      <Admin />
    </AdminRoute>
  }
/>
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
      </Routes>
      <Route
  path="/about"
  element={<About />}
/>
</route>
    </BrowserRouter>
  );
}