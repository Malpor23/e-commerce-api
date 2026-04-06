import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import {
  CreateOrderDto,
  OrderFilterDto,
  UpdateOrderStatusDto,
} from './dto/order.dto';
import { Product } from '@modules/products/entities/product.entity';
import { ProductVariant } from '@modules/products/entities/product-variant.entity';
import { CouponsService } from '@modules/coupons/coupons.service';
import { OrderCalculator } from './order-calculator';
import {
  PaginatedResponseDto,
  PaginationMetaDto,
} from '@common/dto/api-response.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,

    private readonly couponsService: CouponsService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(filter: OrderFilterDto): Promise<PaginatedResponseDto<Order>> {
    const qb = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.coupon', 'coupon')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('items.variant', 'variant')
      .orderBy('order.createdAt', 'DESC');

    if (filter.status) {
      qb.andWhere('order.status = :status', { status: filter.status });
    }
    if (filter.customerEmail) {
      qb.andWhere('LOWER(order.customerEmail) = LOWER(:email)', {
        email: filter.customerEmail,
      });
    }

    const [data, total] = await qb
      .skip(filter.skip)
      .take(filter.limit)
      .getManyAndCount();

    return new PaginatedResponseDto(
      data,
      new PaginationMetaDto(filter.page, filter.limit, total),
    );
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: {
        coupon: true,
        items: { product: true, variant: true },
      },
    });
    if (!order) throw new NotFoundException(`Order with id "${id}" not found`);
    return order;
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const resolvedItems = await this.resolveLineItems(dto.items);

    this.assertSufficientStock(resolvedItems);

    const lineItems = resolvedItems.map(({ product, variant, quantity }) => ({
      product,
      variant: variant ?? null,
      quantity,
      unitPrice: Number(variant?.price ?? product.basePrice),
    }));

    const rawSubtotal = lineItems.reduce(
      (acc, i) => acc + i.unitPrice * i.quantity,
      0,
    );
    const coupon = dto.couponCode
      ? await this.couponsService.validate(dto.couponCode, rawSubtotal)
      : null;

    const pricing = OrderCalculator.calculate(lineItems, coupon);

    const order = await this.dataSource.transaction(async (manager) => {
      // Decrement stock
      for (const { product, variant, quantity } of resolvedItems) {
        if (variant) {
          await manager.decrement(
            ProductVariant,
            { id: variant.id },
            'stock',
            quantity,
          );
        } else {
          await manager.decrement(
            Product,
            { id: product.id },
            'stock',
            quantity,
          );
        }
      }

      // Build order aggregate
      const newOrder = manager.create(Order, {
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        shippingAddress: dto.shippingAddress,
        subtotal: pricing.subtotal,
        discountAmount: pricing.discountAmount,
        total: pricing.total,
        coupon,
        items: lineItems.map(({ product, variant, quantity, unitPrice }) =>
          manager.create(OrderItem, {
            product,
            variant,
            quantity,
            unitPrice,
            total: OrderCalculator['round'](unitPrice * quantity),
          }),
        ),
      });

      return manager.save(Order, newOrder);
    });

    if (coupon) {
      await this.couponsService.incrementUsage(coupon.id);
    }

    return this.findOne(order.id);
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findOne(id);
    order.status = dto.status;
    await this.orderRepo.save(order);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepo.remove(order);
  }

  private async resolveLineItems(items: CreateOrderDto['items']): Promise<
    Array<{
      product: Product;
      variant: ProductVariant | null;
      quantity: number;
    }>
  > {
    return Promise.all(
      items.map(async ({ productId, variantId, quantity }) => {
        const product = await this.productRepo.findOneBy({ id: productId });
        if (!product) {
          throw new NotFoundException(`Product "${productId}" not found`);
        }
        if (!product.isActive) {
          throw new BadRequestException(
            `Product "${product.name}" is not available`,
          );
        }

        let variant: ProductVariant | null = null;
        if (variantId) {
          variant = await this.variantRepo.findOne({
            where: { id: variantId, product: { id: productId } },
          });
          if (!variant) {
            throw new NotFoundException(
              `Variant "${variantId}" not found for product "${productId}"`,
            );
          }
        }

        return { product, variant, quantity };
      }),
    );
  }

  private assertSufficientStock(
    items: Array<{
      product: Product;
      variant: ProductVariant | null;
      quantity: number;
    }>,
  ): void {
    for (const { product, variant, quantity } of items) {
      const available = variant ? variant.stock : product.stock;
      const label = variant
        ? `${product.name} – ${variant.name}`
        : product.name;

      if (available < quantity) {
        throw new BadRequestException(
          `Insufficient stock for "${label}". Available: ${available}, requested: ${quantity}`,
        );
      }
    }
  }
}
