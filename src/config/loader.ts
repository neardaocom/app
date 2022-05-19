import { Item } from "@/loader";
export type AppConfig = {
    daoDefault: string;
}

export const loader = async (item: Item): Promise<Object> => {
    const module = await import(item.path)

    return new module()
}

export const getConfig = (env: string): Item[] => {
    return [
        {
            key: { key: 'nearAccount' },
            path: '@/models/nearBlockchain/DaoContractService.ts',
            constructor: true,
            constructorParams: [
                
            ],
        },
        {
            key: { key: 'nearBlockchain' },
            path: '@/models/nearBlockchain/DaoContractService.ts',
            constructor: true,
            constructorParams: [
                { ref: 'nearAccount' }
            ],
        },
    ];
};