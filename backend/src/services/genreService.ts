import { AppError } from "../middlewares/AppError";
import * as genreRepository from "../repositories/genreRepository";
import { CreateGenreDTO, UpdateGenreDTO } from "../types/genre";

export function findAll() {
  return genreRepository.findAll();
}

export function create(data: CreateGenreDTO) {
  if (!data.name) {
    throw new AppError("Nome é obrigatório", 400);
  }
  return genreRepository.create(data);
}

export async function findById(id: number) {
  const genre = await genreRepository.findById(id);

  if (!genre) {
    throw new AppError("Gênero não encontrado", 404);
  }

  return genre;
}

export async function update(id: number, data: UpdateGenreDTO) {
  await findById(id);

  if (data.name !== undefined && !data.name) {
    throw new AppError("Nome é obrigatório", 400);
  }

  return genreRepository.update(id, data);
}

export async function remove(id: number) {
  await findById(id);
  return genreRepository.remove(id);
}
