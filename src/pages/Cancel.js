// src/pages/Cancel.js
import React from "react";

export default function Cancel() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-red-600">❌ Payment Canceled</h1>
      <p className="mt-4">No worries, you can try again anytime.</p>
      <a href="/ai" className="mt-6 text-purple-600 underline">
        Go back Home
      </a>
    </div>
  );
}
