import IpfsService from '@/models/interfaces/IpfsService.interface'
import { NotFoundError } from '@/models/utils/errors'
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'

export default class Web3StorageService implements IpfsService {

  protected storageClient: Web3Storage

  constructor(apiToken: string) {
    this.storageClient = new Web3Storage({ token: apiToken })
  }

  getSourceName(): string {
    return 'web3.storage'
  }

  async store(files: File[], name: string): Promise<string> {
    const cid = await this.storageClient.put(files, { name })
    return cid
  }

  async retrieve(cid: string): Promise<File[]> {
    const res = await this.storageClient.get(cid)
    if (!res.ok) {
      throw new NotFoundError(`Failed to get CID[${cid}][${res.status}] ${res.statusText}`)
    }
    const files = await res.files()
    return files
  }


  async checkStatus(cid: string) {
    const status = await this.storageClient.status(cid)
    console.log(status)
    return status
  }


  async storeWithProgress(files: File[], name: string): Promise<string> {
    // show the root cid as soon as it's ready
    const onRootCidReady = (cid) => {
      console.log('uploading files with cid:', cid)
    }

    // when each chunk is stored, update the percentage complete and display
    const totalSize = files.map((f) => f.size).reduce((a, b) => a + b, 0)
    let uploaded = 0

    const onStoredChunk = (size: number) => {
      uploaded += size
      const pct = totalSize / uploaded
      console.log(`Uploading... ${pct.toFixed(2)}% complete`)
    }

    // client.put will invoke our callbacks during the upload
    // and return the root cid when the upload completes
    return this.storageClient.put(files, { name, onRootCidReady, onStoredChunk })
  }
}