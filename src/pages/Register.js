import React, { useState } from "react";
import { FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");
    setLoading(true);

    let newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.message || "Registration failed" });
      } else {
        setSuccessMsg("Account created successfully! 🎉");
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        
        // Redirect to signin after 1 second
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      setErrors({ general: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4"> {/* dark:bg-gray-900 added */}
    <div className="max-w-3xl w-full grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700"> {/* dark:border-gray-700 added */}

      {/* LEFT SECTION */}
      <div className="bg-gradient-to-br from-teal-700 to-teal-900 p-8 flex flex-col items-center justify-center text-center text-white">
        <h3 className="text-2xl font-bold leading-snug mb-4">
          Workmate AI — Your Intelligent Career Partner
        </h3>
        <p className="text-sm text-teal-50 mb-6">
          Harness the power of AI to discover tailored opportunities, connect
          with industry leaders, and accelerate your career growth.
        </p>
        <p className="font-medium text-xs opacity-90 mb-6">
          Trusted by 50,000+ professionals worldwide
        </p>

        <div className="p-4 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 max-w-xs">
          <p className="font-medium text-sm">
            Start shaping your career future today.
          </p>
          <p className="text-xs text-teal-100 mt-1">
            Sign up now and let Workmate AI guide your next move.
          </p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="bg-white dark:bg-gray-800 p-6 flex flex-col justify-center items-center max-w-sm mx-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700"> {/* dark:bg-gray-800, dark:border-gray-700, rounded-lg, shadow-md added */}

        {/* Small logo with no margin */}
        <img
          src="/logo.png"
          alt="Workmate AI Logo"
          className="w-24 h-25 object-contain"
        />

        {/* Heading right after logo */}
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1"> {/* dark:text-gray-100 added */}
          Create Your Account
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-300 mb-4 text-center"> {/* dark:text-gray-300 added */}
          Join Workmate AI and unlock smarter career tools.
        </p>

        {errors.general && (
          <p className="text-red-500 text-xs mb-2">{errors.general}</p>
        )}
        {successMsg && (
          <p className="text-green-600 text-xs mb-2">{successMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 w-full">
          {[
            { label: "Full Name", name: "name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Password", name: "password", type: "password" },
            { label: "Confirm Password", name: "confirmPassword", type: "password" },
          ].map((field, idx) => (
            <div key={idx}>
              <input
                name={field.name}
                type={field.type}
                placeholder={field.label}
                value={formData[field.name]}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 border ${
                  errors[field.name]
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                } focus:ring-2 outline-none transition`}
              />
              {errors[field.name] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-2 rounded-lg bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white text-sm font-semibold transition disabled:opacity-50">Sign Up</button>
        </form>

        <p className="text-xs text-gray-500 dark:text-gray-300 mt-3"> {/* dark:text-gray-300 added */}
          Already have an account?{" "}
          <a href="/login" className="text-teal-600 hover:underline">
            Login here
          </a>
        </p>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300 dark:border-gray-600" /> {/* dark:border-gray-600 added */}
          <span className="mx-2 text-gray-400 dark:text-gray-500 text-xs">or</span> {/* dark:text-gray-500 added */}
          <hr className="flex-grow border-gray-300 dark:border-gray-600" /> {/* dark:border-gray-600 added */}
        </div>

        <div className="flex items-center justify-center gap-3">
          {[FaGoogle, FaApple, FaFacebookF].map((Icon, idx) => (
            <button
              key={idx}
              type="button"
              className="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:shadow-sm transition"></button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

}
