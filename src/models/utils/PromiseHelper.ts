export default class PromiseHelper {

    static createPromiseTimeout(data: any, timeout: number = 1): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
              setTimeout(() => {
                resolve(data);
              }, timeout || 1);
            } catch(e) {
              reject(`Error during setup: ${e}`);
            }
          }
        )
    }
}