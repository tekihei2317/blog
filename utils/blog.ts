const blogTitle = "tekiehei2317's blog";

export const getBlogTitle = (pageName: string = '') => {
  if (pageName === '') return blogTitle;
  return `${pageName} | ${blogTitle}`;
};
