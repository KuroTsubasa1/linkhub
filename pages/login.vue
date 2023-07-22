<template>



  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label for="email">Email:</label>
        <input id="email" v-model="email" type="text"/>
        <div v-if="errors.email" class="error">{{ errors.email }}</div>
      </div>
      <div>
        <label for="password">Password:</label>
        <input id="password" v-model="password" type="password"/>
        <div v-if="errors.password" class="error">{{ errors.password }}</div>
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import {ref, reactive} from 'vue';
import PocketBase from 'pocketbase'
import {default as session_helper} from '../utils/session_helper'

const pb = new PocketBase(import.meta.env.VITE_API_URL);
const router = useRouter();

const email = ref('');
const password = ref('');
const errors = reactive({
  email: '',
  password: '',
});

const submitForm = async () => {
  // Reset previous errors
  errors.email = '';
  errors.password = '';

  // Validate the form
  if (!email.value) {
    errors.email = 'Email is required.';
  }

  if (!password.value) {
    errors.password = 'Password is required.';
  }

  if (Object.values(errors).some(error => error !== '')) {
    return; // Don't submit if there are errors
  }

  // Submit login form

  const authData = await pb.collection('users').authWithPassword(
      email.value,
      password.value,
  ).then((authData) => {
        console.log("authData")
        console.log(authData)

        //pb.authStore.save(authData.token, authData.record)
        const a = pb.authStore.exportToCookie({httpOnly: false});
        console.log(a)
        document.cookie = a;
        if (pb.authStore.isValid) {
          console.log('valid')

          router.push({path: '/dashboard'});
        }
      }
  ).catch((error) => {
    console.log('error')
    console.log(email.value)
    console.log(password.value)
    console.log(error)
    errors.email = error.message;
  });

};


onMounted(async () => {

  // load cookie data manually and set it to authStore
  console.log(session_helper.getCookie(import.meta.env.VITE_AUTH_COOKIE))
  let cookieData = {token: '', record: {}}; // default
  try {
    cookieData = JSON.parse(session_helper.getCookie(import.meta.env.VITE_AUTH_COOKIE))
    pb.authStore.save(cookieData.token, cookieData.record)

    // reload authStore
    const authData = await pb.collection('users').authRefresh().catch((error) => {
      console.log('error')
      console.log(error)
    });

    // handle auth errors
    // TODO: handle auth errors

    // redirect to dashboard if logged in
    if (pb.authStore.isValid) {
      await router.push({path: '/dashboard'});
    }
  } catch (e) {
    console.log(e)
  }


})

</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.login form div {
  margin-bottom: 15px;
}

.login form label {
  display: block;
  margin-bottom: 5px;
}

.login form input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 2px solid #78b087;
}

.login form .error {
  color: red;
  margin-top: 5px;
}

.login form button {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background-color: #78b087;
  color: white;
  cursor: pointer;
}
</style>
