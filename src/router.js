import { createRouter, createWebHistory } from 'vue-router';



const routes = [
  { path: '/', 
    name: 'HomePage',
     component: () => import('@/components/HomePage.vue') 
    },
    { path: '/sign-up', 
      name: 'SignUp',
        component: () => import('@/components/SignUp.vue') 
       },
       { path: '/log-in', 
        name: 'LogIn',
          component: () => import('@/components/LogIn.vue') 
         },
         { path: '/admin-panel', 
          name: 'AdminPanel',
            component: () => import('@/components/AdminPanel.vue') 
           },
           { path: '/services', 
            name: 'ParlourService',
              component: () => import('@/components/ParlourService.vue') 
             },
             { path: '/appointments', 
              name: 'AppointmentPage',
                component: () => import('@/components/AppointmentPage.vue') 
               },
               { path: '/staff', 
                name: 'ManageStaff',
                  component: () => import('@/components/ManageStaff.vue') 
                 },
                 { path: '/clients', 
                  name: 'ClientPage',
                   component: () => import('@/components/ClientPage.vue') 
                  },
                  
       
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
