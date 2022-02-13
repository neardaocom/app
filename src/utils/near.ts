import Decimal from "decimal.js"
import moment from "moment"

import { yoctoNear, TGas } from "@/services/nearService/constants";

export const nearToYocto = (amount: number): string => new Decimal(amount).mul(yoctoNear).toFixed();

export const yoctoToNear = (amount: string): number => new Decimal(amount).div(yoctoNear).toNumber();

export const toTGas = (amount: number): string => Decimal.mul(amount, TGas).toFixed();

export const dateFromChain = (value: number): Date => moment(new Decimal(value).mul(1_000).toNumber()).toDate();

export const dateToChain = (value: Date): number => new Decimal(moment(value).valueOf()).div(1_000).toNumber();