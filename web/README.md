# vnpy Web 看板

React + TypeScript + Vite 实现的交易看板，目前为只读版本，展示账户、行情、持仓、委托、成交和日志。

## 运行

```bash
cd web
npm install
npm run dev          # 默认使用本地模拟数据
```

连接真实后端（需要后端在 `localhost:8000` 提供 `/ws`）：

```bash
VITE_DATA_SOURCE=ws npm run dev
```

## 构建

```bash
npm run build        # 类型检查 + 生产构建，输出到 dist/
```

## 数据协议

后端通过 WebSocket `/ws` 推送 JSON 消息，格式为 `{ "type": "...", "data": {...} }`，`type` 取值：

| type | data 结构（见 `src/types.ts`） |
|---|---|
| `tick` | `TickData` |
| `order` | `OrderData`（同一 `orderid` 视为状态更新） |
| `trade` | `TradeData` |
| `position` | `PositionData`（按合约+方向去重） |
| `account` | `AccountData` |
| `log` | `LogData` |

字段名与 `vnpy/trader/object.py` 中的 dataclass 保持一致。
