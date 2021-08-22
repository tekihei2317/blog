<template>
  <Layout>
    <div v-html="$page.article.content" />
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

<style></style>
