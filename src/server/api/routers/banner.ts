import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { banner, activeBanner } from "@/server/db/schema";
import { eq } from "drizzle-orm/mysql-core/expressions";

export const bannerRouter = createTRPCRouter({
  getBanner: publicProcedure.query(async ({ ctx }) => {
    const active = await ctx.db
      .select()
      .from(activeBanner)
      .leftJoin(banner, eq(activeBanner.bannerId, banner.id));
    return active;
  }),
  updateBanner: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        description: z.string(),
        link: z.string().url(),
        timer: z.number().min(0).max(255),
        isVisible: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Update the banner details
      await ctx.db
        .update(banner)
        .set({
          description: input.description,
          link: input.link,
          timer: input.timer,
        })
        .where(eq(banner.id, input.id))
        .execute();

      if (input.isVisible) {
        // eslint-disable-next-line drizzle/enforce-delete-with-where
        await ctx.db.delete(activeBanner).execute();

        // Set the current banner as active
        await ctx.db
          .insert(activeBanner)
          .values({
            bannerId: input.id,
          })
          .execute();
      }
    }),
});
