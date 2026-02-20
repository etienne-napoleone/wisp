import { Context, Effect, Stream } from "effect";

import type { DialogueInvalidMessage, DialogueMessageNotFound, DialogueStreamError } from "./error";
import type { DialogueMessage } from "./schema";

export class Dialogue extends Context.Tag("Dialogue")<
  Dialogue,
  {
    readonly watch: (workspaceId: string) => Stream.Stream<DialogueMessage, DialogueStreamError>;
    readonly all: (workspaceId: string) => Effect.Effect<DialogueMessage[]>;
    readonly post: (workspaceId: string, message: DialogueMessage) => Effect.Effect<void, DialogueInvalidMessage>;
    readonly get: (workspaceId: string, messageId: string) => Effect.Effect<DialogueMessage, DialogueMessageNotFound>;
    readonly ack: (workspaceId: string, messageId: string) => Effect.Effect<void, DialogueMessageNotFound>;
  }
>() {}
