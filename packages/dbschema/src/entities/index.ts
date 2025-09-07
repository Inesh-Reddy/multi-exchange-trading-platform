import { Exchange } from "./Exchange.entity";
import { MarketData } from "./MarketData.entity";
import { Order } from "./Order.entity";
import { Portfolio } from "./Portfolio.entity";
import { Position } from "./Position.entity";
import { PriceHistory } from "./PriceHistory.entity";
import { TradingPair } from "./TradingPair.entity";
import { Transaction } from "./Transaction.entity";
import { User } from "./User.entity";

export { User } from "./User.entity";
export { Exchange } from "./Exchange.entity";
export { TradingPair } from "./TradingPair.entity";

// Trading entities
export { Portfolio } from "./Portfolio.entity";
export { Position } from "./Position.entity";
export { Order } from "./Order.entity";
export { Transaction } from "./Transaction.entity";

// Market data entities
export { MarketData } from "./MarketData.entity";
export { PriceHistory } from "./PriceHistory.entity";

// Array of all entities for TypeORM configuration
export const entities = [
  User,
  Exchange,
  TradingPair,
  Portfolio,
  Position,
  Order,
  Transaction,
  MarketData,
  PriceHistory,
];
