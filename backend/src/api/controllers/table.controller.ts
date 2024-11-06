import { Request, Response } from 'express';

import prisma from '@prisma-instance';

/**
 * Controller to get all tables
 * @async
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} The response object
 */
export async function getTables(req: Request, res: Response): Promise<void> {
  const tables = await prisma.table.findMany();

  res.json(tables);
}

/**
 * Controller to get a table by id
 * @async
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} The response object
 */
export async function getTable(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const table = await prisma.table.findUnique({ where: { id } });

  res.json(table);
}
