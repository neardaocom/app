<template>
   <MDBTable sm responsive striped> 
      <thead>
         <tr>
            <th scope="col">#</th>
            <th scope="col"></th>
            <th scope="col">{{ t("name")}}</th>
            <th scope="col"></th>
            <th scope="col">{{ t("category")}}</th>
            <th v-if="false" scope="col" style="min-width:200px">{{ t("description")}}</th>
            <th v-if="false" scope="col" style="min-width:200px">{{ t("tags")}}</th>
            <th scope="col">{{ t("valid")}}</th>
            <th scope="col">{{ t("version")}}</th>
         </tr>
      </thead>
      <tbody>

      <tr>
         <td colspan="7" class="p-0">
            <MDBProgress class="my-1">
            <MDBProgressBar bg="secondary" :value="progress" />
            </MDBProgress>
         </td>
      </tr>

         <tr v-for="(doc, index) in resources" :key="doc.id">
            <td>{{ index + 1 }}</td>
            <td><MDBIcon :icon="getIcon(doc.type)" iconStyle="fas" /></td>
            <td class="fw-bold text-start">
               <a href="#"  @click.prevent="open(doc.id)">
                  {{ doc.name }} 
                  <MDBIcon v-if="doc.type.includes('url')" size="sm" icon="external-link-alt" iconStyle="fas" />
                  <MDBIcon v-else-if="doc.type.includes('pdf')" size="sm" icon="file" iconStyle="fas" />
               </a> 
               <MDBSpinner :style="{visibility: fileLoading && fileClicked === doc.id ? 'visible' : 'hidden'}" size="sm" color="primary" class="ms-2"/>
            </td>
            <td class="text-start"><span class="d-inline-block text-truncate" style="max-width: 250px">{{ doc.source }}</span></td>
            <td class="text-start">{{ doc.category }}</td>
            <td v-if="false" class="text-truncate">{{ doc.description }}</td>
            <td v-if="false" class="text-start">{{ doc.tags.join(', ') }}</td>
            <td class="text-start" ><MDBIcon :class="doc.valid ? 'text-success' : 'text-danger'" style="font-size:25px" :icon="doc.valid ? 'check-circle' : 'times-circle'" iconStyle="far" /></td>
            <td>
            <!-- <DocumentVersion :list="doc.versions" :version="doc.version" :open="openOldVersion"/> -->
               <MDBBtnGroup size="sm" role="toolbar">
                  <MDBBtn color="secondary" @click.prevent="open(doc.id)">
                     <MDBSpinner  v-if="fileLoading && fileClicked === doc.id" size="sm" color="white"/>
                     <template v-else>{{ doc.version }}</template>
                  </MDBBtn>
                  <MDBBtn v-for="(item, index ) in getLastVersions(doc.versions)" :key="index" color="secondary" @click="open(item.id)">
                     <MDBSpinner v-if="fileLoading && fileClicked === item.id" size="sm" color="white"/>
                     <template v-else >{{ item.version }}</template>
                     
                  </MDBBtn>
               </MDBBtnGroup>
            </td>
            </tr>
      </tbody>
   </MDBTable>
</template>

<script>
import { useI18n } from 'vue-i18n';
import {
  MDBTable, MDBProgress, MDBProgressBar, MDBIcon, MDBBtnGroup, MDBBtn, MDBSpinner 
} from 'mdb-vue-ui-kit'
import { ref } from '@vue/reactivity';
import DocsHelper from '@/models/dao/DocsHelper';
import loOrderBy from "lodash/orderBy"

export default {
   components: { 
      MDBTable, MDBProgress, MDBProgressBar, MDBIcon, MDBBtnGroup, MDBBtn, MDBSpinner
   },
   props:{
      resources:{
         type: Object,
         required: true,
      },
      progress: {
         type: Number,
         required: true,
      },
      fileLoading: {
         type: Boolean,
         required: false,
         default: false
      }
   },
   setup ( _props , { emit }) {
      const { t } = useI18n() 
      const fileClicked = ref(0)

      const getIcon = DocsHelper.getIcon

      const open = (index) => {
         emit('openResource', index)
         fileClicked.value = index
      }

      const getLastVersions = (versions) => {
         return loOrderBy(versions, ['index'], ['desc']).slice(0, 3)
      }

      return {
         t, getIcon, open, fileClicked, getLastVersions
      }
   }
}
</script>

<style lang="scss" scoped>

</style>