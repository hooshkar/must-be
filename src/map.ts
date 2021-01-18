import { ClassType } from './class-type';

export interface IMap<T = unknown> {
    key?: string;
    default?: T;
    nested?: {
        mode: 'object' | 'array';
        type: ClassType;
    };
    strict?: boolean;
}
