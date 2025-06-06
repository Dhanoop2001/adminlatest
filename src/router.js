import { createRouter, createWebHistory } from 'vue-router';


const routes = [
    { 
        path: '/', 
        name: 'AdminSignup',
        component: () => import('@/components/AdminSignup.vue') 
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () => import('@/components/ForgotPassword.vue') 

      },
    // Login Route
    { 
        path: '/log-in', 
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
    { 
        path: '/admin-category', 
        name: 'AdminCategory',
        component: () => import('@/components/AdminCategory.vue') 
    }, 
    // Admin Offers Route
    { 
        path: '/admin-offers', 
        name: 'AdminOffers',
        component: () => import('@/components/AdminOffers.vue') 
    }, 
    // Admin Overview Route
    { 
        path: '/admin-overview', 
        name: 'AdminOverview',
        component: () => import('@/components/AdminOverview.vue') 
    },
    // GST Page Route
    { 
        path: '/admin-gst', 
        name: 'AdminGst',
        component: () => import('@/components/AdminGst.vue') 
    },
    // App Charge Route
    { 
        path: '/app-charge', 
        name: 'AppCharge',
        component: () => import('@/components/AppCharge.vue') 
    },
   
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;