import { Context, Effect, Stream } from "effect";

import type {
  DialogueInvalidMessage,
  DialogueMessageNotFound,
  DialogueStreamError,
  DialogueWorkspaceNotFound,
} from "./error";
import type { DialogueMessage } from "./schema";

export class Dialogue extends Context.Tag("Dialogue")<
  Dialogue,
  {
    readonly watch: (
      workspaceId: string,
    ) => Stream.Stream<DialogueMessage, DialogueWorkspaceNotFound | DialogueStreamError>;

    readonly all: (workspaceId: string) => Effect.Effect<DialogueMessage[], DialogueWorkspaceNotFound>;

    readonly post: (
      workspaceId: string,
      message: DialogueMessage,
    ) => Effect.Effect<void, DialogueWorkspaceNotFound | DialogueInvalidMessage>;

    readonly get: (
      workspaceId: string,
      messageId: string,
    ) => Effect.Effect<DialogueMessage, DialogueWorkspaceNotFound | DialogueMessageNotFound>;

    readonly ack: (
      workspaceId: string,
      messageId: string,
    ) => Effect.Effect<void, DialogueWorkspaceNotFound | DialogueMessageNotFound>;
  }
>() {}
