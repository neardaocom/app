import { createI18n, LocaleMessages, VueMessageType } from 'vue-i18n'
import loToString from "lodash/toString"

/**
 * Supported locales
 * 
 * @returns array
 */
function getSupportedLocales() {
  return loToString(process.env.VUE_APP_I18N_SUPPORTED).split(',')
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
  if (supported_locales.includes(loToString(locale_browser))) {
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
function loadLocaleMessages(): LocaleMessages<VueMessageType> {
  const locales = require.context(
    "./locales",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  const messages: LocaleMessages<VueMessageType> = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

export default createI18n({
  legacy: false,
  locale: getInitLocale(),
  fallbackLocale: getInitLocale(),
  messages: loadLocaleMessages()
})