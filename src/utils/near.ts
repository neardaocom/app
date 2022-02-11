import Decimal from "decimal.js";
import { yoctoNear, TGas } from "@/services/nearService/constants";

export const nearToYocto = (amount: number): string => new Decimal(amount).mul(yoctoNear).toFixed();
export const yoctoToNear = (amount: string): number => new Decimal(amount).div(yoctoNear).toNumber();
export const toTGas = (amount: number): string => Decimal.mul(amount, TGas).toFixed();