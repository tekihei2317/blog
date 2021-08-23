<template>
  <Layout>
    <article v-html="$page.article.content" />
  </Layout>
</template>

<page-query>
query fetchArticle($id: ID!) {
  article(id: $id){
    id
    path
    title
    timeToRead
    content
  }
}
</page-query>

<script>
export default {};
</script>

<style lang="scss" scoped>
article {
  /deep/ h1,
  /deep/ h2,
  /deep/ h3 {
    margin-top: 12px;
  }

  /deep/ code {
    padding: 2px 4px;
    border-radius: 2px;
    font-size: 0.85rem;
  }

  /deep/ p {
    margin-top: 12px;
  }
  /deep/ li p {
    margin-top: 0px;
  }
}
</style>
