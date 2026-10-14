import { useEffect, useReducer } from "react";
import type { AccountData, FeedMessage, LogData, OrderData, PositionData, TickData, TradeData } from "../types";
import { startMock } from "./mock";
import { connectWebSocket } from "./websocket";

export interface FeedState {
  connected: boolean;
  ticks: Record<string, TickData>;
  orders: OrderData[];
  trades: TradeData[];
  positions: Record<string, PositionData>;
  account: AccountData | null;
  logs: LogData[];
}

// Keep the UI bounded no matter how long the session runs.
const MAX_ORDERS = 200;
const MAX_TRADES = 200;
const MAX_LOGS = 300;

type Action = { type: "batch"; messages: FeedMessage[] } | { type: "connection"; connected: boolean };

const initialState: FeedState = {
  connected: false,
  ticks: {},
  orders: [],
  trades: [],
  positions: {},
  account: null,
  logs: [],
};

const keyOf = (d: { exchange: string; symbol: string }) => `${d.symbol}.${d.exchange}`;

function applyMessage(state: FeedState, msg: FeedMessage): FeedState {
  switch (msg.type) {
    case "tick":
      return { ...state, ticks: { ...state.ticks, [keyOf(msg.data)]: msg.data } };
    case "order": {
      // Replace an existing order with the same id (status updates), otherwise prepend.
      const rest = state.orders.filter((o) => o.orderid !== msg.data.orderid);
      return { ...state, orders: [msg.data, ...rest].slice(0, MAX_ORDERS) };
    }
    case "trade":
      return { ...state, trades: [msg.data, ...state.trades].slice(0, MAX_TRADES) };
    case "position":
      return { ...state, positions: { ...state.positions, [keyOf(msg.data) + ":" + msg.data.direction]: msg.data } };
    case "account":
      return { ...state, account: msg.data };
    case "log":
      return { ...state, logs: [msg.data, ...state.logs].slice(0, MAX_LOGS) };
  }
}

function reducer(state: FeedState, action: Action): FeedState {
  if (action.type === "connection") {
    return { ...state, connected: action.connected };
  }
  return action.messages.reduce(applyMessage, state);
}

export type DataSource = "mock" | "ws";

// Messages arrive in bursts (ticks especially), so they are buffered and flushed
// once per interval instead of re-rendering on every message.
const FLUSH_INTERVAL_MS = 200;

export function useFeed(source: DataSource): FeedState {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let buffer: FeedMessage[] = [];
    const flush = () => {
      if (buffer.length > 0) {
        dispatch({ type: "batch", messages: buffer });
        buffer = [];
      }
    };
    const timer = window.setInterval(flush, FLUSH_INTERVAL_MS);

    const onMessage = (msg: FeedMessage) => buffer.push(msg);
    const onConnection = (connected: boolean) => dispatch({ type: "connection", connected });

    const stop = source === "mock" ? startMock(onMessage, onConnection) : connectWebSocket(onMessage, onConnection);

    return () => {
      window.clearInterval(timer);
      stop();
    };
  }, [source]);

  return state;
}
