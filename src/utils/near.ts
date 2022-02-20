import Decimal from "decimal.js"
import moment from "moment"

import { yoctoNear, TGas } from "@/services/nearService/constants";
import { Interval } from "@/types/generics";
import { assertDecimalLiteral } from "@babel/types";

export const nearToYocto = (amount: number): string => new Decimal(amount).mul(yoctoNear).toFixed();

export const yoctoToNear = (amount: string): number => new Decimal(amount).div(yoctoNear).toNumber();

export const toTGas = (amount: number): string => Decimal.mul(amount, TGas).toFixed();

export const dateFromChain = (value: number): Date => moment(new Decimal(value).mul(1_000).toNumber()).toDate();

export const dateToChain = (value: Date): number => new Decimal(moment(value).valueOf()).div(1_000).toNumber();

export const durationFromChain = (value: number): Interval => { 
    const interval: Interval = {}
    let amount: number = value
    let amountMod: number = 0
    // days
    amountMod = new Decimal(amount).mod(86400).toNumber()
    interval.days = new Decimal(amount - amountMod).div(86400).toNumber()
    amount = amountMod
    // hours
    amountMod = new Decimal(amount).mod(3600).toNumber()
    interval.hours = new Decimal(amount - amountMod).div(3600).toNumber()
    amount = amountMod
    // minutes
    amountMod = new Decimal(amount).mod(60).toNumber()
    interval.hours = new Decimal(amount - amountMod).div(60).toNumber()
    amount = amountMod

    return interval
};

export const durationToChain = (duration: Interval): number => ((duration.days ?? 0) * 86400) + ((duration.hours ?? 0) * 3600) + ((duration.minutes ?? 0) * 60);