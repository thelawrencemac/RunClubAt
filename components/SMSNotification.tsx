"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface SMSNotificationProps {
  groupName: string;
  onSend?: (result: any) => void;
}

export default function SMSNotification({
  groupName,
  onSend,
}: SMSNotificationProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/sms/group-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupName,
          message: message.trim(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(
          `Message sent! ${result.successful} delivered, ${result.failed} failed`
        );
        setMessage("");
        setShowForm(false);
        onSend?.(result);
      } else {
        toast.error(result.error || "Failed to send message");
      }
    } catch (error) {
      console.error("SMS send error:", error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="btn btn-primary btn-sm"
      >
        📱 Send Group SMS
      </button>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title">Send SMS to {groupName}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Message</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="textarea textarea-bordered h-24"
              placeholder="Enter your message here..."
              maxLength={160}
              required
            />
            <label className="label">
              <span className="label-text-alt">
                {message.length}/160 characters
              </span>
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="btn btn-primary btn-sm"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Sending...
                </>
              ) : (
                "Send SMS"
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setMessage("");
              }}
              className="btn btn-ghost btn-sm"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="text-xs text-gray-500 mt-2">
          💡 Tip: Keep messages under 160 characters to avoid multiple SMS
          charges
        </div>
      </div>
    </div>
  );
}
