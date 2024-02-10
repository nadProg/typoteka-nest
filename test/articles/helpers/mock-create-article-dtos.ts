import { CreateArticleDto } from '../../../src/articles/dto/create-article.dto';

export const mockCreateArticleDtos: CreateArticleDto[] = [
  {
    title: 'article 1',
    content: 'content',
    announce: 'announce',
    image: 'image',
  },
  {
    title: 'article 2',
    content: 'content',
    announce: 'announce',
  },
  {
    title: 'article 3',
    announce: 'announce',
  },
];
