import { ListItemDto } from '@/models/dao/types/admin'
import { defineStore } from 'pinia'

export type ListState = {
  list: ListItemDto[];
};

export const useListStore = defineStore('adminList', {
  state: () => ({
    list: []
  } as ListState),
  actions: {
    setList(list: ListItemDto[]) {
      this.list = list
    },
  },
})