import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import User from "@/models/User";
import { connectToDatabase } from "@/libs/mongodb";

export default async function DashboardRedirect() {
  const session = await getServerSession();
  if (!session || !session.user?.email) {
    redirect("/api/auth/signin");
  }

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    redirect("/api/auth/signin");
  }

  if (!user.groupNames || user.groupNames.length === 0) {
    redirect("/setup-group");
  } else if (user.groupNames.length === 1) {
    redirect(`/${user.groupNames[0]}/dashboard`);
  }

  // If user has multiple groups, show a group switcher
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-orange-500 via-yellow-300 to-green-300 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Select a Group</h1>
        <form action="" method="GET">
          <select
            name="group"
            className="w-full border rounded p-2 mb-4"
            onChange={(e) => {
              if (e.target.value)
                window.location.href = `/${e.target.value}/dashboard`;
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Choose a group
            </option>
            {user.groupNames.map((g: string) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </form>
      </div>
    </div>
  );
}
