import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from './store'
import './styles/index.scss'
import i18n from './language/index'

import './demos/ipc'

// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

const app = createApp(App);
app.use(setupStore);
app.use(i18n);
app.mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })


