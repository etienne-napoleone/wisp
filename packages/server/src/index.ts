import { Effect, Layer, Stream } from "effect";

import { MockDialogueLive } from "./adapter/mock/dialogue";
import { MockIntakeLive } from "./adapter/mock/intake";
import { MockWorkspaceLive } from "./adapter/mock/workspace";
import { Dialogue } from "./dialogue";
import { Intake } from "./intake";
import { Workspace } from "./workspace";

const program = Effect.gen(function* () {
  const intake = yield* Intake;
  const workspace = yield* Workspace;
  const dialogue = yield* Dialogue;

  yield* intake.watch().pipe(
    Stream.runForEach((item) =>
      Effect.gen(function* () {
        const updatedItem = yield* intake.claim(item.id);
        yield* Effect.logInfo("claimed item").pipe(
          Effect.annotateLogs({ id: updatedItem.id, claimedAt: updatedItem.claimedAt?.toISOString() }),
        );

        const createdWorkspace = yield* workspace.createFor(updatedItem);
        yield* Effect.logInfo("created workspace").pipe(Effect.annotateLogs({ id: createdWorkspace.id }));
        const workspaceInfo = yield* workspace.get(createdWorkspace.id);
        yield* Effect.logWarning("workspace info", workspaceInfo);

        yield* dialogue.post(createdWorkspace.id, {
          id: "test",
          author: { id: "test-user", type: "agent" },
          body: "Workspace discarded",
          acknowledged: false,
        });

        const msgs = yield* dialogue.all(createdWorkspace.id);
        yield* Effect.logInfo("messages").pipe(Effect.annotateLogs({ msgs }));

        yield* dialogue.ack(createdWorkspace.id, "test");
        const msgsAfterAck = yield* dialogue.all(createdWorkspace.id);
        yield* Effect.logInfo("messages").pipe(Effect.annotateLogs({ msgs: msgsAfterAck }));

        const updatedWorkspace = yield* workspace.setStatus(createdWorkspace.id, "discarded");
        yield* Effect.logInfo("discarded workspace").pipe(Effect.annotateLogs({ id: updatedWorkspace.id }));
      }),
    ),
  );
});

Effect.runPromise(Effect.provide(program, Layer.mergeAll(MockIntakeLive, MockDialogueLive, MockWorkspaceLive)));
