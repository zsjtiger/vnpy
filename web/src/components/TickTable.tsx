import type { TickData } from "../types";
import { Empty, Panel } from "./Panel";

export function TickTable({ ticks }: { ticks: Record<string, TickData> }) {
  const rows = Object.entries(ticks).sort(([a], [b]) => a.localeCompare(b));
  return (
    <Panel title="行情" count={rows.length}>
      {rows.length === 0 ? (
        <Empty text="暂无行情订阅" />
      ) : (
        <table>
          <thead>
            <tr>
              <th>合约</th>
              <th className="num">最新价</th>
              <th className="num">买一</th>
              <th className="num">卖一</th>
              <th className="num">成交量</th>
              <th>时间</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([key, t]) => (
              <tr key={key}>
                <td>{key}</td>
                <td className="num">{t.last_price.toFixed(2)}</td>
                <td className="num bid">{t.bid_price_1.toFixed(2)}</td>
                <td className="num ask">{t.ask_price_1.toFixed(2)}</td>
                <td className="num">{t.volume}</td>
                <td>{formatTime(t.datetime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Panel>
  );
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleTimeString("zh-CN", { hour12: false });
}
