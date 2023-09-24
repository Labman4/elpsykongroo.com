import { createApp } from "vue";
import App from "~/App.vue";
import router from '~/router/router';
import "~/styles/index.scss";
import 'uno.css'
import 'element-plus/theme-chalk/display.css';
import 'virtual:svg-icons-register'
import '~/assets/ts/live2d';

const app = createApp(App)
app.use(router);
app.mount("#app");



