import { Order, OrderItem } from "./types";

export default class OrderBuilder {
    private orders: Order[] = [];

    add(order: Order) {
        this.orders.push(order)
    }

    addNameAsc() {
        this.orders.push({
            code: 'name_asc',
            translateKey: 'most_popular',
            iteratees: ['name'],
            orders: [OrderItem.Asc],
        })
    }

    addNameDesc() {
        this.orders.push({
            code: 'name_asc',
            translateKey: 'most_popular',
            iteratees: ['name'],
            orders: [OrderItem.Desc],
        })
    }

    addMostPopular(iteratees: string[], orders: OrderItem[]) {
        this.orders.push({
            code: 'most_popular',
            translateKey: 'most_popular',
            iteratees: iteratees,
            orders: orders,
        })
    }

    build(): Order[] {
        return this.orders
    }
}