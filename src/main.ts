import { createApp } from "vue";
import App from "~/App.vue";
import router from '~/router/router';
import "~/styles/index.scss";
import 'uno.css'
import 'element-plus/theme-chalk/display.css';
import 'virtual:svg-icons-register'
import "video.js/dist/video-js.css";

const app = createApp(App)
app.use(router);

app.mount("#app");



