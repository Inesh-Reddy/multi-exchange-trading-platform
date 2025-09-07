import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
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
import { Order } from "./Order.entity";
import { Exchange } from "./Exchange.entity";
import { TransactionType } from "../enums";

@Entity("transactions")
@Index(["userId"])
@Index(["portfolioId"])
@Index(["orderId"])
@Index(["type"])
@Index(["createdAt"])
@Index(["userId", "type", "createdAt"])
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "user_id" })
  userId: string;

  @Column({ type: "uuid", name: "portfolio_id" })
  portfolioId: string;

  @Column({ type: "uuid", nullable: true, name: "order_id" })
  @IsOptional()
  orderId?: string;

  @Column({ type: "uuid", name: "exchange_id" })
  exchangeId: string;

  @Column({ type: "enum", enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;

  @Column({ type: "varchar", length: 20, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  symbol?: string;

  @Column({ type: "decimal", precision: 20, scale: 8 })
  @IsNumber()
  quantity: number;

  @Column({ type: "decimal", precision: 20, scale: 8, nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @Column({ type: "decimal", precision: 20, scale: 8 })
  @IsNumber()
  amount: number; // quantity * price

  @Column({ type: "decimal", precision: 20, scale: 8, default: 0 })
  @IsNumber()
  @Min(0)
  fee: number;

  @Column({ type: "varchar", length: 10, nullable: true, name: "fee_asset" })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  feeAsset?: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
    name: "transaction_hash",
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  transactionHash?: string; // Blockchain tx hash if applicable

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.transactions)
  @JoinColumn({ name: "portfolio_id" })
  portfolio: Portfolio;

  @ManyToOne(() => Order, (order) => order.transactions, {
    nullable: true,
  })
  @JoinColumn({ name: "order_id" })
  order?: Order;

  @ManyToOne(() => Exchange, (exchange) => exchange.transactions)
  @JoinColumn({ name: "exchange_id" })
  exchange: Exchange;

  // Virtual properties
  get netAmount(): number {
    // Amount after fees
    return this.type === TransactionType.BUY
      ? this.amount + this.fee
      : this.amount - this.fee;
  }

  get effectivePrice(): number {
    return this.quantity > 0 ? this.amount / this.quantity : 0;
  }
}
