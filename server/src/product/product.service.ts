import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { contents, thumbImage, images, ...productData } = createProductDto;
  
    return await this.prisma.product.create({
      data: {
        ...productData,
        productContent: contents?.length
          ? {
              create: contents,
            }
          : undefined,
        thumbImageId: thumbImage?.id,
        images: images?.length
          ? {
              connect: images.map((media) => ({ id: media.id })),
            }
          : undefined,
      },
      include: {
        productContent: true,
        categoryProducts: true,
        thumbImage: true,
      },
    });
  }

  async findAll(page?: number, limit?: number) {
    const skip = (page - 1) * limit;
    const products = await this.prisma.product.findMany({
      skip, 
      take: limit,
      where: {},
      include: {
        productContent: true,
        categoryProducts: true,
        thumbImage: true,
        images: true
      }
    })
    const totalProduct = await this.prisma.product.count();

    return {
      products,
      totalProduct,
      totalPage: Math.ceil(totalProduct / limit)
    };
  }

  async findOne(id: number) {
    return await this.prisma.product.findFirst({
      where: {id},
      include: {
        productContent: true,
        categoryProducts: true,
        images: true,
        thumbImage: true
      }
    })
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        productContent: {
          some: {
            slug
          }
        }
      },
      include: {
        productContent: true,
        categoryProducts: true,
        images: true,
        thumbImage: true
      }
    })
    console.log(product, slug)
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const {contents, thumbImage, images, ...productData} = updateProductDto;
    const product = await this.prisma.product.update({
      where: {id},
      data: {
        ...productData,
        productContent: contents ? {
          upsert: contents.map((content) => ({
            where: { 
              langId_productId: {
                langId: content.langId,
                productId: id
              } 
            },
            update: {
              title: content.title,
              description: content.description,
              slug: content.slug,
            },
            create: {
              title: content.title,
              description: content.description,
              slug: content.slug,
              langId: content.langId
            },
          })),
        } : undefined
      },
      include: {
        productContent: true,
        categoryProducts: true,
        thumbImage: true
      }
    });
    return product;
  }

  async remove(id: number) {
    return await this.prisma.product.delete({
      where: {id}
    });
  }
}
