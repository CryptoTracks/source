/* eslint no-undef: ["error", { "typeof": true }] */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App'
import router from './router'
import 'bootstrap/dist/js/bootstrap'
import 'jquery-knob'
import detectEthereumProvider from '@metamask/detect-provider';

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

function initApp() {
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app');
}

window.addEventListener('load', () => {
  detectEthereumProvider()
    .then(provider => {
      Vue.prototype.$ethereum = provider;
      console.info('ethereum found...', provider);
      initApp();
    })
    .catch(err => {
      console.error(err);
      console.error('no ethereum provider');
      Vue.prototype.$ethereum = null;
      initApp();
    })
})
