<template>



<div class="dashboard">
<h2>Dashboard</h2>

<div class="forms-container">
  <!-- Profile form -->
  <form class="form-container" @submit.prevent="updateProfile">
    <h3>Profile</h3>
    <div class="profile-picture">
      <label for="profile-picture" class="custom-file-upload">
        Upload Profile Picture
      </label>
      <input id="profile-picture" type="file" @change="onProfilePictureChange">
    </div>
    <div class="bio">
      <label for="bio">Bio:</label>
      <textarea id="bio" v-model="bio"></textarea>
    </div>
    <button type="submit">Update Profile</button>
  </form>

  <!-- Link form -->
  <form class="form-container" @submit.prevent="submitForm">
    <h3>Add a New Link</h3>
    <div>
      <label for="title">Title:</label>
      <input id="title" v-model="title" type="text" />
    </div>
    <div>
      <label for="url">URL:</label>
      <input id="url" v-model="url" type="url" />
    </div>
    <div class="file-upload">
      <label for="link-image" class="custom-file-upload">
        Upload Image for Link
      </label>
      <input id="link-image" type="file" @change="onLinkImageChange" />
    </div>
    <button type="submit">Add Link</button>
  </form>
</div>

<!-- Link list -->
  <div class="link-list">
    <div class="link-card" v-for="(link, index) in links" :key="index">
      <img :src="link.image" alt="Link Image" class="link-image">
      <h4>{{ link.title }}</h4>
      <a :href="link.url">{{ link.url }}</a>
      <div class="link-actions">
        <button @click="editLink(index)">Edit</button>
        <button @click="updateLink(index)">Update</button>
        <button @click="deleteLink(index)">Delete</button>
      </div>
    </div>
</div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_API_URL);

    const bio = ref('');
    const title = ref('');
    const url = ref('');
    const profilePicture = ref(null);
    const linkImage = ref(null);
    const links = ref([
      { title: 'Link 1', url: 'https://example.com', image: 'https://pbs.twimg.com/profile_images/1498641868397191170/6qW2XkuI_400x400.png' },
      { title: 'Link 2', url: 'https://example.org', image: 'https://pbs.twimg.com/profile_images/1498641868397191170/6qW2XkuI_400x400.png' },
      { title: 'Link 3', url: 'https://example.org', image: 'https://pbs.twimg.com/profile_images/1498641868397191170/6qW2XkuI_400x400.png' },
      { title: 'Link 4', url: 'https://example.org', image: 'https://pbs.twimg.com/profile_images/1498641868397191170/6qW2XkuI_400x400.png' },
      { title: 'Link 5', url: 'https://example.org', image: 'https://pbs.twimg.com/profile_images/1498641868397191170/6qW2XkuI_400x400.png' },
      { title: 'Link 6', url: 'https://example.org', image: 'https://pbs.twimg.com/profile_images/1498641868397191170/6qW2XkuI_400x400.png' },
      { title: 'Link 7', url: 'https://example.org', image: 'https://pbs.twimg.com/profile_images/1498641868397191170/6qW2XkuI_400x400.png' },
    ]);

    const submitForm = () => {
      const newLink = {
        title: title.value,
        url: url.value,
        image: null, // Placeholder for the uploaded image URL
      };

      // Create a new FormData object
      const formData = new FormData();

      // Append the title and URL to the form data
      formData.append('title', newLink.title);
      formData.append('url', newLink.url);

      // Append the image file to the form data
      if (linkImage.value) {
        formData.append('image', linkImage.value);
      }

      // Perform the image upload request to your server
      // You can use fetch or any other HTTP library of your choice
      fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
          .then((response) => response.json())
          .then((data) => {
            // Assuming the server returns the uploaded image URL
            newLink.image = data.imageUrl;

            // Add the new link to the links array
            links.value.push(newLink);

            // Reset form fields
            title.value = '';
            url.value = '';
            linkImage.value = null;
          })
          .catch((error) => {
            console.error('Error uploading image:', error);
          });
    };



    const onProfilePictureChange = (e) => {
      const file = e.target.files[0];
      profilePicture.value = URL.createObjectURL(file);
      // send profilePicture.value to your server
    };

    const updateProfile = () => {
      // add your logic to update the profile
    }

    const editLink = (index) => {
      // Copy the link to edit into your form variables
      title.value = links.value[index].title;
      url.value = links.value[index].url;
      // linkImage.value = ...; // If you have the ability to edit the image, add it here
    };

    const updateLink = (index) => {
      // Update the link in the array
      links.value[index].title = title.value;
      links.value[index].url = url.value;
      // links.value[index].image = linkImage.value; // If you can edit the image, add it here
    };

    const deleteLink = (index) => {
      // Remove the link from the array
      links.value.splice(index, 1);
    };

</script>

<style scoped>

.forms-container {
  display: flex;
  gap: 20px;
  margin-top: 20px; /* Add space above the forms */
}

.form-container {
  flex: 1;
}


.dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center the content horizontally */
}

.dashboard form div,
.dashboard .profile-picture,
.dashboard .bio {
  margin-bottom: 15px;
}

.dashboard form label,
.dashboard .profile-picture label,
.dashboard .bio label {
  display: block;
  margin-bottom: 5px;
}

.dashboard form input,
.dashboard .profile-picture input,
.dashboard .bio textarea {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 2px solid #78b087;
}

.dashboard form button {
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background-color: #78b087;
  color: white;
  cursor: pointer;
}

.link-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Center the link list horizontally */
  margin-top: 20px; /* Add space above the link list */
}

.link-card {
  display: flex;
  align-items: center;
  gap: 15px;
  border: 1px solid #78b087;
  border-radius: 10px;
  padding: 10px;
  color: #fafafa;
  box-sizing: border-box;
  margin-bottom: 15px;
}

.link-card img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
}

.link-card div {
  flex-grow: 1;
}

.link-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.link-actions button {
  background: #a8c79e;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  color: #050505;
  cursor: pointer;
  margin: 10px;
}

</style>

