import axios from "axios"
// import { ExchangeInterface } from "./Interface"
import get from "lodash/get"

class CoinGeckoExchange {

  async getActualPrice(id: string): Promise<number | null> {
    let price: number | null = null
    await axios.get(
      'https://api.coingecko.com/api/v3/simple/price',
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

export default CoinGeckoExchange