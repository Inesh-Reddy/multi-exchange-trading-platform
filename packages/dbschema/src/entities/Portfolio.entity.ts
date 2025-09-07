import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import {
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
} from "class-validator";
import { User } from "./User.entity";
import { Position } from "./Position.entity";
import { Order } from "./Order.entity";
import { Transaction } from "./Transaction.entity";

@Entity("portfolios")
@Index(["userId"])
@Index(["userId", "isDefault"])
export class Portfolio {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "user_id" })
  userId: string;

  @Column({ type: "varchar", length: 100 })
  @IsString()
  @MaxLength(100)
  name: string;

  @Column({ type: "text", nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Column({
    type: "decimal",
    precision: 20,
    scale: 8,
    default: 0,
    name: "total_value",
  })
  @IsNumber()
  @Min(0)
  totalValue: number;

  @Column({
    type: "decimal",
    precision: 20,
    scale: 8,
    default: 0,
    name: "cash_balance",
  })
  @IsNumber()
  @Min(0)
  cashBalance: number;

  @Column({ type: "boolean", default: false, name: "is_default" })
  @IsBoolean()
  isDefault: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.portfolios, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => Position, (position) => position.portfolio, {
    cascade: true,
  })
  positions: Position[];

  @OneToMany(() => Order, (order) => order.portfolio)
  orders: Order[];

  @OneToMany(() => Transaction, (transaction) => transaction.portfolio)
  transactions: Transaction[];

  // Business logic hooks
  @BeforeInsert()
  @BeforeUpdate()
  async calculateTotalValue() {
    // This will be implemented in service layer
    // Here just for demonstration of lifecycle hooks
  }

  // Virtual properties
  get unrealizedPnl(): number {
    return (
      this.positions?.reduce(
        (total, position) => total + (position.unrealizedPnl || 0),
        0
      ) || 0
    );
  }

  get realizedPnl(): number {
    return (
      this.positions?.reduce(
        (total, position) => total + (position.realizedPnl || 0),
        0
      ) || 0
    );
  }
}
