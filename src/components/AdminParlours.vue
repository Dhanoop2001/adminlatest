<template>
  <v-app id="inspire">
    <v-app-bar
      style="z-index: 1; background-image: linear-gradient(135deg, transparent 0%, transparent 50%, rgba(159, 159, 159, 0.07) 50%, rgba(159, 159, 159, 0.07) 77%, transparent 77%, transparent 100%), linear-gradient(90deg, transparent 0%, transparent 91%, rgba(159, 159, 159, 0.07) 91%, rgba(159, 159, 159, 0.07) 99%, transparent 99%, transparent 100%), linear-gradient(135deg, transparent 0%, transparent 24%, rgba(159, 159, 159, 0.07) 24%, rgba(159, 159, 159, 0.07) 63%, transparent 63%, transparent 100%), linear-gradient(0deg, transparent 0%, transparent 49%, rgba(159, 159, 159, 0.07) 49%, rgba(159, 159, 159, 0.07) 63%, transparent 63%, transparent 100%), linear-gradient(90deg, rgb(0, 0, 0), rgb(0, 0, 0));"
      color="teal-darken-4"
    >
      <v-app-bar-title>SalonInfo</v-app-bar-title>
    </v-app-bar>
    <v-main>
      <v-card class="elevation-2">
        <v-tabs v-model="tab" align-tabs="center" color="deep-purple-accent-4">
          <v-tab value="2">Pending Requests</v-tab>
          <v-tab value="1">Approved Requests</v-tab>
        </v-tabs>
      </v-card>

      <v-container v-if="tab === '2'" key="pending">
        <v-data-table
          :headers="headings"
          :items="pendingParlours"
          class="elevation-1"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn color="black" @click="approve(item.parlour_id)">Approve</v-btn>
            <v-btn color="black" margin-left="15px" @click="reject(item.parlour_id)">Reject</v-btn>
          </template>
        </v-data-table>
      </v-container>

      <v-container v-if="tab === '1'" key="approved">
        <v-data-table
          :headers="headings1"
          :items="approvedParlours"
          class="elevation-1"
        >
        <template v-slot:[`item.parlour_image`]="{ item }">
           <v-img :src="item.parlour_image" width="50" height="50"></v-img>
        </template>
      </v-data-table>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import store from "../store"; // Adjust the path if needed

export default {
  store,
  data() {
    return {
      tab: "2",
      headings: [
        { text: "Sl.no", key: "sl_no" },
        { text: "Parlour ID", key: "parlour_id" },
        { text: "Parlour Image", key: "parlour_image" },
        { text: "Name", key: "name" },
        { text: "Phone", key: "phone" },
        { text: "Email", key: "email" },
        { text: "View", key: "view", sortable: false },
        { text: "Delete", key: "delete", sortable: false },
        { text: "Actions", key: "actions", sortable: false },
      ],
      headings1: [
        { text: "Sl.no", key: "sl_no" },
        { text: "Parlour ID", key: "parlour_id" },
        { text: "Parlour Image", key: "parlour_image" },
        { text: "Name", key: "name" },
        { text: "Phone", key: "phone" },
        { text: "Email", key: "email" },
        { text: "Details", key: "details", sortable: false },
        { text: "Delete", key: "delete", sortable: false },
      ],
    };
  },
  computed: {
    ...mapGetters(["getAllParlours"]),
    pendingParlours() {
      return this.getAllParlours.filter((parlour) => !parlour.approved);
    },
    approvedParlours() {
      return this.getAllParlours.filter((parlour) => parlour.approved);
    },
  },
  methods: {
    ...mapActions(["fetchParlours", "approveParlour", "rejectParlour", "deleteParlour"]),
    approve(parlourId) {
      this.approveParlour(parlourId)
        .then(() => {
          this.fetchParlours(); // Refresh the parlours list
        })
        .catch((error) => {
          console.error("Failed to approve parlour:", error);
        });
    },
    reject(parlourId) {
      this.rejectParlour(parlourId)
        .then(() => {
          this.fetchParlours(); // Refresh the parlours list
        })
        .catch((error) => {
          console.error("Failed to reject parlour:", error);
        });
    },
    deleteParlour(parlourId) {
      this.deleteParlour(parlourId)
        .then(() => {
          this.fetchParlours(); // Refresh the parlours list
        })
        .catch((error) => {
          console.error("Failed to delete parlour:", error);
        });
    },
  },
  mounted() {
    this.fetchParlours();
  },
};
</script>

<style scoped>
.qr {
  width: 50px;
  height: 50px;
  border-radius: 8px;
}
</style>
