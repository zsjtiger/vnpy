import type { FeedMessage, OrderData, PositionData, TradeData } from "../types";

// Local simulated feed so the dashboard runs without a backend.
const SYMBOLS = [
  { symbol: "IF2412", exchange: "CFFEX", price: 3500 },
  { symbol: "rb2501", exchange: "SHFE", price: 3150 },
  { symbol: "au2412", exchange: "SHFE", price: 580 },
];

const pick = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

export function startMock(
  onMessage: (msg: FeedMessage) => void,
  onConnection: (connected: boolean) => void,
): () => void {
  const prices = SYMBOLS.map((s) => s.price);
  const positions: Record<string, PositionData> = {};
  let seq = 0;
  let balance = 1_000_000;

  onConnection(true);
  onMessage({ type: "log", data: { time: new Date().toISOString(), msg: "模拟数据源已启动", level: "INFO" } });

  const timer = window.setInterval(() => {
    const now = new Date().toISOString();
    seq += 1;

    SYMBOLS.forEach((s, i) => {
      prices[i] = Math.round((prices[i] + (Math.random() - 0.5) * s.price * 0.001) * 100) / 100;
      const price = prices[i];
      onMessage({
        type: "tick",
        data: {
          symbol: s.symbol,
          exchange: s.exchange,
          datetime: now,
          last_price: price,
          volume: seq * 10,
          bid_price_1: price - 0.2,
          ask_price_1: price + 0.2,
          bid_volume_1: 10 + (seq % 7),
          ask_volume_1: 8 + (seq % 5),
        },
      });
    });

    if (seq % 4 === 0) {
      const s = pick(SYMBOLS);
      const direction = pick<"LONG" | "SHORT">(["LONG", "SHORT"]);
      const orderid = `ORD${seq}`;
      const volume = 1 + (seq % 3);
      const order: OrderData = {
        symbol: s.symbol,
        exchange: s.exchange,
        orderid,
        direction,
        offset: "OPEN",
        price: prices[SYMBOLS.indexOf(s)],
        volume,
        traded: 0,
        status: "NOTTRADED",
        datetime: now,
      };
      onMessage({ type: "order", data: order });

      // Fill most orders a moment later, the rest stay open.
      if (Math.random() > 0.2) {
        onMessage({ type: "order", data: { ...order, traded: volume, status: "ALLTRADED" } });
        const trade: TradeData = {
          symbol: s.symbol,
          exchange: s.exchange,
          tradeid: `TRD${seq}`,
          orderid,
          direction,
          offset: "OPEN",
          price: order.price,
          volume,
          datetime: now,
        };
        onMessage({ type: "trade", data: trade });

        const key = `${s.symbol}.${s.exchange}:${direction}`;
        const prev = positions[key];
        const newVolume = (prev?.volume ?? 0) + volume;
        positions[key] = {
          symbol: s.symbol,
          exchange: s.exchange,
          direction,
          volume: newVolume,
          frozen: 0,
          price: order.price,
          pnl: 0,
        };
        onMessage({ type: "position", data: positions[key] });
      }
    }

    // Mark-to-market PnL on open positions, and account refresh.
    let totalPnl = 0;
    Object.values(positions).forEach((p) => {
      const idx = SYMBOLS.findIndex((s) => s.symbol === p.symbol);
      const sign = p.direction === "LONG" ? 1 : -1;
      p.pnl = Math.round((prices[idx] - p.price) * p.volume * sign * 100) / 100;
      totalPnl += p.pnl;
      onMessage({ type: "position", data: { ...p } });
    });
    balance = 1_000_000 + totalPnl;
    onMessage({ type: "account", data: { accountid: "SIM-001", balance, frozen: 0, available: balance } });

    if (seq % 20 === 0) {
      onMessage({ type: "log", data: { time: now, msg: `心跳 #${seq}`, level: "INFO" } });
    }
  }, 500);

  return () => {
    window.clearInterval(timer);
    onConnection(false);
  };
}
