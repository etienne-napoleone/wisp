import { Schema } from "effect";

export const WorkspaceInfoStatusSchema = Schema.Literal("open", "discarded", "applied");

export type WorkspaceInfoStatus = typeof WorkspaceInfoStatusSchema.Type;

export const WorkspaceInfoSchema = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  status: WorkspaceInfoStatusSchema,
  ready: Schema.Boolean,
  description: Schema.String,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
});

export type WorkspaceInfo = typeof WorkspaceInfoSchema.Type;
