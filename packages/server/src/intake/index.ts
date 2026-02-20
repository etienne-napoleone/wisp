import { Context, Effect, Stream } from "effect";

import type { IntakeItemAlreadyClaimed, IntakeItemNotFound, IntakeItemUnclaimed, IntakeStreamError } from "./error";
import type { IntakeItem } from "./schema";

export class Intake extends Context.Tag("Intake")<
  Intake,
  {
    readonly watch: () => Stream.Stream<IntakeItem, IntakeStreamError>;
    readonly get: (id: string) => Effect.Effect<IntakeItem, IntakeItemNotFound>;
    readonly claim: (id: string) => Effect.Effect<boolean, IntakeItemNotFound | IntakeItemAlreadyClaimed>;
    readonly release: (id: string) => Effect.Effect<boolean, IntakeItemNotFound | IntakeItemUnclaimed>;
  }
>() {}
