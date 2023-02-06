import { createApp } from "vue";
import App from "~/App.vue";
import router from '~/router/router'

// import "~/styles/element/index.scss";

// import ElementPlus from "element-plus";
// import all element css, uncommented next line
// import "element-plus/dist/index.css";

// or use cdn, uncomment cdn link in `index.html`

import "~/styles/index.scss";
import 'uno.css'


import 'virtual:svg-icons-register'
import 'element-plus/theme-chalk/display.css';
const app = createApp(App)
app.use(router);
// app.use(ElementPlus);
app.mount("#app");
