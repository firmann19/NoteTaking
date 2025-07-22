import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const getSession = async () => await getServerSession(authOptions);
