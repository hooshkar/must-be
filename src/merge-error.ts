import { Nested } from './nested';

export function MergeError<T extends Nested>(error: T, err: Nested): T {
    if (!err) {
        throw new Error("The parameter 'err' is required.");
    }
    if (!error) {
        error = <T>err;
        return error;
    }
    if (Array.isArray(err)) {
        if (Array.isArray(error)) {
            (<string[]>error).push(...err);
            return error;
        } else {
            throw new Error(`Can not set error '${err}' to previews error '${error}'.`);
        }
    }
    if (Array.isArray(error)) {
        throw new Error(`Can not set error '${err}' to previews error '${error}'.`);
    }
    for (const key in err) {
        let error_ = error[key];
        const err_ = err[key];
        error_ = MergeError(error_, err_);
        error[key] = error_;
    }
    return error;
}
