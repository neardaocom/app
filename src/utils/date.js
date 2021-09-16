// typescript
//export const toNanoseconds = (day: number, hour: number, minute: number, second: number): number => {
//    return (((day ?? 0) * 86400) + ((hour ?? 0) * 3600) + ((minute ?? 0) * 60) + (second ?? 0)) * Math.pow(10,9);
//};

export const toNanoseconds = (day, hour, minute, second) => {
    return (((day ?? 0) * 86400) + ((hour ?? 0) * 3600) + ((minute ?? 0) * 60) + (second ?? 0)) * Math.pow(10,9);
}