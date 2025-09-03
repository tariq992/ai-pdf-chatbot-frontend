// AIzaSyCGmNfYPPGO-x-eh6I2J-AnNsqsT0sl-8E

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import Notes from "./pages/Notes";
import Ai from "./pages/ChatBox";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import "./App.css";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="ai" element={<Ai />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        {/* Private */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Notes />} />
      
        </Route>
      </Routes>
    </Router>
  );
}