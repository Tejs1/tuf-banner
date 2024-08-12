// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  char,
  int,
  mysqlTableCreator,
  text,
  timestamp,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core";
import * as crypto from "crypto";
/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `tuf-banner_${name}`);

export const banner = createTable("Banner", {
  id: char("id", { length: 36 })
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  description: text("description").notNull(),
  link: varchar("link", { length: 2048 }).notNull(),
  timer: tinyint("timer", { unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
});

export const activeBanner = createTable("ActiveBanner", {
  id: int("id").primaryKey().autoincrement(),
  bannerId: char("bannerId", { length: 36 })
    .notNull()
    .references(() => banner.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
});

export const users = createTable("Users", {
  id: char("id", { length: 36 })
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: text("password").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
});
