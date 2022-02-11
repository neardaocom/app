<template>
    <div class="row">
        <div class="col-12 col-lg-6 mb-4">
            <Autocomplete :labelName="t('default.name')" id="file_name" :options="nameOptions" :filtredBy="filterFormName" :valueDisplayed="nameValueDisplayed" :itemContent="nameItemTemplate"/>
        </div>
        <div class="col-12 col-lg-6 mb-4">
            <Autocomplete :labelName="t('default.category')" id="file_category" :options="categoryOptions"/>
        </div>
    </div>    
     <div class="row">
        <div class="col-12 mt-1 mb-4">
          <MDBSwitch :disabled="isNewFile" :label="(formVersionUpgrageMajor) ? t('default.upgrade_version', {version: getNewVersion}) : t('default.update_version', {version: getNewVersion})" v-model="formVersionUpgrageMajor"/>
        </div>
     </div>
</template>

<script>
import Autocomplete from '@/components/forms/Autocomplete.vue'
import { useI18n } from 'vue-i18n';
import { computed, ref } from '@vue/reactivity';
import { useForm } from 'vee-validate';
//import { transform, getCategories} from "@/models/document"


export default {
    components:{
        Autocomplete,
    },
    props:{
        contractId: {
            type: String,
            required: false
        },
        docs: {
            type: Object,
            required: false
        }
    },
    setup () {
        const {t} = useI18n()
        //const { docs } = toRefs(props)

        //const files = transform(docs.value)
        //const nameOptions = ref(files.map(item => { return { title: item.name, category: item.category, version: item.version }}))

        const nameOptions = ref([ { title: 'name', category: 'category', version: 1 },
                { title: 'name2', category: 'category2', version: 2 }
        ])

        //const categoryOptions = ref(getCategories(docs.value, t));
        const categoryOptions = ref(['bla', 'houby']);

        const filterFormName = value => {
            return nameOptions.value.filter(item => {
                return item.title.toLowerCase().startsWith(value.toLowerCase());
            });
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
                file_name: 'required|min:3,max:80',
                file_category: 'required|min:3,max:80'
            }
        });

        const { handleSubmit, errors } = useForm({ validationSchema: schema});

        const onSubmit = handleSubmit(values => {
            values.groupId = 1 //council
            values.roles = []
            alert(JSON.stringify(values, null, 2));
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
            categoryOptions
        }
    }
}
</script>