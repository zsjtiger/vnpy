import type { LogData } from "../types";
import { Empty, Panel } from "./Panel";
import { formatTime } from "./TickTable";

export function LogPanel({ logs }: { logs: LogData[] }) {
  return (
    <Panel title="日志" count={logs.length} className="logs">
      {logs.length === 0 ? (
        <Empty text="暂无日志" />
      ) : (
        <ul className="log-list">
          {logs.map((l, i) => (
            <li key={`${l.time}-${i}`} className={`level-${l.level.toLowerCase()}`}>
              <span className="log-time">{formatTime(l.time)}</span>
              <span className="log-level">{l.level}</span>
              <span>{l.msg}</span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
