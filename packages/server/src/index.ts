import { Effect, Layer, Stream } from "effect";

import { MockIntakeLive } from "./adapter/mock/intake";
import { MockWorkspaceLive } from "./adapter/mock/workspace";
import { Intake } from "./intake";
import { Workspace } from "./workspace";

const program = Effect.gen(function* () {
  const intake = yield* Intake;
  const workspace = yield* Workspace;

  yield* intake.watch().pipe(
    Stream.runForEach((item) =>
      Effect.gen(function* () {
        const updatedItem = yield* intake.claim(item.id);
        yield* Effect.logInfo("claimed item").pipe(
          Effect.annotateLogs({ id: updatedItem.id, claimedAt: updatedItem.claimedAt?.toISOString() }),
        );

        const createdWorkspace = yield* workspace.createFor(updatedItem);
        yield* Effect.logInfo("created workspace").pipe(Effect.annotateLogs({ id: createdWorkspace.id }));

        const updatedWorkspace = yield* workspace.setStatus(createdWorkspace.id, "discarded");
        yield* Effect.logInfo("discarded workspace").pipe(Effect.annotateLogs({ id: updatedWorkspace.id }));
      }),
    ),
  );
});

Effect.runPromise(Effect.provide(program, Layer.mergeAll(MockIntakeLive, MockWorkspaceLive)));
