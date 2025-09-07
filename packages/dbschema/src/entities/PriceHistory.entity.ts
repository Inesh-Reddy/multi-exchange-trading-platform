import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { IsString, IsNumber, IsEnum, MaxLength, Min } from "class-validator";
import { Exchange } from "./Exchange.entity";
import { Timeframe } from "../enums";

@Entity("price_history")
@Index(["exchangeId", "symbol", "timeframe", "timestamp"], { unique: true })
@Index(["symbol", "timeframe", "timestamp"])
@Index(["exchangeId", "timeframe", "timestamp"])
export class PriceHistory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "exchange_id" })
  exchangeId: string;

  @Column({ type: "varchar", length: 20 })
  @IsString()
  @MaxLength(20)
  symbol: string;

  @Column({ type: "enum", enum: Timeframe })
  @IsEnum(Timeframe)
  timeframe: Timeframe;

  @Column({
    type: "decimal",
    precision: 20,
    scale: 8,
    name: "open_price",
  })
  @IsNumber()
  @Min(0)
  openPrice: number;

  @Column({
    type: "decimal",
    precision: 20,
    scale: 8,
    name: "high_price",
  })
  @IsNumber()
  @Min(0)
  highPrice: number;

  @Column({
    type: "decimal",
    precision: 20,
    scale: 8,
    name: "low_price",
  })
  @IsNumber()
  @Min(0)
  lowPrice: number;

  @Column({
    type: "decimal",
    precision: 20,
    scale: 8,
    name: "close_price",
  })
  @IsNumber()
  @Min(0)
  closePrice: number;

  @Column({ type: "decimal", precision: 20, scale: 8 })
  @IsNumber()
  @Min(0)
  volume: number;

  @Column({ type: "timestamp" })
  timestamp: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  // Relationships
  @ManyToOne(() => Exchange, (exchange) => exchange.priceHistory)
  @JoinColumn({ name: "exchange_id" })
  exchange: Exchange;

  // Virtual properties
  get priceChange(): number {
    return this.closePrice - this.openPrice;
  }

  get priceChangePercentage(): number {
    return this.openPrice > 0 ? (this.priceChange / this.openPrice) * 100 : 0;
  }

  get isGreen(): boolean {
    return this.closePrice >= this.openPrice;
  }

  get bodySize(): number {
    return Math.abs(this.closePrice - this.openPrice);
  }

  get wickSize(): { upper: number; lower: number } {
    return {
      upper: this.highPrice - Math.max(this.openPrice, this.closePrice),
      lower: Math.min(this.openPrice, this.closePrice) - this.lowPrice,
    };
  }
}
