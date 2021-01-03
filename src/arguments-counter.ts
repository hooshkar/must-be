export function ArgumentsCounter(args: IArguments): number {
    const a = Object.keys(args)
        .map((k) => args[k])
        .filter((v) => v != undefined);
    return a.length;
}
