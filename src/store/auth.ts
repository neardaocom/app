import { defineStore } from 'pinia'

export type AuthState = {
    isLoggedIn: boolean | undefined;
    accountId: string | undefined;
    login: Function | undefined;
    logout: Function | undefined;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: undefined,
    accountId: undefined,
    login: undefined,
    logout: undefined,
  } as AuthState),
  actions: {
    set(isLoggedIn: boolean, accountId: string, login: Function, logout: Function) {
      this.isLoggedIn = isLoggedIn
      this.accountId = accountId
      this.login = login
      this.logout = logout
    },
  },
})