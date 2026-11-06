import { prisma } from "../config/prisma";
import { CreateGenreDTO, UpdateGenreDTO } from "../types/genre";

export function findAll() {
  return prisma.genre.findMany({ orderBy: { id: "asc" } });
}

export function findById(id: number) {
  return prisma.genre.findUnique({ where: { id } });
}

export function create(data: CreateGenreDTO) {
  return prisma.genre.create({ data });
}

export function update(id: number, data: UpdateGenreDTO) {
  return prisma.genre.update({ where: { id }, data });
}

export function remove(id: number) {
  return prisma.genre.delete({ where: { id } });
}
