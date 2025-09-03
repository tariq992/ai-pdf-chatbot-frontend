// src/components/SubscribeButton.js
import React from "react";
import { createCheckoutSession } from "../api/api";

export default function SubscribeButton() {
  const handleSubscribe = async () => {
    try {
      const { url } = await createCheckoutSession();
      if (url) {
        window.location.href = url; // redirect to Stripe Checkout
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Something went wrong. Try again!");
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
    >
      Subscribe
    </button>
  );
}
