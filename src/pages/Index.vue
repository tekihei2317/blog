<template>
  <Layout>
    <div class="articles mt-4 mx-auto bg-my-white p-4 rounded-lg">
      <h1 class="text-2xl font-bold">記事一覧</h1>
      <div class="mt-8">
        <article v-for="edge in $page.articles.edges" :key="edge.node.id">
          <h2 class="text-xl font-bold hover:opacity-60">
            <g-link :to="edge.node.path">{{ edge.node.title }}</g-link>
          </h2>
          <p class="mt-1 text-sm">{{ edge.node.createdAt }}</p>
          <div class="my-4">{{ edge.node.excerpt }}</div>
          <g-link :to="edge.node.path" class="border-b border-my-black hover:opacity-60">全文を読む→</g-link>
        </article>
      </div>
    </div>
  </Layout>
</template>

<page-query>
query fetchAllPost {
  articles: allArticle(sortBy: "createdAt") {
    edges {
      node {
        id
        content
        path
        title
        excerpt
        createdAt(format: "YYYY-MM-DD")
      }
    }
  }
}
</page-query>

<script>
export default {
  metaInfo: {
    title: '記事一覧'
  }
};
</script>

<style scoped>
.articles {
  max-width: 800px;
}

article:not(:first-of-type) {
  margin-top: 32px;
}
</style>
