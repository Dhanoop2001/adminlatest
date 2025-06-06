import { createRouter, createWebHistory } from 'vue-router';


const routes = [

    {
        path: '/admin-employees',
        name: 'AdminEmployees',
        component: () => import('@/components/AdminEmployees.vue') 

      },

    {
        path: '/admin-users',
        name: 'AdminUsers',
        component: () => import('@/components/AdminUsers.vue') 

      },
    
    {
        path: '/change-password',
        name: 'ChangePassword',
        component: () => import('@/components/ChangePassword.vue') 

      },
    // Login Route
    { 
        path: '/', 
        name: 'LogIn',
        component: () => import('@/components/LogIn.vue') 
    },
    // Admin Panel Route
    { 
        path: '/admin-panel', 
        name: 'AdminPanel',
        component: () => import('@/components/AdminPanel.vue') 
    },
    // Admin Parlours Route
    { 
        path: '/admin-parlours', 
        name: 'AdminParlours',
        component: () => import('@/components/AdminParlours.vue') 
    },
    // Admin Category Route
    
    
   
   
    // App Charge Route
    { 
        path: '/app-charge', 
        name: 'AppCharge',
        component: () => import('@/components/AppCharge.vue') 
    },

     { 
        path: '/admin-dashboard', 
        name: 'AdminDashboard',
        component: () => import('@/components/AdminDashboard.vue') 
    },
    { 
        path: '/admin-offers', 
        name: 'AdminOffers',
        component: () => import('@/components/AdminOffers.vue') 
    },
   
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;