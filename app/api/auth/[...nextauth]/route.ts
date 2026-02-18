import NextAuth from "next-auth";
import { authConfigWithAdapter } from "@/auth";

const handler = NextAuth(authConfigWithAdapter);

export { handler as GET, handler as POST };
