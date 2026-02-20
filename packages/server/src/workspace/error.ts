import { Data } from "effect";

export class WorkspaceCreationError extends Data.TaggedError("WorkspaceError")<{
  cause: string;
}> {}

export class WorkspaceNotFound extends Data.TaggedError("WorkspaceNotFound")<{
  id: string;
}> {}

export class WorkspaceEditError extends Data.TaggedError("WorkspaceError")<{
  cause: string;
}> {}
