<template>
  <div class="px-4 pb-24 bg-my-black min-h-screen">
    <header class="header">
      <strong>
        <g-link to="/" class="text-2xl text-my-white">{{ $static.metadata.siteName }}</g-link>
      </strong>
      <nav class="nav">
        <!-- TODO: -->
        <!-- <g-link class="nav__link" to="/about/">About</g-link> -->
      </nav>
    </header>
    <slot />
  </div>
</template>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}

.nav__link {
  margin-left: 20px;
}
</style>
