import {translations} from '../constant/language'

export const getTranslation = (key) => {
    const lang = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en';
    return translations[key][lang];
}