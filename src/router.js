import { createRouter, createWebHistory } from 'vue-router';



const routes = [
  
    // { path: '/sign-up', 
    //   name: 'SignUp',
    //     component: () => import('@/components/SignUp.vue') 
    //    },
       { path: '/', 
        name: 'LogIn',
          component: () => import('@/components/LogIn.vue') 
         },
         { path: '/admin-panel', 
          name: 'AdminPanel',
            component: () => import('@/components/AdminPanel.vue') 
           },
          //  { path: '/services', 
          //   name: 'ParlourService',
          //     component: () => import('@/components/ParlourService.vue') 
          //    },
          //    { path: '/appointments', 
          //     name: 'AppointmentPage',
          //       component: () => import('@/components/AppointmentPage.vue') 
          //      },
          //      { path: '/staff', 
          //       name: 'ManageStaff',
          //         component: () => import('@/components/ManageStaff.vue') 
          //        },
          //        { path: '/clients', 
          //         name: 'ClientPage',
          //          component: () => import('@/components/ClientPage.vue') 
          //         },
          { path: '/admin-parlours', 
            name: 'AdminParlours',
              component: () => import('@/components/AdminParlours.vue') 
             },
             { path: '/admin-category', 
              name: 'AdminCategory',
                component: () => import('@/components/AdminCategory.vue') 
               }, 
               { path: '/admin-offers', 
                name: 'AdminOffers',
                  component: () => import('@/components/AdminOffers.vue') 
                 }, 
                 { path: '/admin-overview', 
                  name: 'AdminOverview',
                    component: () => import('@/components/AdminOverview.vue') 
                   },
                  //  { path: '/barchart', 
                  //   name: 'BarChart',
                  //     component: () => import('@/components/BarChart.vue') 
                  //    },
                  //    { path: '/doughnut', 
                  //     name: 'DoughnutChart',
                  //       component: () => import('@/components/DoughnutChart.vue') 
                  //      },  
                  { path: '/gst-page', 
                    name: 'GstPage',
                      component: () => import('@/components/GstPage.vue') 
                     },
                     { path: '/app-charge', 
                      name: 'AppCharge',
                        component: () => import('@/components/AppCharge.vue') 
                       },
  
               
             
       
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
