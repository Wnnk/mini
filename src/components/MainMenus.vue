<script setup lang='ts'>
import { t } from "../language/index"
import { useI18n } from "vue-i18n"
import { ref, computed, reactive } from "vue"
import { setLocal } from "../utils/local"
import { LANG } from '../config/constants/app'

const { locale, tm } = useI18n();

const Language = tm('language_map')


const setLanguage = (type: string) => {
  setLocal(LANG, type)
  locale.value = type
}
const localeMap = computed(() => {
  return tm('language_map')
})

</script>

<template>
  <nav class="main_menu">
    <!-- <div v-for="(lang,key) in localeMap" @click="setLanguage(key)"> {{ lang }}</div> -->
     <select v-model="locale" class="language_select">
       <option v-for="(lang,key) in localeMap" :value="key">{{ lang }}</option>
     </select>
  </nav>
</template>

<style lang='scss' scoped>
</style>