import { prisma } from "../config/prisma";
import { CreateBookDTO, UpdateBookDTO } from "../types/book";

export function findAll() {
  return prisma.book.findMany({
    include: { genre: true },
    orderBy: { id: "asc" },
  });
}

export function findById(id: number) {
  return prisma.book.findUnique({
    where: { id },
    include: { genre: true },
  });
}

export function create(data: CreateBookDTO) {
  return prisma.book.create({ data });
}

export function update(id: number, data: UpdateBookDTO) {
  return prisma.book.update({ where: { id }, data });
}

export function remove(id: number) {
  return prisma.book.delete({ where: { id } });
}
