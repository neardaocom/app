
export const getRandom = (min: number, max: number): number =>
    Math.random() * (max - min) + min;