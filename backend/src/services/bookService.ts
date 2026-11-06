import { AppError } from "../middlewares/AppError";
import * as bookRepository from "../repositories/bookRepository";
import { CreateBookDTO, UpdateBookDTO } from "../types/book";
import * as genreService from "./genreService";

export function findAll() {
  return bookRepository.findAll();
}

export async function create(data: CreateBookDTO) {
  if (!data.title) {
    throw new AppError("Título é obrigatório", 400);
  }

  if (!data.author) {
    throw new AppError("Autor é obrigatório", 400);
  }

  if (data.pages !== undefined && (!Number.isInteger(data.pages) || data.pages <= 0)) {
    throw new AppError("Número de páginas inválido", 400);
  }

  if (data.genreId) {
    await genreService.findById(data.genreId);
  }

  return bookRepository.create(data);
}

export async function findById(id: number) {
  const book = await bookRepository.findById(id);

  if (!book) {
    throw new AppError("Livro não encontrado", 404);
  }

  return book;
}

export async function update(id: number, data: UpdateBookDTO) {
  await findById(id); // atualiza apenas se o livro existir

  if (data.title !== undefined && !data.title) {
    throw new AppError("Título é obrigatório", 400);
  }

  if (data.author !== undefined && !data.author) {
    throw new AppError("Autor é obrigatório", 400);
  }

  if (data.pages != null && (!Number.isInteger(data.pages) || data.pages <= 0)) {
    throw new AppError("Número de páginas inválido", 400);
  }

  if (data.genreId != null) {
    await genreService.findById(data.genreId);
  }

  return bookRepository.update(id, data);
}

export async function remove(id: number) {
  await findById(id); // remove apenas se o livro existir
  return bookRepository.remove(id);
}
