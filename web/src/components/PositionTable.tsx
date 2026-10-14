import type { PositionData } from "../types";
import { Empty, Panel } from "./Panel";

const DIRECTION_TEXT: Record<string, string> = { LONG: "多", SHORT: "空", NET: "净" };

export function PositionTable({ positions }: { positions: Record<string, PositionData> }) {
  const rows = Object.values(positions).filter((p) => p.volume !== 0);
  return (
    <Panel title="持仓" count={rows.length}>
      {rows.length === 0 ? (
        <Empty text="暂无持仓" />
      ) : (
        <table>
          <thead>
            <tr>
              <th>合约</th>
              <th>方向</th>
              <th className="num">数量</th>
              <th className="num">均价</th>
              <th className="num">盈亏</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={`${p.symbol}.${p.exchange}:${p.direction}`}>
                <td>{p.symbol}</td>
                <td>{DIRECTION_TEXT[p.direction] ?? p.direction}</td>
                <td className="num">{p.volume}</td>
                <td className="num">{p.price.toFixed(2)}</td>
                <td className={`num ${p.pnl >= 0 ? "up" : "down"}`}>{p.pnl.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Panel>
  );
}
