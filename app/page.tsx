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
    const phone = event.target.value.replace(/\D/g, "");
    if (phone.length === 10) {
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
      const response = await fetch("/api/phone-numbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      setIsSuccess(true);
    } catch (err) {
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

      <br />
      <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
        Launch Your Run Club in Minutes
      </h1>
      <div className="text-lg md:text-xl max-w-xl mx-auto text-white/90 font-light drop-shadow-md mb-6">
        <div className="bg-black/60 rounded-lg px-4 py-3 inline-block font-semibold text-white">
          Strava-Linked. SMS-Powered, Auto-text invites,
          <br />
          printable flyers, and Strava routes built in.
        </div>
      </div>

      <div className="mt-4 bg-white text-gray-800 rounded-xl p-4 max-w-xs text-left shadow-lg text-sm">
        <p className="font-bold mb-2">📲 What your runners get:</p>
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
        <p className="text-xs text-gray-500 mt-2">Auto sent before each run.</p>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-8 px-6 py-3 text-lg bg-white text-gray-800 font-semibold rounded-md hover:bg-gray-100 transition"
      >
        Get Early Access
      </button>

      <Modal isModalOpen={isModalOpen} setIsModalOpen={closeModal}>
        <div className="text-center">
          {!isSuccess ? (
            <>
              <h2 className="text-2xl font-bold mb-2">Get the app first!</h2>
              <p className="mb-4">
                Enter your phone number to join the waitlist:
              </p>
              <PhoneNumberForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                error={error}
              />
            </>
          ) : (
            <div className="py-4">
              <h2 className="text-2xl font-bold mb-2">
                You&apos;re on the list!
              </h2>
              <p className="text-gray-600">
                We&apos;ll text you as soon as it&apos;s live.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
