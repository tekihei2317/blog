// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: "tekihei2317's blog",
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'content/articles/**/*.md',
        typeName: 'Article'
      }
    },
    {
      use: 'gridsome-plugin-tailwindcss'
    }
  ],
  templates: {
    Article: [
      {
        path: '/articles/:id',
        component: './src/templates/Article.vue'
      }
    ]
  }
};
