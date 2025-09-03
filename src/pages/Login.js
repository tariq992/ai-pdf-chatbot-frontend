import React, { useState } from "react";
import { FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email.trim() || !formData.password.trim()) {
      return "All fields are required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address";
    }
    if (formData.password.length < 2) {
      return "Password must be at least 6 characters long";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      
      localStorage.setItem("user_name", res.data.user.name);  // ✅ set here

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-3xl w-full grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
        
        {/* LEFT SECTION - LOGIN FORM */}
        <div className="bg-white dark:bg-gray-800 p-8 flex flex-col justify-center">
          <img src="/logo.png" alt="Workmate AI Logo" className="w-24 h-25 object-contain" />

          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome Back</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            Sign in to access your AI-powered workspace.
          </p>

          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 border ${
                error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              } focus:border-teal-500 focus:ring-2 focus:ring-teal-500 outline-none transition`}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 border ${
                error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              } focus:border-teal-500 focus:ring-2 focus:ring-teal-500 outline-none transition`}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300 dark:border-gray-600" />
            <span className="mx-2 text-gray-400 text-xs">or</span>
            <hr className="flex-grow border-gray-300 dark:border-gray-600" />
          </div>

          {/* Social login */}
          <div className="flex items-center justify-center gap-3">
            {[FaGoogle, FaApple, FaFacebookF].map((Icon, idx) => (
              <button
                key={idx}
                type="button"
                className="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:shadow-sm transition"
              >
                <Icon className="text-gray-600 dark:text-gray-300 text-sm" />
              </button>
            ))}
          </div>

          {/* Register link */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
            Don't have an account?{" "}
            <a href="/register" className="text-teal-600 hover:underline">
              Register here
            </a>
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="bg-gradient-to-br from-teal-700 to-teal-900 p-8 flex flex-col items-center justify-center text-center text-white">
          <h3 className="text-2xl font-bold leading-snug mb-4">
            Your AI Workspace for Smarter Workdays
          </h3>
          <p className="text-sm text-teal-50 mb-6">
            Workmate AI empowers you to write, organize, and summarize your notes instantly.
            Ask questions, get answers, and let AI turn your thoughts into actionable insights.
          </p>
          <p className="font-medium text-xs opacity-90 mb-6">
            Focus on your ideas — we’ll handle the rest.
          </p>

          <div className="p-4 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 max-w-xs">
            <p className="font-medium text-sm">Take control of your workflow today.</p>
            <p className="text-xs text-teal-100 mt-1">
              Sign in and start creating, summarizing, and collaborating smarter than ever.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
