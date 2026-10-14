import type { ReactNode } from "react";

interface PanelProps {
  title: string;
  count?: number;
  children: ReactNode;
  className?: string;
}

export function Panel({ title, count, children, className }: PanelProps) {
  return (
    <section className={`panel ${className ?? ""}`}>
      <header className="panel-header">
        <h2>{title}</h2>
        {count !== undefined && <span className="badge">{count}</span>}
      </header>
      <div className="panel-body">{children}</div>
    </section>
  );
}

export function Empty({ text = "暂无数据" }: { text?: string }) {
  return <p className="empty">{text}</p>;
}
