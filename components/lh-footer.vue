<template>
  <footer class="footer">
    <div class="copyright">
      <p>© 2023 Your Name. All rights reserved.</p>
    </div>
    <div class="social-media">
      <a href="#">Twitter</a>
      <a href="#">Facebook</a>
      <a href="#">Instagram</a>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
}
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #13201d;
  padding: 20px;
  color: #fafafa;
}

.social-media a {
  margin-left: 15px;
}
</style>
