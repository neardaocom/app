import { Order } from "./types";

export default class OrderBuilder {
    private orders: Order[] = [];

    add(order: Order) {
        this.orders.push(order)
    }

    addNameAsc() {
        this.orders.push({
            code: 'name_asc',
            translateKey: 'default.most_popular',
            iteratees: ['name'],
            orders: ['asc'],
        })
    }

    addNameDesc() {
        this.orders.push({
            code: 'name_asc',
            translateKey: 'default.most_popular',
            iteratees: ['name'],
            orders: ['desc'],
        })
    }

    addMostPopular(iteratees: string[], orders: string[]) {
        this.orders.push({
            code: 'most_popular',
            translateKey: 'default.most_popular',
            iteratees: iteratees,
            orders: orders,
        })
    }

    build(): Order[] {
        return this.orders
    }
}