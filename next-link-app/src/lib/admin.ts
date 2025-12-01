import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Not authorized");
  }
  return session;
}
