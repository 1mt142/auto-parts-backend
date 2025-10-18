import express from 'express';
import {
  createPart,
  updatePart,
  deletePart,
  getPartById,
  getParts,
} from '../controllers/parts';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';
import { validateRequest, validateQuery } from '../middlewares/validation';
import {
  createPartSchema,
  updatePartSchema,
  partsQuerySchema,
} from '../validators/parts';

import { upload } from '../config/multer';
import { handleUploadError } from '../middlewares/upload';

const router = express.Router();

router.get('/', validateQuery(partsQuerySchema), getParts);
router.get('/:id', getPartById);
router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  handleUploadError,
  validateRequest(createPartSchema),
  createPart
);
router.put(
  '/:id',
  authMiddleware,
  //   adminMiddleware,
  upload.single('image'),
  handleUploadError,
  validateRequest(updatePartSchema),
  updatePart
);
router.delete(
  '/:id',
  authMiddleware,
  // adminMiddleware,
  deletePart
);

export default router;
