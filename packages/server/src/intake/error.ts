import { Data } from "effect";

export class IntakeStreamError extends Data.TaggedError("IntakeStreamError")<{
  cause: string;
}> {}

export class IntakeItemNotFound extends Data.TaggedError("IntakeItemNotFound")<{
  cause: string;
}> {}

export class IntakeItemAlreadyClaimed extends Data.TaggedError("IntakeItemAlreadyClaimed")<{
  cause: string;
}> {}

export class IntakeItemUnclaimed extends Data.TaggedError("IntakeItemAlreadyClaimed")<{
  cause: string;
}> {}
