import DaoResource from "@/models/dao/DaoResource"
import { DAO } from "@/models/dao/types/dao"
import { DAODocsFile, DAODocsFileType } from "@/models/dao/types/docs"
import IpfsService from "@/models/interfaces/IpfsService.interface"
import { computed, ref, Ref } from "vue"
import loFind from 'lodash/find'

export const useResource = (ipfsService: Ref<IpfsService> , dao: Ref<DAO>) => {
    const daoResource = ref(new DaoResource(ipfsService.value))
    const files = computed(() => (daoResource.value.list(dao.value.docs)))

    return {
        daoResource, files
    }
}

export const useResourceOpening = (ipfsService: Ref<IpfsService>, dao: Ref<DAO>) => {
    
    const daoResource = ref(new DaoResource(ipfsService.value))

    const fileLoading = ref(false)
    const selectedDoc = ref({})
    const docData = ref<string|undefined>(undefined)
    const modalDocument = ref(0)

    const open = async (resource: number|DAODocsFile) => {
        fileLoading.value = true

        let doc: DAODocsFile|undefined
        if(typeof resource === 'number'){
            doc = loFind(dao.value.docs.files, { id: resource})
        }else{
            doc = resource
        }
        
        if(doc !== undefined) {
            daoResource.value.fetch(doc).then(r => {
            console.log(r, doc?.type);
            switch (doc?.type) {
                case DAODocsFileType.url: {
                fileLoading.value = false
                window.open(r, "_blank");
                break;
                }
                case DAODocsFileType.plain: 
                case DAODocsFileType.binaryPdf:
                case DAODocsFileType.html: {
                    selectedDoc.value = doc;
                    docData.value = r
                    fileLoading.value = false
                    modalDocument.value += 1;
                }
                break;
                default:
                fileLoading.value = false
                console.log('Undefined doc.type: ' + doc?.type);
            }
            })
        }
    }
    return {
        fileLoading, selectedDoc, docData, modalDocument, open
    }

}