export interface IRule<T> {
    check(claim: T, p: string | symbol): boolean;
    message(p: string | symbol): string[];
}
