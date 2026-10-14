// Data contract mirrored from vnpy/trader/object.py.
// Field names follow the Python dataclasses so the backend can serialize them as-is.

export type Direction = "LONG" | "SHORT" | "NET";
export type Offset = "NONE" | "OPEN" | "CLOSE" | "CLOSETODAY" | "CLOSEYESTERDAY";
export type Status = "SUBMITTING" | "NOTTRADED" | "PARTTRADED" | "ALLTRADED" | "CANCELLED" | "REJECTED";

export interface TickData {
  symbol: string;
  exchange: string;
  datetime: string;
  last_price: number;
  volume: number;
  bid_price_1: number;
  ask_price_1: number;
  bid_volume_1: number;
  ask_volume_1: number;
}

export interface OrderData {
  symbol: string;
  exchange: string;
  orderid: string;
  direction: Direction;
  offset: Offset;
  price: number;
  volume: number;
  traded: number;
  status: Status;
  datetime: string;
}

export interface TradeData {
  symbol: string;
  exchange: string;
  tradeid: string;
  orderid: string;
  direction: Direction;
  offset: Offset;
  price: number;
  volume: number;
  datetime: string;
}

export interface PositionData {
  symbol: string;
  exchange: string;
  direction: Direction;
  volume: number;
  frozen: number;
  price: number;
  pnl: number;
}

export interface AccountData {
  accountid: string;
  balance: number;
  frozen: number;
  available: number;
}

export interface LogData {
  time: string;
  msg: string;
  level: "INFO" | "WARNING" | "ERROR";
}

// Messages pushed from the backend over WebSocket.
export type FeedMessage =
  | { type: "tick"; data: TickData }
  | { type: "order"; data: OrderData }
  | { type: "trade"; data: TradeData }
  | { type: "position"; data: PositionData }
  | { type: "account"; data: AccountData }
  | { type: "log"; data: LogData };
