import { MarketConfig } from "@/config/market";
import axios from "axios"
import get from "lodash/get"

export default class CoinGeckoExchange {
  private config: MarketConfig;

  constructor(config: MarketConfig) {
    this.config = config
  }

  async getActualPrice(id: string): Promise<number | null> {
    let price: number | null = null
    // return 10.5 // TODO: local
    await axios.get(
      this.config.coinGectoUrl,
      {
        params: {
            ids: id,
            vs_currencies: 'usd',
        }
      }
    ).then(response => {
      price = parseFloat(get(response.data, `${id}.usd`, null))
    }).catch(error => {
      throw error
    })

    return price;
  }

}