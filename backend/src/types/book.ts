export interface CreateBookDTO {
  title: string;
  author: string;
  pages?: number;
  genreId?: number;
}

export interface UpdateBookDTO {
  title?: string;
  author?: string;
  pages?: number | null;
  read?: boolean;
  genreId?: number | null;
}
