import { IMap } from './map';

export interface IRule<T> {
    check(claim: unknown, pool: T, property: string, map: IMap): boolean;
    message(name: string): string;
}
