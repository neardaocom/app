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
          <MDBSwitch :disabled="isNewFile" :label="(formVersionUpgrageMajor) ? t('default.upgrade_version', {version: newVersion}) : t('default.update_version', {version: newVersion})" v-model="formVersionUpgrageMajor"/>
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
import { computed, ref, toRefs, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import DocsHelper from "@/models/dao/DocsHelper"
import VersionHelper from '@/models/utils/VersionHelper'
import {
    MDBSwitch,
    MDBAccordion, 
    MDBAccordionItem,
//   MDBAlert
} from "mdb-vue-ui-kit";
import { MDBFileUpload } from "mdb-vue-file-upload";
import { MDBWysiwyg } from "mdb-vue-wysiwyg-editor";
import { useProposalBasic } from '@/hooks/proposal';


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
        docs: {
            type: Object,
            required: false
        },
    },
    setup (props) {
        const { t } = useI18n()
        const { docs } = toRefs(props)
        const dao = inject('dao')
        const loader = inject('loader')
        const config = inject('config')
        const { proposalBasic } = useProposalBasic(loader, config)

        //console.log(docs.value);
        //const files = transform(docs.value)
        //const files = transform({categories: [], files: [], tags: []})
        //console.log(files);
        // const nameOptions = ref(files.map(item => { return { title: item.name, category: item.category, version: item.version }}))
        const nameOptions = ref(DocsHelper.getNamesOptions(docs.value, t))
        const categoryOptions = ref(DocsHelper.getCategories(docs.value, t));

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



        /*
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
                    ipfsData = IpfsUtils.makeFileFromString(values.url, getFullname())
                    break;
                case 'flush-html':
                    ipfsData = IpfsUtils.makeFileFromHtml(refWysiwyg.value.getCode(), getFullname())
                    break;
                case 'flush-plain':
                    ipfsData = IpfsUtils.makeFileFromString(values.plain, getFullname())
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
        */


        //switch
        const getIndexOfFile = computed(() => (DocsHelper.getIndexInFiles(docs.value, values.fileName, values.formCategory))) 
        const isNewFile = computed(() => (getIndexOfFile.value == -1 )) 
        const formVersionUpgrageMajor = ref(true)
        const getVersionOfFile = computed(() => ((getIndexOfFile.value) ? docs.value[getIndexOfFile.value].version : undefined)) 
        const newVersion = computed(() => {
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

        
        
        const onSubmit = handleSubmit( async (values) => {
            const types = formDocumentType.value.split('-')
            proposalBasic.value.mediaAdd(dao.value, values.fileName, values.fileCategory, newVersion.value, null, types[1], values.plain, values.url, refWysiwyg.value.getCode(), uploadFiles.value)
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
            newVersion,
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