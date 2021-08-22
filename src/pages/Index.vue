<template>
  <Layout>
    <h1>記事一覧</h1>
    <article v-for="edge in $page.articles.edges" :key="edge.node.id">
      <p class="post-date">2021-08-22</p>
      <h2 class="article-title">
        <g-link :to="edge.node.path">{{ edge.node.title }}</g-link>
      </h2>
      <div>
        {{ edge.node.excerpt }}
      </div>
    </article>
  </Layout>
</template>

<page-query>
query fetchAllPost {
  articles: allArticle {
    edges {
      node {
        id
        content
        path
        title
        excerpt
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

<style scoped>
article:not(:first-of-type) {
  margin-top: 32px;
}

.post-date {
  font-size: 1.1rem;
  color: #636e7d;
}

.article-title {
  margin-top: 12px;
}
</style>
