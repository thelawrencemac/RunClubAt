"use client";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";

export default function GroupFlyer({
  params,
}: {
  params: { groupname: string };
}) {
  const [group, setGroup] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchGroup() {
      const res = await fetch(`/api/groups/${params.groupname}`);
      if (res.ok) {
        const data = await res.json();
        setGroup(data);
      } else {
        setNotFound(true);
      }
    }
    fetchGroup();
  }, [params.groupname]);

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-500 via-yellow-300 to-green-300 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h1 className="text-3xl font-bold mb-2">Group Not Found</h1>
          <p>This group does not exist.</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-orange-500 via-yellow-300 to-green-300 p-4">
      <h1 className="text-7xl md:text-8xl font-extrabold text-white mb-8 text-center">
        RUN
        <br />
        CLUB
      </h1>
      <div className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
        @ {group.groupName}
      </div>
      <div className="text-3xl md:text-4xl font-extrabold text-white mb-4 text-center">
        {group.timeAndDate}
      </div>
      <div className="text-xl md:text-2xl font-semibold text-white mb-8 text-center">
        {group.slogan}
      </div>
      <div className="bg-white p-4 rounded-xl shadow-lg mb-8">
        <QRCode value={group.stravaLink || window.location.href} size={200} />
      </div>
      <div className="text-lg md:text-xl font-bold text-white text-center mb-2">
        Start: {group.startLocation}
      </div>
      <div className="text-md text-white/80 text-center">
        Pack Leads: {group.packLead1}
        {group.packLead2 ? `, ${group.packLead2}` : ""}
      </div>
    </div>
  );
}
