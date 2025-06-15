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
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const phone = event.target.value.replace(/\D/g, ""); // Remove non-digits
    if (phone.length === 10) {
      // Submit when we have exactly 10 digits
      await onSubmit(phone);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input
        type="tel"
        name="phone"
        placeholder="e.g. 5551234567"
        required
        onChange={handleChange}
        maxLength={10}
        pattern="[0-9]*"
        inputMode="numeric"
        className="w-full p-3 border border-gray-300 rounded mb-4"
      />
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {isSubmitting && <p className="text-gray-600 text-sm">Submitting...</p>}
    </form>
  );
};

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

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

      setIsSuccess(true);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsSuccess(false);
    setError(null);
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

      <Modal isModalOpen={isModalOpen} setIsModalOpen={closeModal}>
        <div className="text-center">
          {!isSuccess ? (
            <>
              <h2 className="text-2xl font-bold mb-2">Sending now!</h2>
              <p className="mb-4">Enter your phone number:</p>
              <PhoneNumberForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                error={error}
              />
            </>
          ) : (
            <div className="py-4">
              <h2 className="text-2xl font-bold mb-2">
                We&apos;ll be in touch!
              </h2>
              <p className="text-gray-600">
                Thanks for your interest in Run Club @
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
