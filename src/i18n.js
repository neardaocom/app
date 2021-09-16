import { createI18n } from 'vue-i18n'

/**
 * Supported locales
 * 
 * @returns array
 */
function getSupportedLocales() {
  //return process.env.VUE_APP_I18N_SUPPORTED.split(',')
  return ['cs', 'en']
}

/**
 * Get init locale
 * 
 * From browser and then form config
 * 
 * @returns Locale for application
 */
function getInitLocale() {
  let locale_browser = navigator.language.split('-').shift()
  const supported_locales = getSupportedLocales()
  if (supported_locales.includes(locale_browser)) {
    null
  } else {
    locale_browser = process.env.VUE_APP_I18N_LOCALE || 'en'
  }

  return locale_browser
}

/**
 * Load locale messages
 * 
 * The loaded `JSON` locale messages is pre-compiled by `@intlify/vue-i18n-loader`, which is integrated into `vue-cli-plugin-i18n`.
 * See: https://github.com/intlify/vue-i18n-loader#rocket-i18n-resource-pre-compilation
 */
function loadLocaleMessages() {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

export default createI18n({
  legacy: false,
  locale: getInitLocale(),
  fallbackLocale: getInitLocale(),
  messages: loadLocaleMessages()
})