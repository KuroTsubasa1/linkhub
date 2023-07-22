<template>
  <header class="header">
    <div class="logo">
      <h1><NuxtLink to="/">Link H.U.B</NuxtLink></h1>
    </div>
    <nav class="navigation" :class="{ 'compressed': isCompressed, 'is-open': isOpen }">
      <ul class="desktop-menu" v-if="!isCompressed">
        <li><NuxtLink to="/">Home</NuxtLink></li>
        <li v-if="pb.authStore.isValid" ><NuxtLink to="/dashboard">Dashboard</NuxtLink></li>
        <li v-if="pb.authStore.isValid" ><NuxtLink to="/logout">Logout</NuxtLink></li>
        <li v-if="!pb.authStore.isValid"><NuxtLink to="/login">Login</NuxtLink></li>
        <li v-if="!pb.authStore.isValid"><NuxtLink to="/register">Register</NuxtLink></li>
      </ul>
      <div class="hamburger" @click="isOpen = !isOpen">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul class="mobile-menu" v-if="isOpen">
        <li><NuxtLink to="/">Home</NuxtLink></li>
        <li v-if="pb.authStore.isValid" ><NuxtLink to="/dashboard">Dashboard</NuxtLink></li>
        <li v-if="pb.authStore.isValid" ><NuxtLink to="/logout">Logout</NuxtLink></li>
        <li v-if="!pb.authStore.isValid"><NuxtLink to="/login">Login</NuxtLink></li>
        <li v-if="!pb.authStore.isValid"><NuxtLink to="/register">Register</NuxtLink></li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import PocketBase from 'pocketbase'
import session_helper from "~/utils/session_helper";
const router = useRouter();

  const props = defineProps({
    logged_id: {
      type: Boolean,
      default: false,
    },
  })


    const pb = new PocketBase(import.meta.env.VITE_API_URL);
    const isCompressed = ref(false);
    const isOpen = ref(false);

    const checkViewportSize = () => {
      isCompressed.value = window.innerWidth <= 768; // Adjust the breakpoint as needed
    };

    const toggleMenu = () => {
      isOpen.value = !isOpen.value;
    };

    onMounted(async () => {
      checkViewportSize();
      window.addEventListener('resize', checkViewportSize);

      // load cookie data manually and set it to authStore

      let cookieData = {token: '', record: {}}; // default
      try {
        cookieData = JSON.parse(session_helper.getCookie(import.meta.env.VITE_AUTH_COOKIE))
        pb.authStore.save(cookieData.token, cookieData.record)

        // reload authStore
        const authData = await pb.collection('users').authRefresh().catch((error) => {
        });

        // handle auth errors
        // TODO: handle auth errors

        // refresh page to update nav  if logged in
        if (pb.authStore.isValid) {
          // get current path
          await router.push({path: router.currentRoute.value.path});
        }
      } catch (e) {

      }


    });

    onUnmounted(() => {
      window.removeEventListener('resize', checkViewportSize);
    });

</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #13201d;
  padding: 20px;
  color: #fafafa;
}

.logo h1 {
  margin: 0;
}

.navigation {
  position: relative;
}

.navigation ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
}

.navigation ul li {
  margin-left: 15px;
}

.compressed .desktop-menu {
  display: none;
}

.compressed.is-open .navigation {
  flex-direction: column;
  align-items: center;
}

.compressed.is-open .mobile-menu {
  display: flex;
  flex-direction: column;
  align-items: center;

  justify-content: center;
  background-color: #13201d;
  padding: 20px;
  position: absolute;
  top: 100%;
  left: -200%;
  transform: translateX(-50%);
  width: 150px;
  z-index: 1;
  transition: transform 0.3s ease;
}

.compressed.is-open .mobile-menu.is-open {
  transform: translateY(0);
}

.compressed.is-open .mobile-menu li {
  margin: 10px 0;
  white-space: nowrap;
  position: relative;
}

.hamburger {
  display: none;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  cursor: pointer;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 2px;
  background-color: #fafafa;
  transition: transform 0.3s ease;
}

.compressed .hamburger {
  display: flex;
}

.is-open .hamburger span:nth-child(1) {
  transform: rotate(-45deg) translate(-5px, 6px);
}

.is-open .hamburger span:nth-child(2) {
  opacity: 0;
}

.is-open .hamburger span:nth-child(3) {
  transform: rotate(45deg) translate(-5px, -6px);
}

@media (max-width: 768px) {
  .desktop-menu {
    display: none;
  }

  .navigation.is-open {
    position: relative;
  }

  .hamburger {
    display: flex;
  }

  .mobile-menu {
    display: none;
  }

  .navigation.is-open .mobile-menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #13201d;
    padding: 20px;
    position: absolute;
    top: 100%;
    left: -200%;
    transform: translateX(-50%);
    width: 150px;
    z-index: 1;
    transition: transform 0.3s ease;
  }

  .navigation.is-open .mobile-menu li {
    margin: 10px 0;
    padding: 5px 0;
    text-align: center;
    white-space: nowrap;
    position: relative;
  }

  .navigation.is-open .mobile-menu li:not(:last-child) {
    padding-top: 10px;
  }
}

@media (min-width: 769px) {
  .header {
    padding: 20px 40px;
  }

  .navigation {
    position: static;
  }

  .navigation ul {
    flex-direction: row;
  }

  .navigation ul li {
    margin-left: 30px;
  }

  .navigation .mobile-menu {
    display: none;
  }

  .compressed .desktop-menu {
    display: flex;
  }
}
</style>








