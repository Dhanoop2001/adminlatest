<template>
  <v-app id="inspire">
    <v-app-bar
      style="z-index: 1; background-image: linear-gradient(135deg, transparent 0%, transparent 50%,rgba(159, 159, 159,0.07) 50%, rgba(159, 159, 159,0.07) 77%,transparent 77%, transparent 100%),linear-gradient(90deg, transparent 0%, transparent 91%,rgba(159, 159, 159,0.07) 91%, rgba(159, 159, 159,0.07) 99%,transparent 99%, transparent 100%),linear-gradient(135deg, transparent 0%, transparent 24%,rgba(159, 159, 159,0.07) 24%, rgba(159, 159, 159,0.07) 63%,transparent 63%, transparent 100%),linear-gradient(0deg, transparent 0%, transparent 49%,rgba(159, 159, 159,0.07) 49%, rgba(159, 159, 159,0.07) 63%,transparent 63%, transparent 100%),linear-gradient(90deg, rgb(0,0,0),rgb(0,0,0));"
      color="teal-darken-4"
    >
      <v-app-bar-title>saloninfo</v-app-bar-title>
    </v-app-bar>

    <v-main class="bg-grey-lighten-2">
      <v-card style="height: 100vh;">
        <v-breadcrumbs :items="items">
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-right"></v-icon>
          </template>
        </v-breadcrumbs>

        <!-- Add and Display Sub-Categories -->
        <v-row>
          <!-- Add Sub-Category Card -->
          <v-col md="3">
            <v-card
              @click="subCategoryDialog = !subCategoryDialog"
              class="card1 mx-auto a"
              max-width="344"
              max-height="300px"
            >
              <v-img
                style="border-radius: 5px; cursor: pointer;"
                height="250"
                class="align-end text-white"
                :src="require('@/assets/upload1.jpg')"
                cover
              ></v-img>
              <v-card-item>
                <h5 class="multi-line-title">Add Sub-Category</h5>
              </v-card-item>
            </v-card>
          </v-col>

          <!-- Render Existing and Newly Added Sub-Categories -->
          <v-col
            v-for="subCategory in subCategories"
            :key="subCategory.id"
            md="3"
          >
            <v-card class="mx-auto card1 a" max-width="344" max-height="300px">
              <v-img
                style="border-radius: 5px; cursor: pointer;"
                class="align-end text-white"
                height="250"
                :src="subCategory.image1"
                cover
                @click="showImageDialog(subCategory.image1)"
              ></v-img>
              <v-card-item>
                <h5 class="multi-line-title">{{ subCategory.name }}</h5>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row>

        <!-- Add Sub-Category Dialog -->
        <v-dialog
          v-model="subCategoryDialog"
          style="width: 600px; height: 300px; background-color: black; border-radius: 5px;"
        >
          <div style="padding: 20px;">
            <v-text-field
              style="color: white; margin-bottom: 10px;"
              v-model="subCategoryName"
              label="Sub-Category Name"
              variant="underlined"
            ></v-text-field>
            <v-file-input
              ref="subCategory"
              style="color: white; margin-bottom: 10px;"
              :label="uploadedSubCategoryFileName"
              v-model="subCategoryFile"
              accept="image/*"
              outlined
              @change="subCategoryPhoto"
            ></v-file-input>
            <v-btn color="black" style="border: 2px solid white;" @click="addSubCategory">Add Sub-Category</v-btn>
          </div>
        </v-dialog>

        <!-- Image Dialog for Popup -->
        <v-dialog
          v-model="imageDialog"
          max-width="800px"
        >
          <v-img
            :src="selectedImage"
            height="auto"
            width="100%"
            alt="Sub-Category Image"
          ></v-img>
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
      subCategoryDialog: false,
      imageDialog: false,
      selectedImage: "",
      items: [],
      subCategories: [],
      subCategoryName: "",
      subCategoryFile: null,
      picSubCategoryUrl: "",
    };
  },
  computed: {
    uploadedSubCategoryFileName() {
      return this.subCategoryFile ? this.subCategoryFile.name : "Upload Sub-Category Photo";
    },
  },
  methods: {
    addSubCategory() {
      if (!this.subCategoryName || !this.subCategoryFile) {
        alert("Please fill in all the details.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.picSubCategoryUrl = e.target.result;
        this.subCategories.push({
          id: Date.now(),
          name: this.subCategoryName,
          image1: this.picSubCategoryUrl,
        });
        this.resetForm();
        this.subCategoryDialog = false;
      };
      reader.readAsDataURL(this.subCategoryFile);
    },
    resetForm() {
      this.subCategoryName = "";
      this.subCategoryFile = null;
      this.picSubCategoryUrl = "";
    },
    subCategoryPhoto() {
      const file = this.$refs.subCategory.files[0];
      this.subCategoryFile = file || null;
    },
    showImageDialog(imageUrl) {
      this.selectedImage = imageUrl;
      this.imageDialog = true;
    },
  },
};
</script>

<style scoped>
.card1 {
  margin-top: 10px;
  color: white;
  background-color: rgb(41, 41, 41);
  font-size: larger;
}
</style>
