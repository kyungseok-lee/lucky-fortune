import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const fortunes = pgTable("fortunes", {
  id: serial("id").primaryKey(),
  birthDate: text("birth_date").notNull(),
  fortuneDate: text("fortune_date").notNull(),
  overallFortune: text("overall_fortune").notNull(),
  loveFortune: text("love_fortune").notNull(),
  careerFortune: text("career_fortune").notNull(),
  moneyFortune: text("money_fortune").notNull(),
  healthFortune: text("health_fortune").notNull(),
  luckyNumber: integer("lucky_number").notNull(),
  luckyColor: text("lucky_color").notNull(),
  luckyDirection: text("lucky_direction").notNull(),
  todayAdvice: text("today_advice").notNull(),
  warningAdvice: text("warning_advice").notNull(),
  overallScore: integer("overall_score").notNull(),
  loveScore: integer("love_score").notNull(),
  careerScore: integer("career_score").notNull(),
  moneyScore: integer("money_score").notNull(),
  healthScore: integer("health_score").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFortuneSchema = createInsertSchema(fortunes).omit({
  id: true,
  createdAt: true,
});

export const birthDateSchema = z.object({
  year: z.number().min(1900).max(2024),
  month: z.number().min(1).max(12),
  day: z.number().min(1).max(31),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFortune = z.infer<typeof insertFortuneSchema>;
export type Fortune = typeof fortunes.$inferSelect;
export type BirthDate = z.infer<typeof birthDateSchema>;
