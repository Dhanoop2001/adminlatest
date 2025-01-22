<template>
  <v-app id="inspire">
    <v-app-bar
      style="z-index: 1;background-image: linear-gradient(135deg, transparent 0%, transparent 50%,rgba(159, 159, 159,0.07) 50%, rgba(159, 159, 159,0.07) 77%,transparent 77%, transparent 100%),linear-gradient(90deg, transparent 0%, transparent 91%,rgba(159, 159, 159,0.07) 91%, rgba(159, 159, 159,0.07) 99%,transparent 99%, transparent 100%),linear-gradient(135deg, transparent 0%, transparent 24%,rgba(159, 159, 159,0.07) 24%, rgba(159, 159, 159,0.07) 63%,transparent 63%, transparent 100%),linear-gradient(0deg, transparent 0%, transparent 49%,rgba(159, 159, 159,0.07) 49%, rgba(159, 159, 159,0.07) 63%,transparent 63%, transparent 100%),linear-gradient(90deg, rgb(0,0,0),rgb(0,0,0));"
      color="teal-darken-4"
    >
      <v-app-bar-title>saloninfo</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8">
            <h1 class="text-center">Add Offers</h1>
            <v-form ref="form" @submit.prevent="handleSubmit">
              <v-row>
                <v-col cols="12" md="6" offset-md="2" class="custom-margin">
                  <v-text-field
                    v-model="name"
                    :rules="nameRules"
                    label="Name"
                    outlined
                    dense
                    required
                  ></v-text-field>
                  <v-textarea
                    v-model="description"
                    :rules="descriptionRules"
                    label="Description"
                    outlined
                    dense
                    required
                    rows="5"
                  ></v-textarea>
                  <v-text-field
                    v-model="offerPrice"
                    :rules="priceRules"
                    label="Offer Price"
                    outlined
                    dense
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-btn
                type="submit"
                color="black"
                class="white--text mt-3"
                style="width: 404px; height: 40px; border-radius: 16px;"
              >
                Add
              </v-btn>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    name: '',
    description: '',
    offerPrice: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => v.length >= 3 || 'Name must be at least 3 characters',
    ],
    descriptionRules: [
      v => !!v || 'Description is required',
      v => v.length >= 10 || 'Description must be at least 10 characters',
    ],
    priceRules: [v => !!v || 'Offer Price is required'],
  }),

  methods: {
    async handleSubmit() {
      await this.$store.dispatch('addOffers', {
        name: this.name,
        description: this.description,
        offerPrice: this.offerPrice,
      });
    },
  },
};
</script>

<style scoped>
h1 {
  margin-top: 54px;
  text-align: center;
  color: black;
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 1);
}

.v-form {
  max-width: 600px;
  text-align: center;
  margin: 20px auto;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
}

.v-text-field,
.v-textarea {
  margin-top: 1em;
  width: 400px;
}

.custom-margin {
  margin-left: 90px;
}
</style>
