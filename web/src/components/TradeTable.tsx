import type { TradeData } from "../types";
import { Empty, Panel } from "./Panel";
import { formatTime } from "./TickTable";

export function TradeTable({ trades }: { trades: TradeData[] }) {
  return (
    <Panel title="成交" count={trades.length}>
      {trades.length === 0 ? (
        <Empty text="暂无成交" />
      ) : (
        <table>
          <thead>
            <tr>
              <th>时间</th>
              <th>合约</th>
              <th>方向</th>
              <th className="num">价格</th>
              <th className="num">数量</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((t) => (
              <tr key={t.tradeid}>
                <td>{formatTime(t.datetime)}</td>
                <td>{t.symbol}</td>
                <td>{t.direction === "LONG" ? "买" : "卖"}{t.offset === "OPEN" ? "开" : "平"}</td>
                <td className="num">{t.price.toFixed(2)}</td>
                <td className="num">{t.volume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Panel>
  );
}
