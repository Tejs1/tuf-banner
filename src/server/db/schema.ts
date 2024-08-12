// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  bigint,
  char,
  index,
  int,
  mysqlTable,
  mysqlTableCreator,
  serial,
  text,
  timestamp,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core";
import { uuid } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `tuf-banner_${name}`);

export const banner = createTable("Banner", {
  id: int("id").primaryKey().autoincrement(),
  description: text("description").notNull(),
  link: varchar("link", { length: 2048 }).notNull(),
  timer: tinyint("timer", { unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
});

export const activeBanner = createTable("ActiveBanner", {
  id: int("id").primaryKey().autoincrement(),
  bannerId: int("bannerId")
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
