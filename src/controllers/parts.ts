import { Request, Response } from 'express';
import { partsService } from '../services/parts';
import { asyncHandler } from '../middlewares/error';

export const createPart = asyncHandler(async (req: Request, res: Response) => {
  const part = await partsService.createPart(req.body, req.file);

  res.status(201).json({
    success: true,
    message: 'Part created successfully',
    data: part,
  });
});

export const updatePart = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const part = await partsService.updatePart(id, req.body, req.file);

  res.status(200).json({
    success: true,
    message: 'Part updated successfully',
    data: part,
  });
});

export const deletePart = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await partsService.deletePart(id);

  res.status(200).json({
    success: true,
    message: 'Part deleted successfully',
  });
});

export const getPartById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const part = await partsService.getPartById(id);

  res.status(200).json({
    success: true,
    data: part,
  });
});

export const getParts = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, ...rest } = req.query;

  const pageNum = Number(Array.isArray(page) ? page[0] : page) || 1;
  const limitNum = Number(Array.isArray(limit) ? limit[0] : limit) || 10;

  const query = {
    page: pageNum,
    limit: limitNum,
    ...rest,
  } as any;

  const result = await partsService.getParts(query);

  res.status(200).json({
    success: true,
    data: result,
  });
});
