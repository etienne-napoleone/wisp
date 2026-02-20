import { Effect, HashMap, Layer, Option, Ref, Stream } from "effect";

import { Dialogue } from "../../dialogue";
import { DialogueMessageNotFound, DialogueWorkspaceNotFound } from "../../dialogue/error";
import type { DialogueMessage } from "../../dialogue/schema";

export const MockDialogueLive = Layer.effect(
  Dialogue,
  Effect.gen(function* () {
    const store = yield* Ref.make(HashMap.empty<string, DialogueMessage[]>());

    return {
      watch: (workspaceId: string) =>
        Stream.unwrap(
          Effect.gen(function* () {
            const ref = yield* Ref.get(store);
            return Option.match(HashMap.get(ref, workspaceId), {
              onNone: () => Stream.fail(new DialogueWorkspaceNotFound({ workspaceId })),
              onSome: (messages) => Stream.fromIterable(messages),
            });
          }),
        ),

      all: (workspaceId: string) =>
        Ref.get(store).pipe(
          Effect.flatMap((ref) =>
            Option.match(HashMap.get(ref, workspaceId), {
              onNone: () => Effect.fail(new DialogueWorkspaceNotFound({ workspaceId })),
              onSome: Effect.succeed,
            }),
          ),
        ),

      post: (workspaceId: string, message: DialogueMessage) =>
        Effect.gen(function* () {
          const ref = yield* Ref.get(store);

          if (Option.isNone(HashMap.get(ref, workspaceId))) {
            return yield* Effect.fail(new DialogueWorkspaceNotFound({ workspaceId }));
          }

          yield* Ref.update(
            store,
            HashMap.modify(workspaceId, (messages) => [...messages, message]),
          );
        }),

      get: (workspaceId: string, messageId: string) =>
        Effect.gen(function* () {
          const ref = yield* Ref.get(store);

          const workspaceMessages = yield* HashMap.get(ref, workspaceId).pipe(
            Option.match({
              onNone: () => Effect.fail(new DialogueWorkspaceNotFound({ workspaceId })),
              onSome: Effect.succeed,
            }),
          );

          const found = workspaceMessages.find((m) => m.id === messageId);
          if (!found) {
            return yield* Effect.fail(new DialogueMessageNotFound({ workspaceId, messageId }));
          }

          return found;
        }),

      ack: (workspaceId: string, messageId: string) =>
        Effect.gen(function* () {
          const ref = yield* Ref.get(store);

          const workspaceMessages = yield* HashMap.get(ref, workspaceId).pipe(
            Option.match({
              onNone: () => Effect.fail(new DialogueWorkspaceNotFound({ workspaceId })),
              onSome: Effect.succeed,
            }),
          );

          if (!workspaceMessages.some((m) => m.id === messageId)) {
            return yield* Effect.fail(new DialogueMessageNotFound({ workspaceId, messageId }));
          }

          yield* Ref.update(
            store,
            HashMap.modify(workspaceId, (messages) =>
              messages.map((m) => (m.id === messageId ? { ...m, acknowledged: true } : m)),
            ),
          );
        }),
    };
  }),
);
