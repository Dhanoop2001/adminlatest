<template>
  <v-app id="inspire">
    <v-app-bar
      style="z-index: 1; background-image: linear-gradient(135deg, transparent 0%, transparent 50%,rgba(159, 159, 159,0.07) 50%, rgba(159, 159, 159,0.07) 77%,transparent 77%, transparent 100%),linear-gradient(90deg, transparent 0%, transparent 91%,rgba(159, 159, 159,0.07) 91%, rgba(159, 159, 159,0.07) 99%,transparent 99%, transparent 100%),linear-gradient(135deg, transparent 0%, transparent 24%,rgba(159, 159, 159,0.07) 24%, rgba(159, 159, 159,0.07) 63%,transparent 63%, transparent 100%),linear-gradient(0deg, transparent 0%, transparent 49%,rgba(159, 159, 159,0.07) 49%, rgba(159, 159, 159,0.07) 63%,transparent 63%, transparent 100%),linear-gradient(90deg, rgb(0,0,0),rgb(0,0,0));"
      color="teal-darken-4"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>saloninfo</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer
      style="background-color: black; color:white;"
      v-model="drawer"
      temporary
    >
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-home-city" title="Overview" value="overview"></v-list-item>
        <v-list-item
          prepend-icon="fas fa-briefcase"
          title="Services"
          value="account"
          @click="serviceClick"
        ></v-list-item>
        <v-list-item
          prepend-icon="fas fa-tags"
          title="Parlours"
          value="account"
          @click="offerClick"
        ></v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="logout">Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-2">
      <v-card style="height: 100vh;">
        <v-breadcrumbs :items="items">
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-right"></v-icon>
          </template>
        </v-breadcrumbs>

        <!-- Add and Display Sub-subcategories -->
        <v-row>
          <!-- Add Sub-subcategory Card -->
          <v-col md="3">
            <v-card
              @click="subsubDia = !subsubDia"
              class="card1 mx-auto a"
              max-width="344"
              max-height="300px"
            >
              <v-img
                style="border-radius: 5px"
                height="250"
                class="align-end text-white"
                :src="require('@/assets/upload1.jpg')"
                cover
              ></v-img>
              <v-card-item>
                <h5 class="multi-line-title">Add Sub Sub Category</h5>
              </v-card-item>
            </v-card>
          </v-col>

          <!-- Render Existing and Newly Added Sub-subcategories -->
          <v-col
            v-for="subsubCategory in subsubCategories"
            :key="subsubCategory.id"
            md="3"
          >
            <v-card class="mx-auto card1 a" max-width="344" max-height="300px">
              <v-img
                style="border-radius: 5px"
                class="align-end text-white"
                height="250"
                :src="subsubCategory.image1"
                cover
              ></v-img>
              <v-card-item>
                <h5 class="multi-line-title">{{ subsubCategory.name }}</h5>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row>

        <!-- Add Sub-subcategory Dialog -->
        <v-dialog
          v-model="subsubDia"
          style="width: 600px; height: 300px; background-color: black; border-radius: 5px;"
        >
          <div style="padding: 20px;">
            <v-text-field
              style="color: white; margin-bottom: 10px;"
              v-model="subsubName"
              label="Sub subcategory Name"
              variant="underlined"
            ></v-text-field>
            <v-file-input
              ref="subsub"
              style="color: white; margin-bottom: 10px;"
              :label="uploadedsubsubFileName"
              v-model="subsubFile"
              accept="image/*"
              outlined
              @change="subsubPhoto"
            ></v-file-input>
            <v-btn color="black" style="border: 2px solid white;" @click="addsubsubCat">Add Sub Sub Category</v-btn>
          </div>
        </v-dialog>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      subsubDia: false,
      items: [],
      subsubCategories: [],
      subsubName: "",
      subsubFile: null,
      picsubsubUrl: "",
    };
  },
  computed: {
    uploadedsubsubFileName() {
      return this.subsubFile ? this.subsubFile.name : "Upload Subsubcategory Photo";
    },
  },
  methods: {
    addsubsubCat() {
      if (!this.subsubName || !this.subsubFile) {
        alert("Please fill in all the details.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.picsubsubUrl = e.target.result;
        this.subsubCategories.push({
          id: Date.now(),
          name: this.subsubName,
          image1: this.picsubsubUrl,
        });
        this.resetForm();
        this.subsubDia = false;
      };
      reader.readAsDataURL(this.subsubFile);
    },
    resetForm() {
      this.subsubName = "";
      this.subsubFile = null;
      this.picsubsubUrl = "";
    },
    subsubPhoto() {
      const file = this.$refs.subsub.files[0];
      this.subsubFile = file || null;
    },
  },
};
</script>

<style scoped>
.card1 {
  margin-top: 10px;
  color: white;
  background-color: rgb(41, 41, 41);
}
</style>
