import { Request, Response } from "express";
import { parseId } from "../middlewares/parseId";
import * as bookService from "../services/bookService";

export async function list(req: Request, res: Response) {
  res.json(await bookService.findAll());
}

export async function getById(req: Request, res: Response) {
  const id = parseId(req.params.id);
  res.json(await bookService.findById(id));
}

export async function create(req: Request, res: Response) {
  const book = await bookService.create(req.body);
  res.status(201).json(book);
}

export async function update(req: Request, res: Response) {
  const id = parseId(req.params.id);
  res.json(await bookService.update(id, req.body));
}

export async function remove(req: Request, res: Response) {
  const id = parseId(req.params.id);
  await bookService.remove(id);
  res.status(204).send();
}
