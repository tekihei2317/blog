<template>
  <Layout>
    <div class="mt-4 flex justify-center">
      <div class="article-content bg-my-white p-4 rounded-lg">
        <h1 class="text-2xl font-bold">{{ $page.article.title }}</h1>
        <p class="text-sm mt-3">投稿日: {{ $page.article.createdAt }}</p>
        <article v-html="$page.article.content" />
      </div>
    </div>
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
    createdAt(format: "YYYY-MM-DD")
  }
}
</page-query>

<script>
export default {
  metaInfo() {
    return {
      title: this.$page.article.title
    };
  }
};
</script>

<style lang="scss" scoped>
.article-content {
  max-width: 800px;
}

article {
  /deep/ h2 {
    @apply text-2xl font-bold pb-2 mt-12 mb-8;
    border-bottom: 1.5px solid rgba(34, 40, 49, 0.16);
  }

  /deep/ h3 {
    @apply text-xl font-bold mt-8 mb-4;
  }

  /deep/ p {
    @apply mt-4;
  }

  /deep/ {
    th,
    td {
      border: 1px solid rgba(34, 40, 49, 0.16);
      @apply px-2 py-1;
    }
  }

  /deep/ {
    ul {
      @apply list-disc mt-4 ml-6;
    }

    li > ul {
      @apply mt-0;
    }

    li > p {
      @apply mt-0;
    }
  }

  /deep/ {
    a {
      color: #3f72af;
    }
  }

  /deep/ code {
    padding: 2px 4px;
    border-radius: 2px;
    font-size: 0.85rem;
  }
}
</style>
