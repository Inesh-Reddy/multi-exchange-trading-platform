import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import {
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  Min,
  Max,
  MaxLength,
} from "class-validator";
import { Exchange } from "./Exchange.entity";

@Entity("trading_pairs")
@Index(["exchangeId", "symbol"], { unique: true })
@Index(["exchangeId"])
@Index(["symbol"])
@Index(["isActive"])
export class TradingPair {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "exchange_id" })
  exchangeId: string;

  @Column({ type: "varchar", length: 20 })
  @IsString()
  @MaxLength(20)
  symbol: string; // "BTCUSDT"

  @Column({ type: "varchar", length: 10, name: "base_asset" })
  @IsString()
  @MaxLength(10)
  baseAsset: string; // "BTC"

  @Column({ type: "varchar", length: 10, name: "quote_asset" })
  @IsString()
  @MaxLength(10)
  quoteAsset: string; // "USDT"

  @Column({ type: "boolean", default: true, name: "is_active" })
  @IsBoolean()
  isActive: boolean;

  @Column({
    type: "decimal",
    precision: 20,
    scale: 8,
    nullable: true,
    name: "min_order_size",
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderSize?: number;

  @Column({
    type: "decimal",
    precision: 20,
    scale: 8,
    nullable: true,
    name: "max_order_size",
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxOrderSize?: number;

  @Column({ type: "integer", default: 8, name: "price_precision" })
  @IsNumber()
  @Min(0)
  @Max(18)
  pricePrecision: number;

  @Column({ type: "integer", default: 8, name: "quantity_precision" })
  @IsNumber()
  @Min(0)
  @Max(18)
  quantityPrecision: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Exchange, (exchange) => exchange.tradingPairs, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "exchange_id" })
  exchange: Exchange;
}
