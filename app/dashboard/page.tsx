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

  if (!user.groupName) {
    redirect("/setup-group");
  } else {
    redirect(`/${user.groupName}/dashboard`);
  }
}
