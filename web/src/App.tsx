import { useMemo } from "react";
import { useFeed, type DataSource } from "./data/feed";
import { AccountCard } from "./components/AccountCard";
import { LogPanel } from "./components/LogPanel";
import { OrderTable } from "./components/OrderTable";
import { PositionTable } from "./components/PositionTable";
import { TickTable } from "./components/TickTable";
import { TradeTable } from "./components/TradeTable";

// Set VITE_DATA_SOURCE=ws to use the real backend; defaults to the local simulator.
function resolveSource(): DataSource {
  return import.meta.env.VITE_DATA_SOURCE === "ws" ? "ws" : "mock";
}

export default function App() {
  const source = useMemo(resolveSource, []);
  const feed = useFeed(source);

  return (
    <div className="app">
      <header className="topbar">
        <h1>vnpy 交易看板</h1>
        <span className={`status ${feed.connected ? "online" : "offline"}`}>
          {feed.connected ? "已连接" : "未连接"} · {source === "mock" ? "模拟数据" : "实时数据"}
        </span>
      </header>

      <main className="grid">
        <AccountCard account={feed.account} />
        <TickTable ticks={feed.ticks} />
        <PositionTable positions={feed.positions} />
        <OrderTable orders={feed.orders} />
        <TradeTable trades={feed.trades} />
        <LogPanel logs={feed.logs} />
      </main>
    </div>
  );
}
