import { createApp } from "vue";
import App from "~/App.vue";
import router from '~/router/router';
import "~/styles/index.scss";
import 'uno.css'
import 'virtual:svg-icons-register'
import 'element-plus/theme-chalk/display.css';

const app = createApp(App)
app.use(router);
app.mount("#app");
