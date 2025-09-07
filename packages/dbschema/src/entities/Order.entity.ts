import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from "typeorm";
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  MaxLength,
  Min,
} from "class-validator";
import { User } from "./User.entity";
import { Portfolio } from "./Portfolio.entity";
import { Exchange } from "./Exchange.entity";
import { Transaction } from "./Transaction.entity";
import { OrderType, OrderSide, OrderStatus } from "../enums";

@Entity("orders")
@Index(["userId"])
@Index(["portfolioId"])
@Index(["status"])
@Index(["symbol"])
@Index(["createdAt"])
@Index(["exchangeOrderId"])
@Index(["userId", "status", "createdAt"])
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "user_id" })
  userId: string;

  @Column({ type: "uuid", name: "portfolio_id" })
  portfolioId: string;

  @Column({ type: "uuid", name: "exchange_id" })
  exchangeId: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
    name: "exchange_order_id",
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  exchangeOrderId?: string;

  @Column({ type: "varchar", length: 20 })
  @IsString()
  @MaxLength(20)
  symbol: string;

  @Column({ type: "enum", enum: OrderType })
  @IsEnum(OrderType)
  type: OrderType;

  @Column({ type: "enum", enum: OrderSide })
  @IsEnum(OrderSide)
  side: OrderSide;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @Column({ type: "decimal", precision: 20, scale: 8 })
  @IsNumber()
  @Min(0)
  quantity: number;

  @Column({
    type: "decimal",
    precision: 20,
    scale: 8,
    default: 0,
    name: "filled_quantity",
  })
  @IsNumber()
  @Min(0)
  filledQuantity: number;

  @Column({ type: "decimal", precision: 20, scale: 8, nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number; // NULL for market orders

  @Column({
    type: "decimal",
    precision: 20,
    scale: 8,
    nullable: true,
    name: "stop_price",
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stopPrice?: number;

  @Column({
    type: "decimal",
    precision: 20,
    scale: 8,
    nullable: true,
    name: "average_fill_price",
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  averageFillPrice?: number;

  @Column({ type: "decimal", precision: 20, scale: 8, default: 0 })
  @IsNumber()
  @Min(0)
  fee: number;

  @Column({ type: "varchar", length: 10, nullable: true, name: "fee_asset" })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  feeAsset?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true, name: "filled_at" })
  filledAt?: Date;

  @Column({ type: "timestamp", nullable: true, name: "cancelled_at" })
  cancelledAt?: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.orders)
  @JoinColumn({ name: "portfolio_id" })
  portfolio: Portfolio;

  @ManyToOne(() => Exchange, (exchange) => exchange.orders)
  @JoinColumn({ name: "exchange_id" })
  exchange: Exchange;

  @OneToMany(() => Transaction, (transaction) => transaction.order)
  transactions: Transaction[];

  // Virtual properties
  get remainingQuantity(): number {
    return this.quantity - this.filledQuantity;
  }

  get fillPercentage(): number {
    return this.quantity > 0 ? (this.filledQuantity / this.quantity) * 100 : 0;
  }

  get isPartiallyFilled(): boolean {
    return this.filledQuantity > 0 && this.filledQuantity < this.quantity;
  }

  get isFullyFilled(): boolean {
    return this.filledQuantity >= this.quantity;
  }

  get totalValue(): number {
    const effectivePrice = this.averageFillPrice || this.price || 0;
    return this.filledQuantity * effectivePrice;
  }
}
