<template>
    <v-container>
      <v-card>
        <v-card-title>App Charge Management</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitCharge">
            <v-text-field v-model="charge.startRange" label="Start Range" type="number" required></v-text-field>
            <v-text-field v-model="charge.endRange" label="End Range" type="number" required></v-text-field>
            <v-text-field v-model="charge.percentage" label="Percentage" type="number" step="0.1" required></v-text-field>
            <v-btn color="primary" type="submit">{{ isEdit ? 'Update Charge' : 'Add Charge' }}</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
      <v-divider class="my-4"></v-divider>
      <v-card>
        <v-card-title>All App Charges</v-card-title>
        <v-card-text>
          <v-data-table :headers="headers" :items="charges" class="elevation-1">
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small @click="editCharge(item)">mdi-pencil</v-icon>
              <v-icon small color="red" @click="deleteCharge(item.id)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        charges: [],
        charge: { startRange: '', endRange: '', percentage: '' },
        isEdit: false,
        editId: null,
        headers: [
          { text: 'Start Range', value: 'startRange' },
          { text: 'End Range', value: 'endRange' },
          { text: 'Percentage', value: 'percentage' },
          { text: 'Actions', value: 'actions', sortable: false }
        ],
        token: localStorage.getItem('token') || ''
      };
    },
    methods: {
      async fetchCharges() {
        try {
          const response = await axios.get('http://192.168.1.200:8086/api/appCharge/allCharge', {
            headers: { Authorization: `Bearer ${this.token}` },
            withCredentials: true
          });
          this.charges = response.data;
        } catch (error) {
          console.error('Error fetching charges:', error);
        }
      },
      async submitCharge() {
        try {
          const url = this.isEdit
            ? `http://192.168.1.200:8086/api/appCharge/updateCharge?Id=${this.editId}`
            : 'http://192.168.1.200:8086/api/appCharge/addCharge';
          await axios({
            method: this.isEdit ? 'PUT' : 'POST',
            url,
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.token}` },
            data: this.charge,
            withCredentials: true
          });
          this.resetForm();
          this.fetchCharges();
        } catch (error) {
          console.error('Error submitting charge:', error);
        }
      },
      editCharge(charge) {
        this.isEdit = true;
        this.editId = charge.id;
        this.charge = { ...charge };
      },
      async deleteCharge(id) {
        try {
          await axios.delete(`http://192.168.1.200:8086/api/appCharge/deleteCharge?Id=${id}`, {
            headers: { Authorization: `Bearer ${this.token}` },
            withCredentials: true
          });
          this.fetchCharges();
        } catch (error) {
          console.error('Error deleting charge:', error);
        }
      },
      resetForm() {
        this.charge = { startRange: '', endRange: '', percentage: '' };
        this.isEdit = false;
        this.editId = null;
      }
    },
    mounted() {
      this.fetchCharges();
    }
  };
  </script>