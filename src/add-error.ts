import { ROOT_ERROR_KEY } from './constant';
import { MergeError } from './merge-error';
import { Nested } from './nested';

export function AddError(error: Nested, key: string | number, err: Nested): void {
    if (!error || !err) {
        throw new Error("arguments 'error' and 'err' must not be null or undefined in AddError.");
    }
    if (Array.isArray(error)) {
        throw new Error("the 'error' parameter must not be Array.");
    }
    const exist = error[key ?? ROOT_ERROR_KEY];
    if (Array.isArray(err)) {
        if (err.length == 0) {
            return;
        }
        if (exist) {
            if (Array.isArray(exist)) {
                error[key ?? ROOT_ERROR_KEY] = exist.push(...err);
            } else {
                error[key ?? ROOT_ERROR_KEY] = MergeError(exist, err);
            }
        } else {
            error[key ?? ROOT_ERROR_KEY] = err;
        }
    } else if (Object.keys(err).length > 0) {
        error[key ?? ROOT_ERROR_KEY] = MergeError(exist, err);
    }
}
