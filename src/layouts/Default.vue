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
    <div class="pixela-graph mt-8 mx-auto bg-my-white p-4 pb-8 rounded-lg">
      <p class="text-lg">投稿数</p>
      <div class="graph-container overflow-x-hidden">
        <iframe
          src="https://pixe.la/v1/users/tekihei2317/graphs/post-count-graph.html?mode=simple"
          class="mt-2 border border-gray-200"
        ></iframe>
      </div>
    </div>
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

.pixela-graph {
  max-width: 800px;

  iframe {
    height: 168px;
    width: 768px;
  }
}
</style>
