"use client";

import React, { useState } from "react";
import Modal from "@/components/Modal";

const PhoneNumberForm = ({
  onSubmit,
  isSubmitting,
  error,
}: {
  onSubmit: (phone: string) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}) => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const phone = formData.get("phone") as string;
    await onSubmit(phone);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="tel"
        name="phone"
        placeholder="e.g. (555) 123-4567"
        required
        className="w-full p-3 border border-gray-300 rounded mb-4"
      />
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (phone: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Making API request to /api/phone-numbers");
      const response = await fetch("/api/phone-numbers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      alert("Thanks! You're on the list.");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-500 via-yellow-300 to-green-300 animate-[gradientMove_15s_ease_infinite] text-white font-sans flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-5xl md:text-7xl font-bold mb-2">RUN</h1>
      <h1 className="text-5xl md:text-7xl font-bold mb-2">CLUB</h1>
      <h1 className="text-6xl font-extrabold mb-4">@</h1>

      <div className="text-4xl md:text-6xl font-extrabold mt-8 leading-tight">
        COMING SOON!
        <span className="block text-lg md:text-xl font-normal mt-2">
          The fastest way to launch and lead a run club —<br />
          Strava-linked, SMS-powered, and ready to print.
        </span>
      </div>

      <div className="mt-6 bg-white text-gray-800 rounded-xl p-4 max-w-xs text-left shadow-lg text-sm">
        <p className="font-bold mb-2">📲 Text preview:</p>
        <p>
          Hey it&apos;s Taylor! Run Club @ Riverside starts at 7AM. Here&apos;s
          the route:{" "}
          <a
            href="https://strava.app.link/WXHitskScUb"
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            strava.app.link/WXHitskScUb
          </a>
        </p>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-8 px-6 py-3 text-lg bg-white text-gray-800 font-semibold rounded-md hover:bg-gray-100 transition"
      >
        Send me this app!
      </button>

      <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Sending now!</h2>
          <p className="mb-4">Enter your phone number:</p>
          <PhoneNumberForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={error}
          />
        </div>
      </Modal>
    </div>
  );
}
