import FactoryContractService from "../nearBlockchain/AdminContractService";
import TransformerInterface from "@/models/interfaces/Transformer.interface";
import { ListItemDto } from "./types/admin";
import { DeprecatedError, NotImplementedError } from "../utils/errors";
  
export default class DaoAdmin {
    // factory contract
    private service: FactoryContractService;
  
    constructor(service: FactoryContractService) {
      this.service = service;
    }
  
    /**
     * Get dao list
     * 
     * @returns Promise
     */
    async getDaoList(from: number, limit: number, transformer: TransformerInterface): Promise<ListItemDto[]> {
      const daoList = await this.service.getDaoList(from, limit);
      const list = daoList.map((item: any, index: number) => {
          return transformer.transform(item, {index: index})
      });
      return list
    }
  
    /**
     * Get tags
     * @returns
     */
    async getTags(transformer: TransformerInterface): Promise<string[]> {
      const tagList = await this.service.getTags();
      const list = tagList.map(item => {
          return transformer.transform(item, {})
      });
      return list
    }
  
    /**
     * Get dao info
     * 
     * @returns Promise
     */
    async getDaoInfo(daoId: string) {
      throw new DeprecatedError("DaoInfo from factory is deprecated");
      // return this.service.getDaoInfo(daoId);
    }
  
    /**
     * Get dao stats
     * 
     * @returns Promise
     */
    async getDaoStats() {
      throw new DeprecatedError("DaoStats from factory is deprecated");
      //return this.service.getDaoStats();
    }
  
    /**
     * Get newest version hash of contract
     * 
     * @returns Promise
     */
    async getNewestVersionHash() {
      throw new NotImplementedError("NewestVersion");
      // return this.service.getNewestVersionHash(0); // TODO: Add to version 1.0
    }
}