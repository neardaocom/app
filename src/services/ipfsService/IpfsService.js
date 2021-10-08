import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'

export class IpfsService{
  apiToken
  storageClient

  constructor(apiToken){
      this.apiToken = apiToken
      this.storageClient = new Web3Storage({ token: apiToken })
  }

  async storeFiles(files, name) {
      const cid = await this.storageClient.put(files , { name: name })
      console.log('stored files with cid:', cid)
      return cid
  }

  async storeWithProgress(files) {  
      // show the root cid as soon as it's ready
      const onRootCidReady = cid => {
        console.log('uploading files with cid:', cid)
      }
    
      // when each chunk is stored, update the percentage complete and display
      const totalSize = files.map(f => f.size).reduce((a, b) => a + b, 0)
      let uploaded = 0
    
      const onStoredChunk = size => {
        uploaded += size
        const pct = totalSize / uploaded
        console.log(`Uploading... ${pct.toFixed(2)}% complete`)
      }
    
      // client.put will invoke our callbacks during the upload
      // and return the root cid when the upload completes
      return this.storageClient.put(files, { onRootCidReady, onStoredChunk })
  }
  
    async retrieveFiles(cid) {
      const res = await this.storageClient.get(cid)
      if (!res.ok) {
        throw new Error(`failed to get ${cid} - [${res.status}] ${res.statusText}`)
      }
      const files = await res.files()
      return files
    }

    async checkStatus(cid) {
      const status = await this.storageClient.status(cid)
      console.log(status)
    }
}