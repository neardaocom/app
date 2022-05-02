<template>
   <MDBTable sm responsive striped> 
      <thead>
         <tr>
            <th scope="col">#</th>
            <th scope="col"></th>
            <th scope="col">{{ t("default.name")}}</th>
            <th scope="col">{{ t("default.category")}}</th>
            <th v-if="false" scope="col" style="min-width:200px">{{ t("default.description")}}</th>
            <th v-if="false" scope="col" style="min-width:200px">{{ t("default.tags")}}</th>
            <th scope="col">{{ t("default.valid")}}</th>
            <th scope="col">{{ t("default.version")}}</th>
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

         <tr v-for="(doc, index) in resources" :key="index">
            <td>{{ doc.index + 1 }}</td>
            <td><MDBIcon :icon="getIcon(doc.type)" iconStyle="fas" /></td>
            <td class="fw-bold text-start"><a href="#"  @click.prevent="open(doc.index)">
            {{ doc.name }}&nbsp;
            <MDBIcon v-if="doc.type.includes('url')" size="sm" icon="external-link-alt" iconStyle="fas" />
            <MDBIcon v-else-if="doc.type.includes('pdf')" size="sm" icon="file" iconStyle="fas" />
            </a></td>
            <td class="text-start">{{ doc.category }}</td>
            <td v-if="false" class="text-truncate">{{ doc.description }}</td>
            <td v-if="false" class="text-start">{{ doc.tags.join(', ') }}</td>
            <td class="text-start" ><MDBIcon :class="doc.valid ? 'text-success' : 'text-danger'" style="font-size:25px" :icon="doc.valid ? 'check-circle' : 'times-circle'" iconStyle="far" /></td>
            <td>
               <!-- <DocumentVersion :list="doc.versions" :version="doc.version" :open="openOldVersion"/> -->
               <MDBBtnGroup size="sm" role="toolbar">
                  <MDBBtn color="secondary" @click.prevent="open(doc.index)">{{ doc.version }}</MDBBtn>
                  <!-- <MDBBtn v-for="item in getLastVersions(doc.versions)" :key="item.index" color="info" @click="openDoc(item.index)">{{ item.version }}</MDBBtn> -->
               </MDBBtnGroup>
            </td>
            </tr>
      </tbody>
   </MDBTable>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { DAODocsFileType } from '@/types/dao';
import {
  MDBTable, MDBProgress, MDBProgressBar, MDBIcon, MDBBtnGroup, MDBBtn
} from 'mdb-vue-ui-kit'

export default {
   components: { 
      MDBTable, MDBProgress, MDBProgressBar, MDBIcon, MDBBtnGroup, MDBBtn
   },
   props:{
      resources:{
         type: Object,
         required: true,
      },
      progress: {
         type: Number,
         required: true,
      }
   },
   setup ( _props , { emit }) {
      const { t } = useI18n() 

      const getIcon = (type) => {
         let icon = ''
         switch (type) {
         case DAODocsFileType.binaryPdf:
            icon = 'file-pdf'
            break;
         case DAODocsFileType.plain:
         case DAODocsFileType.html:
            icon = 'file-alt'
            break;
         case DAODocsFileType.url:
            icon = 'link'
            break;
         default:
            break;
         }
         return icon
      }

      const open = (index) => {
         emit('openResource', index)
      }

      return {
         t, getIcon, open
      }
   }
}
</script>

<style lang="scss" scoped>

</style>