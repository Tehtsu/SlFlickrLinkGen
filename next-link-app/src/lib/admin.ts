import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") {
    throw new Error("Not authorized");
  }
  return session;
}
