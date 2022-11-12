import { createApp } from "vue";
import App from "./App.vue";

// import "~/styles/element/index.scss";

// import ElementPlus from "element-plus";
// import all element css, uncommented next line
// import "element-plus/dist/index.css";

// or use cdn, uncomment cdn link in `index.html`

import "~/styles/index.scss";
import 'uno.css'
// import "bootstrap/dist/css/bootstrap.min.css";

// If you want to use ElMessage, import it.
import "element-plus/theme-chalk/src/message.scss"

import 'virtual:svg-icons-register'
import SvgIcon from "~/components/Svg/SvgIcon.vue";

const app = createApp(App)
.component('svg-icon', SvgIcon);
// app.use(ElementPlus);
app.mount("#app");
