import type { AccountData } from "../types";
import { Empty, Panel } from "./Panel";

const fmt = (n: number) => n.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function AccountCard({ account }: { account: AccountData | null }) {
  return (
    <Panel title="账户" className="account">
      {account ? (
        <dl className="stats">
          <div>
            <dt>账户</dt>
            <dd>{account.accountid}</dd>
          </div>
          <div>
            <dt>总资金</dt>
            <dd>{fmt(account.balance)}</dd>
          </div>
          <div>
            <dt>冻结</dt>
            <dd>{fmt(account.frozen)}</dd>
          </div>
          <div>
            <dt>可用</dt>
            <dd>{fmt(account.available)}</dd>
          </div>
        </dl>
      ) : (
        <Empty text="等待账户数据" />
      )}
    </Panel>
  );
}
