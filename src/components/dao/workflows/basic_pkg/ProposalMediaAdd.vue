<template>
    <div class="row">
        <div class="col-12 col-lg-6 mb-4">
            <Autocomplete :labelName="t('name')" id="fileName" :options="nameOptions" :filtredBy="filterFormName" :valueDisplayed="nameValueDisplayed" :itemContent="nameItemTemplate"/>
        </div>
        <div class="col-12 col-lg-6 mb-4">
            <Autocomplete :labelName="t('category')" id="fileCategory" :options="categoryOptions"/>
        </div>
    </div>    
    <div class="row">
        <div class="col-12 mt-1 mb-4">
          <MDBSwitch :disabled="isNewFile" :label="(formVersionUpgrageMajor) ? t('upgrade_version', {version: newVersion}) : t('update_version', {version: newVersion})" v-model="formVersionUpgrageMajor"/>
        </div>
    </div>

    <div class="row">
        <div class="col-12 mb-4">
            <div class="text-start">
                <label for="description-id-input"  class="form-label">{{ t('description') }}</label>
            </div>
            <MDBWysiwyg :fixedOffsetTop="58" ref="refWysiwygDesc">
            </MDBWysiwyg>
        </div>
    </div>

    <label for="add-document-input" class="form-label mt-2">{{ t('document') }}</label>

    <!-- <MDBAlert color="danger" static v-if="formDocumentType == 'flush-pdf' && errors.formFiles != null">{{ errors.formFiles }}</MDBAlert>
    <MDBAlert color="danger" static v-if="formDocumentType == 'flush-url' && errors.formUrl != null">{{ errors.formUrl }}</MDBAlert>
    <MDBAlert color="danger" static v-if="formDocumentType == 'flush-html' && errors.formHtml != null">{{ errors.formHtml }}</MDBAlert> -->

    <MDBTabs v-model="activeTabId">
        <!-- Tabs navs -->
        <MDBTabNav  tabsClasses="mb-3" >
            <MDBTabItem tabId="flush-plain" href="flush-plain">{{documentTypeDropdown.plain}}</MDBTabItem>
            <MDBTabItem tabId="flush-url" href="flush-url">{{documentTypeDropdown.link}}</MDBTabItem>
            <MDBTabItem tabId="flush-pdf" href="flush-pdf">{{documentTypeDropdown.pdf}}</MDBTabItem>
            <MDBTabItem tabId="flush-html" href="flush-html">{{documentTypeDropdown.editor}}</MDBTabItem>
        </MDBTabNav>
        <!-- Tabs navs -->
        <!-- Tabs content -->
        <MDBTabContent contentClasses="mb-4">
            <MDBTabPane tabId="flush-plain">
                <InputString :labelName="t('text')" id="plain"/>
            </MDBTabPane>
            <MDBTabPane tabId="flush-url">
                <InputString :labelName="t('url')" id="url"/>
                <div class="col-auto">
                    <span id="add-document-url-input-text" class="form-text"> {{ t('url_format') }} </span>
                </div>
            </MDBTabPane>
            <MDBTabPane tabId="flush-pdf">
                <MDBFileUpload @change="handleUpload" @remove="handleUpload" accept="application/pdf" :maxFilesQuantity="1" :maxFileSize="10"
                :defaultMsg="fileUploadMsg.defautlMessage" :maxSizeError="fileUploadMsg.maxSizeError" :previewMsg="fileUploadMsg.previewMsg"
                :removeBtn="fileUploadMsg.removeBtn"
                />
            </MDBTabPane>
            <MDBTabPane tabId="flush-html">
                <MDBWysiwyg :fixedOffsetTop="58" ref="refWysiwygHtml">
                    <section v-html="formHtml"></section>
                </MDBWysiwyg>
            </MDBTabPane>
        </MDBTabContent>
        <!-- Tabs content -->
    </MDBTabs>

</template>

<script>
import InputString from '@/components/forms/InputString.vue'
import Autocomplete from '@/components/forms/Autocomplete.vue'
import { computed, ref, toRefs, inject, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import DocsHelper from "@/models/dao/DocsHelper"
import VersionHelper from '@/models/utils/VersionHelper'
import { MDBWysiwyg } from "mdb-vue-wysiwyg-editor";
import {
    MDBSwitch,
    MDBTabs,
    MDBTabNav,
    MDBTabContent,
    MDBTabItem,
    MDBTabPane,
//   MDBAlert
} from "mdb-vue-ui-kit";
import { MDBFileUpload } from "mdb-vue-file-upload";
import { useProposalBasic } from '@/hooks/proposal';
import { useResource } from '@/hooks/docs';


export default {
    components:{
        Autocomplete,
        MDBSwitch,
        InputString,
        MDBFileUpload,
        MDBWysiwyg,
        MDBTabs,
        MDBTabNav,
        MDBTabContent,
        MDBTabItem,
        MDBTabPane,
    },
    props:{
        docs: {
            type: Object,
            required: false
        },
    },
    emits: ["isValid"],
    setup (props, {emit}) {
        const { t } = useI18n()
        const { docs } = toRefs(props)
        const dao = inject('dao')
        const loader = inject('loader')
        const config = inject('config')
        const { proposalBasic } = useProposalBasic(loader, config)
        const activeTabId = ref('flush-plain');
        const ipfsService = loader.value.load('services/ipfs')
        const {files} = useResource(ipfsService, dao)

        //console.log(docs.value);
        //const files = transform(docs.value)
        //const files = transform({categories: [], files: [], tags: []})
        //console.log(files);
        // const nameOptions = ref(files.map(item => { return { title: item.name, category: item.category, version: item.version }}))
        const nameOptions = ref(DocsHelper.getNamesOptions(files.value, t))
        const categoryOptions = ref(DocsHelper.getCategories(docs.value, t));

        const refWysiwygHtml = ref(null)
        const refWysiwygDesc = ref(null)
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
        const { values, handleSubmit, errors, setFieldValue, setFieldTouched } = useForm({ validationSchema: schema});

        // fill category if file is known
        watch(() => [values.fileName], () => {
            const existingFile = nameOptions.value.find((item) => item.title === values.fileName)
            if (existingFile){
                setFieldValue('fileCategory', existingFile.category )
                setFieldTouched('fileCategory', true)
            }
        })
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
        const getIndexOfFile = computed(() => (DocsHelper.getIndexInFiles(files.value, values.fileName, values.fileCategory)))
        const isNewFile = computed(() => (getIndexOfFile.value == -1 )) 
        const formVersionUpgrageMajor = ref(true)
        const getVersionOfFile = computed(() => ((!isNewFile.value ) ? files.value[getIndexOfFile.value].version : undefined)) 
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
            plain: t('plain_text'),
            link: t('link'),
            pdf: t('pdf'),
            editor: t('document'),
        }))
        const fileUploadMsg = computed(() => ({
            defautlMessage: t('file_upload_default_msg'),
            mainError: t('file_upload_main_error'),
            maxSizeError: t('file_upload_max_size_error'),
            previewMsg: t('file_upload_preview_msg'),
            removeBtn: t('file_upload_remove_btn')
        }))

        
        
        const onSubmit = handleSubmit( async (values) => {
            emit('isValid', true)
            const types = activeTabId.value.split('-')
            proposalBasic.value.mediaAdd(dao.value, values.fileName, values.fileCategory, newVersion.value, refWysiwygDesc.value.getCode(), types[1], values.plain, values.url, refWysiwygHtml.value.getCode(), uploadFiles.value)
        }, () => {
            emit('isValid', false)
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
            refWysiwygHtml,
            refWysiwygDesc,
            values,
            activeTabId,
            getIndexOfFile,
            files,
            getVersionOfFile
        }
    },
}
</script>