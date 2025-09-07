import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  BeforeUpdate,
} from "typeorm";
import { IsString, IsNumber, MaxLength } from "class-validator";
import { Portfolio } from "./Portfolio.entity";
import { Exchange } from "./Exchange.entity";

@Entity("positions")
@Index(["portfolioId", "exchangeId", "symbol"], { unique: true })
@Index(["portfolioId"])
@Index(["symbol"])
@Index(["exchangeId"])
export class Position {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "portfolio_id" })
  portfolioId: string;

  @Column({ type: "uuid", name: "exchange_id" })
  exchangeId: string;

  @Column({ type: "varchar", length: 20 })
  @IsString()
  @MaxLength(20)
  symbol: string;

  @Column({
    type: "decimal",
    precision: 20,
    scale: 8,
    default: 0,
  })
  @IsNumber()
  quantity: number;

  @Column({
    type: "decimal",
    precision: 20,
    scale: 8,
    default: 0,
    name: "average_cost",
  })
  @IsNumber()
  averageCost: number;

  @Column({
    type: "decimal",
    precision: 20,
    scale: 8,
    default: 0,
    name: "current_price",
  })
  @IsNumber()
  currentPrice: number;

  @Column({
    type: "decimal",
    precision: 20,
    scale: 8,
    default: 0,
    name: "market_value",
  })
  @IsNumber()
  marketValue: number;

  @Column({
    type: "decimal",
    precision: 20,
    scale: 8,
    default: 0,
    name: "unrealized_pnl",
  })
  @IsNumber()
  unrealizedPnl: number;

  @Column({
    type: "decimal",
    precision: 20,
    scale: 8,
    default: 0,
    name: "realized_pnl",
  })
  @IsNumber()
  realizedPnl: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Portfolio, (portfolio) => portfolio.positions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "portfolio_id" })
  portfolio: Portfolio;

  @ManyToOne(() => Exchange, (exchange) => exchange.positions)
  @JoinColumn({ name: "exchange_id" })
  exchange: Exchange;

  // Business logic
  @BeforeUpdate()
  calculateValues() {
    this.marketValue = this.quantity * this.currentPrice;
    this.unrealizedPnl = this.marketValue - this.quantity * this.averageCost;
  }

  // Virtual properties
  get totalCost(): number {
    return this.quantity * this.averageCost;
  }

  get pnlPercentage(): number {
    if (this.totalCost === 0) return 0;
    return (this.unrealizedPnl / this.totalCost) * 100;
  }
}
