// import logger from "@/logger";
import IpfsService from "@/models/services/ipfs/Web3StorageService";
import IpfsUtils from "@/models/services/ipfs/IpfsUtils"

export const storeText = async (text: string, name: string, service: IpfsService): Promise<string | undefined> => {
    try {
        const ipfsCid = await service.store(IpfsUtils.makeFileFromString(text, name), name)
        return ipfsCid
      } catch(e){
        // this.$logger.error('D', 'app@components/dao/ModalAddCouncil', 'StoreFile-ipfs', 'File saving to ipfs failed')
        // this.$logger.error('B', 'app@components/dao/ModalAddCouncil', 'StoreFile-ipfs', 'File saving to ipfs failed')
        // this.$notify.danger(this.t('default.notify_save_file_ipfs_fail_title'), this.t('default.notify_ipfs_fail') + " " + this.t('default.notify_save_file_ipfs_fail_message'))
        // this.$notify.flush()
        console.log(e);
        return 
      }

}