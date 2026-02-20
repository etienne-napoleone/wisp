import { Effect, HashMap, Layer, Option, Ref } from "effect";

import type { IntakeItem } from "../../intake/schema";
import { Workspace } from "../../workspace";
import { WorkspaceNotFound } from "../../workspace/error";
import type { WorkspaceInfo, WorkspaceInfoStatus } from "../../workspace/schema";

export const MockWorkspaceLive = Layer.effect(
  Workspace,
  Effect.gen(function* () {
    const store = yield* Ref.make(HashMap.empty<string, WorkspaceInfo>());

    return {
      createFor: (intakeItem: IntakeItem) =>
        Effect.gen(function* () {
          const workspaceInfo: WorkspaceInfo = {
            id: intakeItem.id,
            title: intakeItem.title,
            description: intakeItem.description,
            ready: false,
            status: "open",
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          yield* Ref.update(store, HashMap.set(workspaceInfo.id, workspaceInfo));
          return workspaceInfo;
        }),

      get: (id: string) =>
        Effect.gen(function* () {
          const storeRef = yield* Ref.get(store);
          return yield* Option.match(HashMap.get(storeRef, id), {
            onNone: () => Effect.fail(new WorkspaceNotFound({ id })),
            onSome: Effect.succeed,
          });
        }),

      setStatus: (id: string, status: WorkspaceInfoStatus) =>
        Effect.gen(function* () {
          const ref = yield* Ref.get(store);
          if (Option.isNone(HashMap.get(ref, id))) {
            return yield* Effect.fail(new WorkspaceNotFound({ id }));
          }
          return yield* Ref.modify(store, (map) => {
            const updated = { ...HashMap.unsafeGet(map, id), status };
            return [updated, HashMap.set(map, id, updated)] as const;
          });
        }),

      setReady: (id: string, ready: boolean) =>
        Effect.gen(function* () {
          const ref = yield* Ref.get(store);
          if (Option.isNone(HashMap.get(ref, id))) {
            return yield* Effect.fail(new WorkspaceNotFound({ id }));
          }
          return yield* Ref.modify(store, (map) => {
            const updated = { ...HashMap.unsafeGet(map, id), ready };
            return [updated, HashMap.set(map, id, updated)] as const;
          });
        }),

      setTitle: (id: string, title: string) =>
        Effect.gen(function* () {
          const ref = yield* Ref.get(store);
          if (Option.isNone(HashMap.get(ref, id))) {
            return yield* Effect.fail(new WorkspaceNotFound({ id }));
          }
          return yield* Ref.modify(store, (map) => {
            const updated = { ...HashMap.unsafeGet(map, id), title };
            return [updated, HashMap.set(map, id, updated)] as const;
          });
        }),

      setDescription: (id: string, description: string) =>
        Effect.gen(function* () {
          const ref = yield* Ref.get(store);
          if (Option.isNone(HashMap.get(ref, id))) {
            return yield* Effect.fail(new WorkspaceNotFound({ id }));
          }
          return yield* Ref.modify(store, (map) => {
            const updated = { ...HashMap.unsafeGet(map, id), description };
            return [updated, HashMap.set(map, id, updated)] as const;
          });
        }),
    };
  }),
);
