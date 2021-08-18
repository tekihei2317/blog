<template>
  <Layout>
    <h1>ブログ</h1>
    <article v-for="edge in $page.articles.edges" :key="edge.node.id">
      <div v-html="edge.node.content" />
    </article>
  </Layout>
</template>

<page-query>
query fetchAllPost {
  articles: allArticle {
    totalCount
    edges {
      node {
        id
        content
        path
      }
    }
  }
}
</page-query>

<script>
export default {
  metaInfo: {
    title: "Hello, world!",
  },
};
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>
