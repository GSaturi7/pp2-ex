import { Request, Response } from "express";
import { parseId } from "../middlewares/parseId";
import * as genreService from "../services/genreService";

export async function list(req: Request, res: Response) {
  res.json(await genreService.findAll());
}

export async function getById(req: Request, res: Response) {
  const id = parseId(req.params.id);
  res.json(await genreService.findById(id));
}

export async function create(req: Request, res: Response) {
  const genre = await genreService.create(req.body);
  res.status(201).json(genre);
}

export async function update(req: Request, res: Response) {
  const id = parseId(req.params.id);
  res.json(await genreService.update(id, req.body));
}

export async function remove(req: Request, res: Response) {
  const id = parseId(req.params.id);
  await genreService.remove(id);
  res.status(204).send();
}
