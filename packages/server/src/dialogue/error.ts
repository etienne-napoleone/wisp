import { Data } from "effect";

export class DialogueWorkspaceNotFound extends Data.TaggedError("DialogueWorkspaceNotFound")<{
  workspaceId: string;
}> {}

export class DialogueStreamError extends Data.TaggedError("DialogueStreamError")<{
  workspaceId: string;
  cause: string;
}> {}

export class DialogueMessageNotFound extends Data.TaggedError("DialogueMessageNotFound")<{
  workspaceId: string;
  messageId: string;
}> {}

export class DialogueInvalidMessage extends Data.TaggedError("DialogueInvalidMessage")<{
  workspaceId: string;
  cause: string;
}> {}
