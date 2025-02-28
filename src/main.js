import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify'; // Ensure this is correct
import router from './router'; // If you are using Vue Router

const app = createApp(App);
app.use(vuetify);
app.use(router); // If you are using Vue Router
app.mount('#app');