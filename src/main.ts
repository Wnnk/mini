import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from './store'
import './styles/index.scss'

import './demos/ipc'
import VueKonva from 'vue-konva'
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

const app = createApp(App);
app.use(setupStore);
app.use(VueKonva);
app.mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })

