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
  IsOptional,
  MaxLength,
  Min,
} from "class-validator";
import { Exchange } from "./Exchange.entity";

@Entity("market_data")
@Index(["exchangeId", "symbol", "timestamp"], { unique: true })
@Index(["symbol", "timestamp"])
@Index(["exchangeId", "timestamp"])
export class MarketData {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "exchange_id" })
  exchangeId: string;

  @Column({ type: "varchar", length: 20 })
  @IsString()
  @MaxLength(20)
  symbol: string;

  @Column({ type: "decimal", precision: 20, scale: 8 })
  @IsNumber()
  @Min(0)
  price: number;

  @Column({
    type: "decimal",
    precision: 20,
    scale: 8,
    nullable: true,
    name: "bid_price",
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bidPrice?: number;

  @Column({
    type: "decimal",
    precision: 20,
    scale: 8,
    nullable: true,
    name: "ask_price",
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  askPrice?: number;

  @Column({
    type: "decimal",
    precision: 20,
    scale: 8,
    nullable: true,
    name: "volume_24h",
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  volume24h?: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    nullable: true,
    name: "change_24h",
  })
  @IsOptional()
  @IsNumber()
  change24h?: number; // Percentage change

  @Column({
    type: "decimal",
    precision: 20,
    scale: 8,
    nullable: true,
    name: "high_24h",
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  high24h?: number;

  @Column({
    type: "decimal",
    precision: 20,
    scale: 8,
    nullable: true,
    name: "low_24h",
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  low24h?: number;

  @Column({ type: "timestamp" })
  timestamp: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  // Relationships
  @ManyToOne(() => Exchange, (exchange) => exchange.marketData)
  @JoinColumn({ name: "exchange_id" })
  exchange: Exchange;

  // Virtual properties
  get spread(): number {
    if (this.bidPrice && this.askPrice) {
      return this.askPrice - this.bidPrice;
    }
    return 0;
  }

  get spreadPercentage(): number {
    if (this.bidPrice && this.askPrice && this.price > 0) {
      return (this.spread / this.price) * 100;
    }
    return 0;
  }
}
