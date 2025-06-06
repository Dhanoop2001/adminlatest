<template>
  <v-container>
    <v-card class="pa-4" elevation="5">
      <v-card-title class="text-h5 text-center">Manage GST</v-card-title>
      <v-divider class="my-4"></v-divider>
      <v-form @submit.prevent="addGst" class="d-flex flex-column gap-4">
        <v-text-field v-model="newGst.item" label="Item" required outlined dense></v-text-field>
        <v-text-field 
          v-model="newGst.amount" 
          label="Amount" 
          type="number" 
          step="0.01" 
          required 
          outlined 
          dense
          :rules="[amountRule]"
        ></v-text-field>
        <v-btn type="submit" color="primary" class="mt-2" :disabled="loading">
          <v-icon left>mdi-plus</v-icon> Add GST
        </v-btn>
      </v-form>
    </v-card>
    
    <v-card class="mt-6 pa-4" elevation="5">
      <v-card-title class="text-h6">GST List</v-card-title>
      <v-divider class="mb-4"></v-divider>
      <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
      <v-list v-else>
        <v-list-item v-for="gst in gstList" :key="gst.id" class="mb-2 rounded-lg">
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">
              <v-icon left>mdi-currency-inr</v-icon> {{ gst.item }} - {{ gst.amount }}
            </v-list-item-title>
          </v-list-item-content>
          <div class="btn-container">
            <v-btn color="blue" class="mx-2" @click="openEditDialog(gst)" small>
              <v-icon left>mdi-pencil</v-icon> Edit
            </v-btn>
            <v-btn color="red" @click="deleteGst(gst.id)" small>
              <v-icon left>mdi-delete</v-icon> Delete
            </v-btn>
          </div>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- Edit GST Dialog -->
    <v-dialog v-model="editDialog" max-width="400px">
      <v-card>
        <v-card-title>Edit GST</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field 
            v-model="editGstData.amount" 
            label="New Amount" 
            type="number" 
            step="0.01" 
            required 
            outlined 
            dense
            :rules="[amountRule]"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="editDialog = false">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="updateGst">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      newGst: { item: '', amount: '' },
      gstList: [],
      loading: false,
      editDialog: false,
      editGstData: { id: null, item: '', amount: '' },
      amountRule: value => (value > 0 ? true : 'Amount must be positive')
    };
  },
  methods: {
    async fetchGst() {
      this.loading = true;
      try {
        const response = await axios.get('http://192.168.l.200:8086/api/gst/allGst', {
          withCredentials: true
        });
        this.gstList = response.data;
      } catch (error) {
        console.error('Error fetching GST:', error);
      } finally {
        this.loading = false;
      }
    },
    async addGst() {
      if (!this.newGst.item || this.newGst.amount <= 0) return;
      try {
        await axios.post('http://192.168.l.200:8086/api/gst/addGst', this.newGst, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });
        this.fetchGst();
        this.newGst = { item: '', amount: '' };
      } catch (error) {
        console.error('Error adding GST:', error);
      }
    },
    openEditDialog(gst) {
      this.editGstData = { ...gst };
      this.editDialog = true;
    },
    async updateGst() {
      if (this.editGstData.amount <= 0) return;
      try {
        await axios.put(
          `http://192.168.l.200:8086/api/gst/updateGst?Id=${this.editGstData.id}`,
          { item: this.editGstData.item, amount: this.editGstData.amount },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          }
        );
        this.fetchGst();
        this.editDialog = false;
      } catch (error) {
        console.error('Error updating GST:', error);
      }
    },
    async deleteGst(id) {
      try {
        await axios.delete(`http://192.168.l.200:8086/api/gst/deleteGst?Id=${id}`, {
          withCredentials: true
        });
        this.fetchGst();
      } catch (error) {
        console.error('Error deleting GST:', error);
      }
    }
  },
  mounted() {
    this.fetchGst();
  }
};
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}
.v-btn {
  text-transform: none;
}
.gap-4 {
  gap: 16px;
}
.btn-container {
  display: flex;
  align-items: center;
}
</style>
