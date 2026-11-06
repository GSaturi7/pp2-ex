export interface Genre {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  pages: number | null;
  read: boolean;
  createdAt: string;
  genreId: number | null;
  genre?: Genre | null;
}

export interface NovoLivro {
  title: string;
  author: string;
  pages?: number;
  read?: boolean;
  genreId?: number;
}

export interface AtualizaLivro {
  title?: string;
  author?: string;
  pages?: number | null;
  read?: boolean;
  genreId?: number | null;
}
