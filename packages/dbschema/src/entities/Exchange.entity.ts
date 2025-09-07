import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from "typeorm";
import {
  IsString,
  IsBoolean,
  IsUrl,
  IsOptional,
  MaxLength,
} from "class-validator";
import { TradingPair } from "./TradingPair.entity";
import { Position } from "./Position.entity";
import { Order } from "./Order.entity";
import { Transaction } from "./Transaction.entity";
import { MarketData } from "./MarketData.entity";
import { PriceHistory } from "./PriceHistory.entity";

@Entity("exchanges")
@Index(["name"], { unique: true })
@Index(["isActive"])
export class Exchange {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100, unique: true })
  @IsString()
  @MaxLength(100)
  name: string;

  @Column({ type: "varchar", length: 100, name: "display_name" })
  @IsString()
  @MaxLength(100)
  displayName: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
    name: "api_base_url",
  })
  @IsOptional()
  @IsUrl()
  apiBaseUrl?: string;

  @Column({ type: "boolean", default: true, name: "is_active" })
  @IsBoolean()
  isActive: boolean;

  @Column({ type: "jsonb", default: {}, name: "supported_features" })
  @IsOptional()
  supportedFeatures: {
    spot?: boolean;
    futures?: boolean;
    margin?: boolean;
    options?: boolean;
  };

  @Column({ type: "jsonb", default: {}, name: "fee_structure" })
  @IsOptional()
  feeStructure: {
    maker?: number;
    taker?: number;
    withdrawal?: Record<string, number>;
  };

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // Relationships
  @OneToMany(() => TradingPair, (tradingPair) => tradingPair.exchange, {
    cascade: true,
  })
  tradingPairs: TradingPair[];

  @OneToMany(() => Position, (position) => position.exchange)
  positions: Position[];

  @OneToMany(() => Order, (order) => order.exchange)
  orders: Order[];

  @OneToMany(() => Transaction, (transaction) => transaction.exchange)
  transactions: Transaction[];

  @OneToMany(() => MarketData, (marketData) => marketData.exchange, {
    cascade: true,
  })
  marketData: MarketData[];

  @OneToMany(() => PriceHistory, (priceHistory) => priceHistory.exchange, {
    cascade: true,
  })
  priceHistory: PriceHistory[];
}
