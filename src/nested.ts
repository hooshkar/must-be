export type Nested = { [key: string]: Nested | string[] } | { [key: number]: Nested | string[] } | string[];
