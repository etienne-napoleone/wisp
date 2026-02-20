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
            onSome: (value) => Effect.succeed(value),
          });
        }),

      setStatus: (id: string, status: WorkspaceInfoStatus) =>
        Effect.gen(function* () {
          const result = yield* Ref.modify(store, (map) => {
            const newMap = HashMap.modify(map, id, (info) => ({ ...info, status }));
            return [HashMap.get(newMap, id), newMap] as const;
          });
          return yield* Option.match(result, {
            onNone: () => Effect.fail(new WorkspaceNotFound({ id })),
            onSome: (value) => Effect.succeed(value),
          });
        }),

      setReady: (id: string, ready: boolean) =>
        Effect.gen(function* () {
          const result = yield* Ref.modify(store, (map) => {
            const newMap = HashMap.modify(map, id, (info) => ({ ...info, ready }));
            return [HashMap.get(newMap, id), newMap] as const;
          });
          return yield* Option.match(result, {
            onNone: () => Effect.fail(new WorkspaceNotFound({ id })),
            onSome: (value) => Effect.succeed(value),
          });
        }),

      setTitle: (id: string, title: string) =>
        Effect.gen(function* () {
          const result = yield* Ref.modify(store, (map) => {
            const newMap = HashMap.modify(map, id, (info) => ({ ...info, title }));
            return [HashMap.get(newMap, id), newMap] as const;
          });
          return yield* Option.match(result, {
            onNone: () => Effect.fail(new WorkspaceNotFound({ id })),
            onSome: (value) => Effect.succeed(value),
          });
        }),

      setDescription: (id: string, description: string) =>
        Effect.gen(function* () {
          const result = yield* Ref.modify(store, (map) => {
            const newMap = HashMap.modify(map, id, (info) => ({ ...info, description }));
            return [HashMap.get(newMap, id), newMap] as const;
          });
          return yield* Option.match(result, {
            onNone: () => Effect.fail(new WorkspaceNotFound({ id })),
            onSome: (value) => Effect.succeed(value),
          });
        }),
    };
  }),
);
