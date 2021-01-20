import { Error } from './error';

export type CheckResult = {
    pass: boolean;
    errors: Error;
};
