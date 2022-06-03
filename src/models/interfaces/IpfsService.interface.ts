export default interface IpfsService {

    getSourceName(): string

    store(files: File[], name: string): Promise<string>
    
    retrieve(cid: string): Promise<File[]>
}