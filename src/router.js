import { createRouter, createWebHistory } from 'vue-router';

const routes = [
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
        path: '/gst-page', 
        name: 'GstPage',
        component: () => import('@/components/GstPage.vue') 
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