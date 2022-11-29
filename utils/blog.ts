import { format } from 'date-fns';

const blogTitle = "tekiehei2317's blog";

export const getBlogTitle = (pageName: string = '') => {
  if (pageName === '') return blogTitle;
  return `${pageName} | ${blogTitle}`;
};

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
