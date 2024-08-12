import { z } from "zod";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "@/server/api/trpc";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { signAuth } from "@/lib/utils";

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(
      z.object({
        emailAddress: z.string().email(),
        password: z.string().min(8),
        name: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { emailAddress, password, name } = input;
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword, "hashed password");
      const existingUser = await ctx.db
        .select()
        .from(users)
        .where(eq(users.email, emailAddress))
        .limit(1);

      if (existingUser[0]) {
        return {
          success: false,
          message: "Email already exists",
          code: "EMAIL_EXISTS_VERIFIED",
          userId: null,
        };
      }

      await ctx.db.insert(users).values({
        email: emailAddress,
        password: hashedPassword,
        name,
      });

      const insertedUser = await ctx.db
        .select()
        .from(users)
        .where(eq(users.email, emailAddress))
        .limit(1);

      const user = insertedUser[0];

      if (user) {
        const token = await signAuth(user.id);
        return {
          success: true,
          message: "User created successfully.",
          code: "USER_CREATED",
          token,
          id: user.id,
        };
      }
      return {
        success: false,
        message: "Something went wrong. Please try again.",
        code: "INTERNAL_SERVER_ERROR",
        userId: null,
      };
    }),

  login: publicProcedure
    .input(
      z.object({
        emailAddress: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { emailAddress, password } = input;

      const user = await ctx.db
        .select()
        .from(users)
        .where(eq(users.email, emailAddress))
        .limit(1);

      if (!user[0] || !(await bcrypt.compare(password, user[0].password))) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const token = await signAuth(user[0].id);

      return {
        success: true,
        token,
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
      };
    }),

  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, ctx.user))
      .limit(1);

    return user[0] ?? null;
  }),
});
