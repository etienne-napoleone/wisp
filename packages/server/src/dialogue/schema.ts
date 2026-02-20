import { Schema } from "effect";

export const DialogueMessageAuthorSchema = Schema.Struct({
  id: Schema.String,
  type: Schema.Literal("user", "agent", "system"),
});

export type DialogueMessageAuthor = typeof DialogueMessageAuthorSchema.Type;

export const DialogueMessageSchema = Schema.Struct({
  id: Schema.String,
  author: DialogueMessageAuthorSchema,
  body: Schema.String,
  acknowledged: Schema.Boolean,
});

export type DialogueMessage = typeof DialogueMessageSchema.Type;
