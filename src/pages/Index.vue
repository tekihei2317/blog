<template>
  <Layout>
    <h1>記事一覧</h1>
    <article v-for="edge in $page.articles.edges" :key="edge.node.id">
      <ul>
        <li>
          <g-link :to="edge.node.path">{{ edge.node.title }}</g-link>
        </li>
      </ul>
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
        title
      }
    }
  }
}
</page-query>

<script>
export default {
  metaInfo: {
    title: "記事一覧",
  },
};
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>
