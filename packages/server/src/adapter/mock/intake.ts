import { Effect, Layer, Stream } from "effect";

import { Intake } from "../../intake";
import type { IntakeItem } from "../../intake/schema";

const item: IntakeItem = {
  id: "1",
  title: "Missing price in USD",
  description: "Missing USD price in source price stream since last update",
  author: "etienne-napoleone",
  claimedAt: undefined,
};

export const MockIntakeLive = Layer.effect(
  Intake,
  Effect.gen(function* () {
    return {
      watch: () => Stream.make(item),
      get: (_id: string) => Effect.succeed(item),
      claim: (_id: string) => Effect.succeed({ ...item, claimedAt: new Date() }),
      release: (_id: string) => Effect.succeed({ ...item, claimedAt: undefined }),
    };
  }),
);
