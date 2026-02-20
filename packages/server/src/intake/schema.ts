import { Schema } from "effect";

export const IntakeItemSchema = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  description: Schema.String,
  author: Schema.String,
});

export type IntakeItem = typeof IntakeItemSchema.Type;
