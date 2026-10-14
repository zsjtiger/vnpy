import type { FeedMessage } from "../types";

// Connects to the backend's /ws endpoint and reconnects with capped backoff.
export function connectWebSocket(
  onMessage: (msg: FeedMessage) => void,
  onConnection: (connected: boolean) => void,
): () => void {
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  const url = `${proto}//${window.location.host}/ws`;

  let socket: WebSocket | null = null;
  let retryTimer: number | undefined;
  let attempt = 0;
  let stopped = false;

  const open = () => {
    socket = new WebSocket(url);

    socket.onopen = () => {
      attempt = 0;
      onConnection(true);
    };

    socket.onmessage = (event: MessageEvent<string>) => {
      try {
        onMessage(JSON.parse(event.data) as FeedMessage);
      } catch {
        // Ignore malformed frames instead of tearing down the connection.
      }
    };

    socket.onclose = () => {
      onConnection(false);
      if (stopped) return;
      const delay = Math.min(1000 * 2 ** attempt, 15000);
      attempt += 1;
      retryTimer = window.setTimeout(open, delay);
    };
  };

  open();

  return () => {
    stopped = true;
    window.clearTimeout(retryTimer);
    socket?.close();
  };
}
