/** 
 * @description : 国际化文件 
 *  
**/

import { createI18n } from "vue-i18n";
import CN from './zh.json'
import EN from './en.json'
import { getLocal, setLocal } from "../utils/local";
import { LANG } from "../config/constants/app";

const messages = {
  zh: CN,
  en: EN,
}

const getLocalLang = () => {
  try {
    let localLang = getLocal(LANG);

    if (!localLang) {
      let defaultLang = navigator.language || 'zh';
      if(defaultLang) {
        defaultLang = defaultLang.split('-')[0].toLocaleLowerCase();
        localLang = defaultLang;
      }
      setLocal(LANG, defaultLang);
      // return localLang;
    }
    return localLang;
  } catch (error) {
    console.error('Error getting or setting local language:', error);
    return 'zh';
  }
}

const lang = getLocalLang();

const i18n = createI18n({
  allowComposition: true, // 允许组合式API访问和操作
  globalInjection: true, // 全局注入 不需要引入的情况下直接使用
  legacy: false, // 兼容旧版语法
  locale: lang, // 设置默认语言
  messages,
});

export default i18n;

export const t = (key:any) => {
  return i18n.global.t(key);
}