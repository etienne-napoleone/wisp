import { Effect } from "effect";

const program = Effect.logInfo("Hello, World!");

Effect.runSync(program);
