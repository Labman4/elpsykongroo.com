import { createApp } from "vue";
import App from "./App.vue";
import router from './router/router'

// import "~/styles/element/index.scss";

// import ElementPlus from "element-plus";
// import all element css, uncommented next line
// import "element-plus/dist/index.css";

// or use cdn, uncomment cdn link in `index.html`

import "~/styles/index.scss";
import 'uno.css'

// If you want to use ElMessage, import it.
// import "element-plus/theme-chalk/src/message.scss"

import 'virtual:svg-icons-register'
import SvgIcon from "~/components/Svg/SvgIcon.vue";
import 'element-plus/theme-chalk/display.css'

const app = createApp(App)
            .component('svg-icon', SvgIcon);

app.use(router);
// app.use(ElementPlus);
app.mount("#app");
