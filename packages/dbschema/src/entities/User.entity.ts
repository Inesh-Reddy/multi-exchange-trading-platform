import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
} from "typeorm";
import {
  IsEmail,
  IsString,
  IsBoolean,
  IsOptional,
  MinLength,
  MaxLength,
} from "class-validator";
import { Portfolio } from "./Portfolio.entity";
import { Order } from "./Order.entity";
import { Transaction } from "./Transaction.entity";

@Entity("users")
@Index(["email"], { unique: true })
@Index(["isActive"])
@Index(["createdAt"])
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, unique: true })
  @IsEmail()
  email: string;

  @Column({ type: "varchar", length: 255, name: "password_hash" })
  @IsString()
  @MinLength(8)
  passwordHash: string;

  @Column({ type: "varchar", length: 100, nullable: true, name: "first_name" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @Column({ type: "varchar", length: 100, nullable: true, name: "last_name" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @Column({ type: "jsonb", default: {}, name: "profile_data" })
  @IsOptional()
  profileData: Record<string, any>;

  @Column({ type: "boolean", default: true, name: "is_active" })
  @IsBoolean()
  isActive: boolean;

  @Column({ type: "boolean", default: false, name: "email_verified" })
  @IsBoolean()
  emailVerified: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  // Relationships
  @OneToMany(() => Portfolio, (portfolio) => portfolio.user, {
    cascade: true,
  })
  portfolios: Portfolio[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  // Virtual fields
  get fullName(): string {
    return `${this.firstName || ""} ${this.lastName || ""}`.trim();
  }
}
