import { Error } from './error';

export type MakeResult<T> = { made: T; pass: boolean; errors: Error };
