export function AddError(error: unknown, key: string | number, err: unknown): void {
    if (Object.keys(err).length > 0) {
        error[key] = err;
    }
}
