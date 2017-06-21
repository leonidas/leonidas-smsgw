import * as jsonschema from 'jsonschema';
import * as Koa from 'koa';

import Logger from '../services/Logger';


export class ValidationError extends TypeError {
  public readonly result: jsonschema.ValidatorResult;

  constructor(result: jsonschema.ValidatorResult) {
    super(result.errors[0].message);
    this.result = result;

    // tslint:disable-next-line:max-line-length
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}


/**
 * Validates an object against a given schema. If the validation fails, @ValidationError is raised.
 * This error in turn is handled by @validationMiddleware and turned into a schmancy JSON error message.
 *
 * @param obj The object to validate
 * @param schema The schema to validate against
 */
// tslint:disable-next-line:no-any
export function validate(obj: any, schema: jsonschema.Schema): jsonschema.ValidatorResult {
  const result = jsonschema.validate(obj, schema);

  if (!result.valid) {
    throw new ValidationError(result);
  }

  return result;
}


export default async function validationMiddleware(ctx: Koa.Context, next: () => Promise<void>) {
  try {
    await next();
  } catch (err) {
    if (err instanceof ValidationError) {
      Logger.warn('Validation failed:', err.message);
      ctx.status = 400;
      ctx.body = { message: err.message };
    } else {
      throw err;
    }
  }
}
