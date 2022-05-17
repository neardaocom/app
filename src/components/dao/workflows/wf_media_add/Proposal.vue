<template>
    <div class="row">
        <div class="col-12 col-lg-6 mb-4">
            <Autocomplete :labelName="t('default.name')" id="fileName" :options="nameOptions" :filtredBy="filterFormName" :valueDisplayed="nameValueDisplayed" :itemContent="nameItemTemplate"/>
        </div>
        <div class="col-12 col-lg-6 mb-4">
            <Autocomplete :labelName="t('default.category')" id="fileCategory" :options="categoryOptions"/>
        </div>
    </div>    
    <div class="row">
        <div class="col-12 mt-1 mb-4">
          <MDBSwitch :disabled="isNewFile" :label="(formVersionUpgrageMajor) ? t('default.upgrade_version', {version: getNewVersion}) : t('default.update_version', {version: getNewVersion})" v-model="formVersionUpgrageMajor"/>
        </div>
    </div>
    <div class="row">
        <div class="col-12 mb-4">
            <InputString :labelName="t('default.description')" id="description"/>
        </div>
    </div>

    <label for="add-document-input" class="form-label mt-2">{{ t('default.document') }}</label>

    <!-- <MDBAlert color="danger" static v-if="formDocumentType == 'flush-pdf' && errors.formFiles != null">{{ errors.formFiles }}</MDBAlert>
    <MDBAlert color="danger" static v-if="formDocumentType == 'flush-url' && errors.formUrl != null">{{ errors.formUrl }}</MDBAlert>
    <MDBAlert color="danger" static v-if="formDocumentType == 'flush-html' && errors.formHtml != null">{{ errors.formHtml }}</MDBAlert> -->

    <MDBAccordion v-model="formDocumentType" flush fluid class="mx-4">
        <MDBAccordionItem :headerTitle="documentTypeDropdown.plain" collapseId="flush-plain" :class="[formDocumentType === 'flush-plain' ? 'accordition-plain-open' : '']">
            <InputString :labelName="t('default.text')" id="plain"/>
        </MDBAccordionItem>

        <MDBAccordionItem :headerTitle="documentTypeDropdown.link" collapseId="flush-url" :class="[formDocumentType === 'flush-url' ? 'accordition-url-open' : '']">
            <InputString :labelName="t('default.url')" id="url"/>
            <div class="col-auto">
                <span id="add-document-url-input-text" class="form-text"> {{ t('default.url_format') }} </span>
            </div>
        </MDBAccordionItem>

        <MDBAccordionItem :headerTitle="documentTypeDropdown.pdf" collapseId="flush-pdf" :class="[formDocumentType === 'flush-pdf' ? 'accordition-pdf-open' : '']">
            <MDBFileUpload @change="handleUpload" @remove="handleUpload" accept="application/pdf" :maxFilesQuantity="1" :maxFileSize="10"
                :defaultMsg="fileUploadMsg.defautlMessage" :maxSizeError="fileUploadMsg.maxSizeError" :previewMsg="fileUploadMsg.previewMsg"
                :removeBtn="fileUploadMsg.removeBtn"
            />
        </MDBAccordionItem>

        <MDBAccordionItem :headerTitle="documentTypeDropdown.editor" collapseId="flush-html">
            <MDBWysiwyg :fixedOffsetTop="58" ref="refWysiwyg">
                <section v-html="formHtml"></section>
            </MDBWysiwyg>
        </MDBAccordionItem>

    </MDBAccordion>
</template>

<script>
import InputString from '@/components/forms/InputString.vue'
import Autocomplete from '@/components/forms/Autocomplete.vue'
import { toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { computed, ref } from '@vue/reactivity';
import { useForm } from 'vee-validate';
import { getIndexInFiles, getCategories, getNamesOptions } from "@/models/document"
import { makeFileFromString } from "@/models/services/ipfsService/IpfsService.js"
import VersionHelper from '@/models/utils/VersionHelper'
import {
    MDBSwitch,
    MDBAccordion, 
    MDBAccordionItem,
//   MDBAlert
} from "mdb-vue-ui-kit";
import { MDBFileUpload } from "mdb-vue-file-upload";
import { MDBWysiwyg } from "mdb-vue-wysiwyg-editor";
import { useIPFS, useNear } from '@/hooks/vuex';
import moment from 'moment';


export default {
    components:{
        Autocomplete,
        MDBSwitch,
        InputString,
        MDBAccordion, 
        MDBAccordionItem,
        MDBFileUpload,
        MDBWysiwyg
    },
    props:{
        contractId: {
            type: String,
            required: false
        },
        docs: {
            type: Object,
            required: false
        },
        template: {
            type: Object,
            required: false
        }
    },
    setup (props) {
        const { t } = useI18n()
        const { contractId, docs, template } = toRefs(props)
        const { nearService } = useNear()  
        const { ipfsService }= useIPFS()

        console.log(docs.value);
        //const files = transform(docs.value)
        //const files = transform({categories: [], files: [], tags: []})
        //console.log(files);
        // const nameOptions = ref(files.map(item => { return { title: item.name, category: item.category, version: item.version }}))
        const nameOptions = ref(getNamesOptions(docs.value, t))
        const categoryOptions = ref(getCategories(docs.value, t));

        const refWysiwyg = ref(null)
        const formHtml = ref('')


        const filterFormName = value => {
            return nameOptions.value.filter(item => {
                return item.title.toLowerCase().startsWith(value.toLowerCase());
            });
            
            // return nameOptions
        };
        const nameValueDisplayed = value => value.title;
        const nameItemTemplate = result => {
            return `
            <div class="autocomplete-custom-item-content">
                <div class="autocomplete-custom-item-title">${result.title}</div>
                <div class="autocomplete-custom-item-category">${result.category} | v${result.version}</div>
            </div>
            `;
        };

        const uploadFiles = ref([])
        const handleUpload = (files) => {
            uploadFiles.value = files
        }

        //form validation
        const schema = computed(() => {
            return {
                fileName: 'required|min:3,max:80',
                fileCategory: 'required|min:3,max:80',
                description: 'min:0, max:160',
                url: 'url',
                plain: '',
            }
        });
        const { values, handleSubmit, errors } = useForm({ validationSchema: schema});



        const getExt = () => {
            return formDocumentType.value.replace('flush-', '')
        }
        const getFullname = () => {
            return values.fileName + '.' + getExt()
        }

        const getIpfsData = () => {
            let ipfsData = null
            switch (formDocumentType.value) {
                case 'flush-pdf':
                    ipfsData = uploadFiles.value
                    break;
                case 'flush-url':
                    ipfsData = makeFileFromString(values.url, getFullname())
                    break;
                case 'flush-html':
                    ipfsData = makeFileFromString(refWysiwyg.value.getCode(), getFullname())
                    break;
                case 'flush-plain':
                    ipfsData = makeFileFromString(values.plain, getFullname())
                    break;
                default:
                    break;
            }
            return ipfsData
        }

        const getMediaType = (ipfsCidDocument) => {
            let mediaType = ''
            switch (formDocumentType.value) {
                case 'flush-pdf':
                    mediaType = {
                        CID: {
                        ipfs: "web3.storage",
                        cid: ipfsCidDocument,
                        mimetype: "application/pdf"
                        }
                    }
                    break;
                case 'flush-url':
                    mediaType = {"Link": values.url}
                    break;
                case 'flush-html':
                    mediaType = {
                        CID: {
                        ipfs: "web3.storage",
                        cid: ipfsCidDocument,
                        mimetype: "text/html"
                        }
                    }
                    break;
                case 'flush-plain':
                    mediaType = {"Text": values.plain }
                    break;
                default:
                    break;
            }
            return mediaType
        }


        //switch
        const getIndexOfFile = computed(() => (getIndexInFiles(docs.value, values.fileName, values.formCategory))) 
        const isNewFile = computed(() => (getIndexOfFile.value == -1 )) 
        const formVersionUpgrageMajor = ref(true)
        const getVersionOfFile = computed(() => ((getIndexOfFile.value) ? docs.value[getIndexOfFile.value].version : undefined)) 
        const getNewVersion = computed(() => {
            let version = '1.0'
            if (isNewFile.value === false) {
                if (formVersionUpgrageMajor.value === true) {
                version = VersionHelper.majorUp(getVersionOfFile.value)
                } else {
                version = VersionHelper.minorUp(getVersionOfFile.value)
                }
            }
            return version
        })

        //document
        const formDocumentType = ref('')

        const documentTypeDropdown = computed(() => ({
            plain: t('default.plain_text'),
            link: t('default.link'),
            pdf: t('default.pdf'),
            editor: t('default.document'),
        }))
        const fileUploadMsg = computed(() => ({
            defautlMessage: t('default.file_upload_default_msg'),
            mainError: t('default.file_upload_main_error'),
            maxSizeError: t('default.file_upload_max_size_error'),
            previewMsg: t('default.file_upload_preview_msg'),
            removeBtn: t('default.file_upload_remove_btn')
        }))

        
        
        const onSubmit = handleSubmit( async values => {

            const ipfsPromises = []
            const ipfsSet = [false,false]

            if(values.description){
                const name = `${contractId.value}-wf_media_add-proposal-desc-${moment().valueOf()}`
                ipfsPromises.push(ipfsService.value.storeFiles(makeFileFromString(values.description, name), name))
                ipfsSet[0] = true
            }
            
            if (formDocumentType.value == 'flush-pdf' || formDocumentType.value == 'flush-html'){
                ipfsPromises.push(ipfsService.value.storeFiles(getIpfsData(), values.fileName))
                ipfsSet[1] = true
            }

            const ipfsCids = await Promise.all(    
                ipfsPromises
            ).catch((e) => {
                // logger.error('D', 'app@components/dao/ModalGeneral', 'StoreFile-ipfs', 'File saving to ipfs failed')
                // logger.error('B', 'app@components/dao/ModalGeneral', 'StoreFile-ipfs', 'File saving to ipfs failed')
                // notify.danger(t('default.notify_save_file_ipfs_fail_title'), t('default.notify_ipfs_fail') + " " + t('default.notify_save_file_ipfs_fail_message'))
                // notify.flush()
                throw new Error("Ipfs not working" + e);
            });


            const ipfscCdDesc = ipfsSet[0] ? ipfsCids[0] : ''
            const ipfsCidDocument = ipfsSet[1] && ipfsSet[0] ? ipfsCids[1] 
                                        : ipfsSet[1] ? ipfsCids[0] : '' 

            let mediaType = getMediaType(ipfsCidDocument)
            
            const content = {
                Media: {
                    name: values.fileName,
                    proposal_id: 0,
                    category: values.fileCategory,
                    media_type: mediaType,
                    tags: [],
                    version: getNewVersion.value,
                    valid: true
                }
            }

            nearService.value.addProposal(
                content, 
                contractId.value,
                template.value.id,
                template.value.settings[0].id,
                ipfscCdDesc,
                [],
                `wf-media-add-${moment().valueOf()}`,
                1.0
            )
        }, () => {
                console.log(errors.value)
        });
        

        return {
            t,
            onSubmit,
            nameOptions,
            filterFormName,
            nameValueDisplayed,
            nameItemTemplate,
            categoryOptions,
            formVersionUpgrageMajor,
            isNewFile,
            getNewVersion,
            formDocumentType,
            documentTypeDropdown,
            fileUploadMsg,
            handleUpload,
            formHtml,
            errors,
            refWysiwyg,
            values,
        }
    },
}
</script>