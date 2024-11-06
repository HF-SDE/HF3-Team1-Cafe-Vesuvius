import { NextFunction, Request, Response } from 'express';

import prisma from '@prisma-instance';

export async function getTables(req: Request, res: Response) {
  const tables = await prisma.table.findMany();

  res.json(tables);
}

export async function getTable(req: Request, res: Response) {
  const { id } = req.params;

  const table = await prisma.table.findUnique({ where: { id } });

  res.json(table);
}
