import type { OrderData, Status } from "../types";
import { Empty, Panel } from "./Panel";
import { formatTime } from "./TickTable";

const STATUS_TEXT: Record<Status, string> = {
  SUBMITTING: "提交中",
  NOTTRADED: "未成交",
  PARTTRADED: "部分成交",
  ALLTRADED: "全部成交",
  CANCELLED: "已撤单",
  REJECTED: "已拒单",
};

export function OrderTable({ orders }: { orders: OrderData[] }) {
  return (
    <Panel title="委托" count={orders.length}>
      {orders.length === 0 ? (
        <Empty text="暂无委托" />
      ) : (
        <table>
          <thead>
            <tr>
              <th>时间</th>
              <th>合约</th>
              <th>方向</th>
              <th className="num">价格</th>
              <th className="num">成交/总量</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.orderid}>
                <td>{formatTime(o.datetime)}</td>
                <td>{o.symbol}</td>
                <td>{o.direction === "LONG" ? "买" : "卖"}{o.offset === "OPEN" ? "开" : "平"}</td>
                <td className="num">{o.price.toFixed(2)}</td>
                <td className="num">
                  {o.traded}/{o.volume}
                </td>
                <td>{STATUS_TEXT[o.status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Panel>
  );
}
