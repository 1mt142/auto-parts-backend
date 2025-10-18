import { prisma } from '../config/prisma';
import { ApiError, errorMessages } from '../utils/errors';
import { Decimal } from '@prisma/client/runtime/library';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary';

interface CreatePartInput {
  name: string;
  brand: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  image_url?: string;
}

interface UpdatePartInput extends Partial<CreatePartInput> {}

interface PartsQueryInput {
  q?: string;
  category?: string;
  name?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  page: number;
  limit: number;
}

export class PartsService {
  async createPart(data: CreatePartInput, imageFile?: Express.Multer.File) {
    let imageUrl: string | null = null;

    if (imageFile) {
      imageUrl = await uploadToCloudinary(
        imageFile.buffer,
        imageFile.originalname
      );
    }

    return prisma.part.create({
      data: {
        ...data,
        price: new Decimal(data.price),
        image_url: imageUrl,
      },
    });
  }

  // async updatePart(
  //   partId: string,
  //   data: UpdatePartInput,
  //   imageFile?: Express.Multer.File
  // ) {
  //   const part = await prisma.part.findUnique({ where: { id: partId } });

  //   if (!part) {
  //     throw new ApiError(404, errorMessages.PART_NOT_FOUND);
  //   }

  //   let imageUrl = part.image_url;

  //   if (imageFile) {
  //     if (part.image_url) {
  //       await deleteFromCloudinary(part.image_url);
  //     }
  //     imageUrl = await uploadToCloudinary(
  //       imageFile.buffer,
  //       imageFile.originalname
  //     );
  //   }

  //   return prisma.part.update({
  //     where: { id: partId },
  //     data: {
  //       ...data,
  //       price: data.price ? new Decimal(data.price) : undefined,
  //       image_url: imageUrl,
  //     },
  //   });
  // }

  async updatePart(
    partId: string,
    data: UpdatePartInput,
    imageFile?: Express.Multer.File
  ) {
    try {
      // 1. Find existing part
      const part = await prisma.part.findUnique({ where: { id: partId } });

      if (!part) {
        throw new ApiError(404, errorMessages.PART_NOT_FOUND);
      }

      let imageUrl = part.image_url;

      // 2. Handle image upload
      if (imageFile) {
        try {
          // Delete old image from Cloudinary
          if (part.image_url) {
            await deleteFromCloudinary(part.image_url);
          }

          // Upload new image
          imageUrl = await uploadToCloudinary(
            imageFile.buffer,
            imageFile.originalname
          );
        } catch (uploadError) {
          throw new ApiError(400, 'Failed to upload image. Please try again.');
        }
      }

      // 3. Prepare update data
      const updateData: any = {
        ...data,
      };

      // Only update price if provided
      if (data.price !== undefined && data.price !== null) {
        updateData.price = new Decimal(data.price);
      }

      // Only update image if new one was uploaded
      if (imageFile) {
        updateData.image_url = imageUrl;
      }

      // 4. Update part in database
      const updatedPart = await prisma.part.update({
        where: { id: partId },
        data: updateData,
      });

      return updatedPart;
    } catch (error) {
      throw error;
    }
  }

  async deletePart(partId: string) {
    const part = await prisma.part.findUnique({ where: { id: partId } });

    if (!part) {
      throw new ApiError(404, errorMessages.PART_NOT_FOUND);
    }

    if (part.image_url) {
      await deleteFromCloudinary(part.image_url);
    }

    return prisma.part.delete({ where: { id: partId } });
  }

  async getPartById(partId: string) {
    const part = await prisma.part.findUnique({ where: { id: partId } });

    if (!part) {
      throw new ApiError(404, errorMessages.PART_NOT_FOUND);
    }

    return part;
  }

  async getParts(query: PartsQueryInput) {
    let { q, category, minPrice, maxPrice, page, limit } = query;

    // Normalize empty strings to undefined
    if (q === '') q = undefined;
    if (category === '') category = undefined;

    const where: any = {};

    if (q) {
      where.OR = [
        { name: { contains: q } },
        { brand: { contains: q } },
        { category: { contains: q } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = new Decimal(minPrice);
      }
      if (maxPrice !== undefined) {
        where.price.lte = new Decimal(maxPrice);
      }
    }

    const skip = (page - 1) * limit;

    const [parts, total] = await Promise.all([
      prisma.part.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.part.count({ where }),
    ]);

    return {
      parts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updateStock(partId: string, quantity: number) {
    const part = await prisma.part.findUnique({ where: { id: partId } });

    if (!part) {
      throw new ApiError(404, errorMessages.PART_NOT_FOUND);
    }

    const newStock = part.stock + quantity;

    if (newStock < 0) {
      throw new ApiError(400, errorMessages.INSUFFICIENT_STOCK);
    }

    return prisma.part.update({
      where: { id: partId },
      data: { stock: newStock },
    });
  }
}

export const partsService = new PartsService();
