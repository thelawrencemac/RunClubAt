"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupGroup() {
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupName,
          adminId: "000000000000000000000000",
        }), // TODO: use real user id
      });
      if (res.status === 409) {
        setError("Group name already taken");
      } else if (!res.ok) {
        setError("Failed to create group");
      } else {
        router.push(`/${groupName}/dashboard`);
      }
    } catch (e) {
      setError("Failed to create group");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-orange-500 via-yellow-300 to-green-300 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Set Up Your Group</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Group Name</label>
            <input
              name="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full border rounded p-2"
              required
              minLength={3}
              maxLength={32}
              pattern="^[a-zA-Z0-9_-]+$"
              placeholder="e.g. GradientRunners"
            />
            <p className="text-xs text-gray-500 mt-1">
              This cannot be changed later.
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-bold py-2 rounded hover:bg-orange-600 transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Group"}
          </button>
          {error && <p className="text-red-600 text-center mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}
