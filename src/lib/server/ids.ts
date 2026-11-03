import { isValidObjectId } from "mongoose";

import { NotFoundError } from "./utils/errors";

/**
 * A malformed id otherwise reaches Mongoose and surfaces as a CastError, which
 * would be reported as a 500 for what is really a missing resource.
 */
export const requireObjectId = (value: unknown, message: string): string => {
  if (typeof value !== "string" || !isValidObjectId(value)) {
    throw new NotFoundError(message);
  }

  return value;
};
