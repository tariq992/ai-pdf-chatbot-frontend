// src/pages/Success.js
import React, { useEffect, useState } from "react";
import { checkSubscription } from "../api/api"; // <-- make sure this exists in api.js
import { useNavigate } from "react-router-dom";

export default function Success() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const activateSubscription = async () => {
      try {
        await checkSubscription(); // Call backend to set isSubscribed = true
        setLoading(false);
        // Optionally, update localStorage or context if you track user subscription
        const user = JSON.parse(localStorage.getItem("user")) || {};
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, isSubscribed: true })
        );
      } catch (err) {
        console.error("Failed to mark subscription:", err);
        setLoading(false);
      }
    };

    activateSubscription();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl font-semibold">Activating your subscription...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-green-600">✅ Payment Successful!</h1>
      <p className="mt-4">Your subscription is now active.</p>
      <button
        onClick={() => navigate("/ai")}
        className="mt-6 text-white bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition"
      >
        Go to ChatBox
      </button>
    </div>
  );
}
