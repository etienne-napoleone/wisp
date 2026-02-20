import { Context, Effect } from "effect";

import type { IntakeItem } from "../intake/schema";
import type { WorkspaceCreationError, WorkspaceEditError, WorkspaceNotFound } from "./error";
import type { WorkspaceInfo, WorkspaceInfoStatus } from "./schema";

export class Workspace extends Context.Tag("Workspace")<
  Workspace,
  {
    readonly createFor: (intakeItem: IntakeItem) => Effect.Effect<WorkspaceInfo, WorkspaceCreationError>;
    readonly get: (id: string) => Effect.Effect<WorkspaceInfo, WorkspaceNotFound>;
    readonly setStatus: (
      id: string,
      status: WorkspaceInfoStatus,
    ) => Effect.Effect<WorkspaceInfo, WorkspaceNotFound | WorkspaceEditError>;
    readonly setReady: (
      id: string,
      ready: boolean,
    ) => Effect.Effect<WorkspaceInfo, WorkspaceNotFound | WorkspaceEditError>;
    readonly setTitle: (
      id: string,
      title: string,
    ) => Effect.Effect<WorkspaceInfo, WorkspaceNotFound | WorkspaceEditError>;
    readonly setDescription: (
      id: string,
      description: string,
    ) => Effect.Effect<WorkspaceInfo, WorkspaceNotFound | WorkspaceEditError>;
  }
>() {}
