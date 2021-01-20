import { IMap } from './map';

export interface IRule<T> {
    check(claim: T, map: IMap): boolean;
    message(name: string): string;
}
