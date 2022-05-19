import DaoFromFactoryTransformer from "@/models/dao/transformers/DaoFromFactoryTransformer";
import TagFromFactoryTransformer from "@/models/dao/transformers/TagFromFactoryTransformer";
import { ListItemDto } from "./types/factory";
import Near from "./Near";
import DaoFactory from "./DaoFactory";
import Decimal from "decimal.js";

export default class DaoList {
  private near: Near;
  private daoFactory: DaoFactory;
  private t: Function;
  private n: Function;

  private list: ListItemDto[];

  constructor(daoFactory: DaoFactory, near: Near, t: Function, n: Function) {
    this.daoFactory = daoFactory
    this.near = near
    this.list = []
    this.t = t
    this.n = n
  }

  async load(from: number, limit: number, factoryAccount: string, nearPrice: number) {

    const tagTransformer = new TagFromFactoryTransformer(this.t)
    const tags = await this.daoFactory.getTags(tagTransformer)

    const daoTransformer = new DaoFromFactoryTransformer(this.t, this.n, tags)
    const list = await this.daoFactory.getDaoList(from, limit, daoTransformer)

    // load treasury
    const wallets = await this.near.getAccountsAmount(list.map((item) => item.id + '.' + factoryAccount))
    
    // console.log(wallets)
    list.forEach((element, index) => {
      element.treasuryAmount = new Decimal(wallets[index]).toFixed(2)
      if (nearPrice !== undefined) {
        element.treasuryAmountUsd = new Decimal(wallets[index]).times(nearPrice).toFixed(2)
      }
    });

    this.list = list
  }

  getList() {
    return this.list
  }
}