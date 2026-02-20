import { Effect, Stream } from "effect";

import { MockIntakeLive } from "./adapter/mock/intake";
import { Intake } from "./intake";

const program = Effect.gen(function* () {
  const intake = yield* Intake;

  yield* intake.watch().pipe(
    Stream.runForEach((item) =>
      Effect.gen(function* () {
        const isClaimed = yield* intake.claim(item.id);
        yield* Effect.logInfo("claimed?").pipe(Effect.annotateLogs({ isClaimed }));
      }),
    ),
  );
});

Effect.runPromise(Effect.provide(program, MockIntakeLive));
