<template>
  <div class="public-page">
    <img class="avatar" :src="user.profilePicture" alt="User avatar">
    <h1 class="username">{{ user.username }}</h1>
    <p class="bio">{{ user.bio }}</p>
    <div class="links">
      <div class="link-card" v-for="link in user.links" :key="link.id">
        <img v-show="link.imageURL!==null" class="link-img" :src="link.imageURL" alt="Link image">
        <div class="link-info">
          <a class="link-url" :href="link.url">{{ link.name }}</a>
        </div>
      </div>
    </div>
  </div>


</template>

<script setup>
import {onMounted, ref} from 'vue';
import PocketBase from 'pocketbase'

const router = useRouter();
const route = useRoute()

const pb = new PocketBase(import.meta.env.VITE_API_URL);

const user = ref({
  username: '',
  profilePicture: '',
  bio: '',
  links: [],
});


const fetchUser = async () => {
  // Logic to fetch the user, like calling an API endpoint
  // Replace the following with actual fetched data

  // `username="${route.params.id}"`
  // fetch user by slug
  const user_record = await pb.collection('users').getFirstListItem(`username="${route.params.id}"`, {});

  // loop through user_record.valueOf().field and add || before each link except the last one
  const links_filter = user_record.valueOf().field.map((link) => {
    return `${link}`
  }).join('&&id="')


  //const link_records = await pb.collection('links').getFullList( {});
  const link_records = await pb.collection('links').getFullList({'filter': 'user="' + user_record.id + '"'});
  console.log(link_records)

  user.value = {
    username: user_record.valueOf().username,
    profilePicture: pb.files.getUrl(user_record, user_record.valueOf().avatar, {'thumb': '100x100'}),
    bio: user_record.valueOf().bio,
    links: link_records.map((link) => {
      const { name, url, image } = link.valueOf();
      return {
        name,
        url,
        ...(image && {imageURL: pb.files.getUrl(link, image, {thumb: '100x100'})}),
      }
    }),
  };
}

onMounted(fetchUser);


</script>

<style scoped>
.public-page {
  background-color: #050505;
  color: #fafafa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Lato', sans-serif;
  padding: 20px;
  box-sizing: border-box;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  margin-top: 20px;
  margin-bottom: 10px;
  color: #78b087; /* Primary color */
}

.bio {
  margin-bottom: 40px;
  text-align: center;
}

.links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.link-card {
  display: flex;
  align-items: center;
  border: 1px solid #78b087; /* Primary color */
  border-radius: 10px;
  padding: 10px;
  width: 100%; /* Adjust as needed */
  color: #fafafa;
  min-width: 75vw;


}

.link-img {
  border-radius: 50%;
  height: 50px;
  width: 50px;
  object-fit: cover;
  margin-right: 15px;
}

.link-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 15px;
}


.link-url {
  color: #a8c79e; /* Accent color */
  text-decoration: none;
}
</style>