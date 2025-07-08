"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import SMSNotification from "@/components/SMSNotification";

export default function Dashboard({
  params,
}: {
  params: { groupname: string };
}) {
  const [form, setForm] = useState({
    groupName: params.groupname || "",
    timeAndDate: "",
    packLead1: "",
    packLead2: "",
    stravaLink: "",
    startLocation: "",
    slogan: "",
  });
  const [isPublishing, setIsPublishing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchGroup() {
      try {
        const res = await fetch(`/api/groups/${params.groupname}`);
        if (res.ok) {
          const data = await res.json();
          setForm({
            groupName: data.groupName || params.groupname,
            timeAndDate: data.timeAndDate || "",
            packLead1: data.packLead1 || "",
            packLead2: data.packLead2 || "",
            stravaLink: data.stravaLink || "",
            startLocation: data.startLocation || "",
            slogan: data.slogan || "",
          });
        }
      } catch (e) {
        // ignore if not found
      }
    }
    fetchGroup();
  }, [params.groupname]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`/api/groups/${params.groupname}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, adminId: "000000000000000000000000" }),
      });
      if (!res.ok) throw new Error("Failed to publish");
      setSuccess(true);
      setIsModalOpen(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-orange-500 via-yellow-300 to-green-300 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Edit Group Flyer</h1>

        {/* SMS Notification Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Group Communications</h2>
          <SMSNotification
            groupName={params.groupname}
            onSend={(result) => {
              console.log("SMS sent:", result);
            }}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Group Name</label>
            <input
              name="groupName"
              value={form.groupName}
              onChange={handleChange}
              className="w-full border rounded p-2"
              readOnly
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Time and Date</label>
            <input
              name="timeAndDate"
              value={form.timeAndDate}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="e.g. Thursdays 7AM"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Pack Lead Name</label>
            <input
              name="packLead1"
              value={form.packLead1}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Pack Lead 2</label>
            <input
              name="packLead2"
              value={form.packLead2}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">
              Strava Link to Route
            </label>
            <input
              name="stravaLink"
              value={form.stravaLink}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Start Location</label>
            <input
              name="startLocation"
              value={form.startLocation}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Slogan</label>
            <textarea
              name="slogan"
              value={form.slogan}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-bold py-2 rounded hover:bg-orange-600 transition"
            disabled={isPublishing}
          >
            {isPublishing ? "Publishing..." : "Publish"}
          </button>
          {success && (
            <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Your Flyer is Live!</h2>
                <p className="mb-4">Share this link with your group:</p>
                <a
                  href={`/${params.groupname}`}
                  className="text-blue-600 underline break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`${window.location.origin}/${params.groupname}`}
                </a>
                <button
                  className="mt-6 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </Modal>
          )}
          {error && <p className="text-red-600 text-center mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}
