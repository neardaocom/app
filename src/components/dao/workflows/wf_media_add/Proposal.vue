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
import { getIndexInFiles, transform, getCategories, getNamesOptions } from "@/models/document"
//import { makeFileFromString } from "@/services/ipfsService/IpfsService.js"
import { minorUp, majorUp } from '@/utils/version'
import {
    MDBSwitch,
    MDBAccordion, 
    MDBAccordionItem,
//   MDBAlert
} from "mdb-vue-ui-kit";
import { MDBFileUpload } from "mdb-vue-file-upload";
import { MDBWysiwyg } from "mdb-vue-wysiwyg-editor";


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
        // const { contractId, docs, template } = toRefs(props)
        const { docs } = toRefs(props)


        //const files = transform(docs.value)
        const files = transform({categories: [], files: [], tags: []})
        //console.log(files);
        // const nameOptions = ref(files.map(item => { return { title: item.name, category: item.category, version: item.version }}))
        const nameOptions = ref(getNamesOptions(docs.value, t))

        const categoryOptions = ref(getCategories(docs.value, t));

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


        const uploadFiles = ref([])
        const handleUpload = (files) => {
            uploadFiles.value = files
        }

/*
        const getIpfsData = () => {
            let ipfsData = null
            switch (this.formDocumentType) {
                case 'flush-pdf':
                    ipfsData = uploadFiles.value
                    break;
                case 'flush-url':
                    ipfsData = makeFileFromString(values.url, this.getFullname())
                    break;
                case 'flush-html':
                    ipfsData = makeFileFromString(this.$refs.refWysiwyg.getCode(), this.getFullname())
                    break;
                case 'flush-plain':
                    ipfsData = makeFileFromString(values.plain, this.getFullname())
                    break;
                default:
                    break;
            }
            return ipfsData
        }
*/


        //switch
        const getIndexOfFile = computed(() => (getIndexInFiles(files, values.fileName, values.formCategory))) 
        const isNewFile = computed(() => (getIndexOfFile.value == -1 )) 
        const formVersionUpgrageMajor = ref(true)
        const getVersionOfFile = computed(() => ((getIndexOfFile.value) ? files[getIndexOfFile.value].version : undefined)) 
        const getNewVersion = computed(() => {
            let version = '1.0'
            if (isNewFile.value === false) {
                if (formVersionUpgrageMajor.value === true) {
                version = majorUp(getVersionOfFile.value)
                } else {
                version = minorUp(getVersionOfFile.value)
                }
            }
            return version
        })

        //document
        const formDocumentType = ref('flush-plain')

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

        
        const formHtml = ref('')

        
        
        const onSubmit = handleSubmit(values => {
            console.log(values)
            /*
            let ipfs_cid = ''
            try {
                ipfs_cid = await ipfsService.value.storeFiles(getIpfsData(), name)
            } catch(e){
                //logger.error('D', 'app@components/dao/ModalGeneral', 'StoreFile-ipfs', 'File saving to ipfs failed')
                //logger.error('B', 'app@components/dao/ModalGeneral', 'StoreFile-ipfs', 'File saving to ipfs failed')
                //notify.danger(t('default.notify_save_file_ipfs_fail_title'), t('default.notify_ipfs_fail') + " " + t('default.notify_save_file_ipfs_fail_message'))
                //notify.flush()
                console.log(e);
                return
            }
            
            nearService.value.addProposal(
                contractId.value,
                template.value.id,
                template.value.settings[0].id,
                null,
                [
                    { U128: decimal(values.amount).toFixed() },
                    { String: values.title },
                    { String: values.tokenId },
                    { U128: dateToChain(moment(`${values.startDate} ${values.startTime}`, formatDate + ' hh:mm').toDate()).toString() },
                    { U128: durationToChain({days: values.durationDays, hours: values.durationHours}).toString() },
                    { String: '' }, // url
                ],
                `wf-media-add-${moment().valueOf()}`,
                1.0
            )
        }, () => {
                console.log(errors.value)
                */
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
            values,
        }
    },
    methods: {
        getExt() {
            return this.formDocumentType.replace('flush-', '')
        },
        getFullname() {
            return this.values.fileName + '.' + this.getExt()
        },
    }
}
</script>