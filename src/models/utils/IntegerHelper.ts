export default class IntegerHelper {
    
    static getRandom(min: number, max: number): number {
        const minInt = Math.ceil(min);
        const maxInt = Math.floor(max);
    
        return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
    }
}
