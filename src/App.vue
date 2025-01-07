<template>
  <router-view></router-view>
  <div>
    <!-- Content goes here -->
     <HomePage />
     <SignUp />
     <LogIn />
     <AdminPanel />
     <ParlourService />
     <AppointmentPage />
     <ClientPage />
  </div>
</template>

<script>




export default {
  name: 'App',
  components: {
   

   
  },
};
</script>

<style>
/* Styles go here */
*{
  padding: 0;
  margin: 0;
}

</style>
