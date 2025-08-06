import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import type { NextAuthOptions } from "next-auth";

// Extend the built-in session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "employee" | "admin";
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    role?: "employee" | "admin";
  }
}

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Domain restriction: only allow @bootlabstech.com emails
      if (!user.email?.endsWith("@bootlabstech.com")) {
        console.log(`Access denied for email: ${user.email}`);
        return false;
      }
      
      console.log(`Successful sign-in for: ${user.email}`);
      return true;
    },
    
    async session({ session, user }) {
      if (session.user?.email) {
        try {
          // Get user from database to fetch role
          const { users } = await import("@/lib/db");
          const { eq } = await import("drizzle-orm");
          const dbUser = await db.query.users.findFirst({
            where: eq(users.email, session.user.email!),
          });
          
          if (dbUser) {
            session.user.role = dbUser.role as "employee" | "admin";
            session.user.id = dbUser.id;
          } else {
            // Default role for new users
            session.user.role = "employee";
            session.user.id = user.id;
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          // Fallback to default role
          session.user.role = "employee";
          session.user.id = user.id;
        }
      }
      
      return session;
    },
    
    async jwt({ token, user, account }) {
      // Persist the user role in the token
      if (user) {
        token.role = user.role || "employee";
      }
      return token;
    }
  },
  
  session: {
    strategy: "database",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`User signed in: ${user.email} (New user: ${isNewUser})`);
      
      if (isNewUser && user.email) {
        try {
          // Update user profile with additional info from Google
          const { users } = await import("@/lib/db");
          const { eq } = await import("drizzle-orm");
          await db.update(users)
            .set({
              firstName: (profile as any)?.given_name || user.name?.split(' ')[0],
              lastName: (profile as any)?.family_name || user.name?.split(' ').slice(1).join(' '),
              role: "employee", // Default role for new users
              updatedAt: new Date(),
            })
            .where(eq(users.id, user.id));
            
          console.log(`Updated profile for new user: ${user.email}`);
        } catch (error) {
          console.error("Error updating new user profile:", error);
        }
      }
    },
  },
  
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };