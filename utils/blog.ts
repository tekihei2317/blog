import { format } from 'date-fns';

export const blogTitle = "tekiehei2317's blog";
export const blogUrl = 'https://blog.tekihei2317.com';

export const getBlogTitle = (pageName: string = '') => {
  if (pageName === '') return blogTitle;
  return `${pageName} | ${blogTitle}`;
};

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
