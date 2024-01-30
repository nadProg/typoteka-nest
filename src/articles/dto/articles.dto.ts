export class CreateArticleDto {
  title: string;
  content: string;
  image: string;
  authorId: string;
}

export class UpdateArticleDto {
  title: string;
  content: string;
  image: string;
}

export class FindAllArticlesParams {
  limit: number;
  offset: number;
}
