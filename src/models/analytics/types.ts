
export enum Period {
    Day = 'day',
    Week = 'week',
    Month = 'month',
    Quarter = 'quearter',
    Year = 'year',
}

export enum Algorithm {
    None = 'none',
    Linear = 'linear',
}

export type ProgressItem = {
    date: Date;
    value: number | null;
}

export type Chart = Record<string, unknown>;