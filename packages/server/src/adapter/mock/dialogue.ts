import { Effect, HashMap, Layer, Option, Ref, Stream } from "effect";

import { Dialogue } from "../../dialogue";
import { DialogueMessageNotFound } from "../../dialogue/error";
import type { DialogueMessage } from "../../dialogue/schema";

export const MockDialogueLive = Layer.effect(
  Dialogue,
  Effect.gen(function* () {
    const store = yield* Ref.make(HashMap.empty<string, DialogueMessage[]>());

    return {
      watch: (workspaceId: string) =>
        Ref.get(store).pipe(
          Effect.map(HashMap.get(workspaceId)),
          Effect.map(Option.getOrElse(() => [])),
          Stream.flatMap(Stream.fromIterable),
        ),

      all: (workspaceId: string) =>
        Ref.get(store).pipe(Effect.map(HashMap.get(workspaceId)), Effect.map(Option.getOrElse(() => []))),

      post: (workspaceId: string, message: DialogueMessage) =>
        Ref.get(store).pipe(
          Effect.map(HashMap.get(workspaceId)),
          Effect.map(Option.getOrElse(() => [])),
          Effect.flatMap((messages) => Ref.update(store, HashMap.set(workspaceId, [...messages, message]))),
        ),

      get: (workspaceId: string, messageId: string) =>
        Ref.get(store).pipe(
          Effect.map(HashMap.get(workspaceId)),
          Effect.map(Option.getOrElse(() => [])),
          Effect.flatMap((messages) => {
            const found = messages.find((m) => m.id === messageId);
            if (!found) {
              return Effect.fail(new DialogueMessageNotFound({ workspaceId, messageId }));
            }
            return Effect.succeed(found);
          }),
        ),

      ack: (workspaceId: string, messageId: string) =>
        Ref.get(store).pipe(
          Effect.map(HashMap.get(workspaceId)),
          Effect.map(Option.getOrElse(() => [])),
          Effect.flatMap((messages) => {
            const found = messages.find((m) => m.id === messageId);
            if (!found) {
              return Effect.fail(new DialogueMessageNotFound({ workspaceId, messageId }));
            }
            return Ref.update(
              store,
              HashMap.modify(workspaceId, (msgs) =>
                msgs.map((m) => (m.id === messageId ? { ...m, acknowledged: true } : m)),
              ),
            );
          }),
        ),
    };
  }),
);
