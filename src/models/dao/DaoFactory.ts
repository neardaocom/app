import FactoryContractService from "../nearBlockchain/FactoryContractService";
import TransformerInterface from "@/models/interfaces/Transformer.interface";
import { ListItemDto } from "./types/factory";
  
export default class DaoFactory {
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
      return this.service.getDaoInfo(daoId);
    }
  
    /**
     * Get dao stats
     * 
     * @returns Promise
     */
    async getDaoStats() {
      return this.service.getDaoStats();
    }
  
    /**
     * Get newest version hash of contract
     * 
     * @returns Promise
     */
    async getNewestVersionHash() {
      return this.service.getNewestVersionHash(0);
    }
}