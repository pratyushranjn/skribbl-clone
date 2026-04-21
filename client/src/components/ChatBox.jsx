import { useEffect, useRef, useState } from "react";

function ChatBox({ room, userName, sendChat, chatMessages }) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    sendChat(room, userName, trimmed);
    setMessage("");
  };

  const isOwnMessage = (playerName) =>
    playerName?.trim().toLowerCase() === userName?.trim().toLowerCase();

  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2.5 sm:px-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          Chat
        </h3>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
          {chatMessages.length}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto bg-slate-50/70 px-3 py-3 sm:px-4">
        {chatMessages.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
            No messages yet
          </p>
        ) : (
          chatMessages.map((item, index) => {
            const own = isOwnMessage(item.playerName);

            return (
            <div
              key={`${item.playerName}-${index}`}
              className={`flex ${own ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl border px-3 py-2.5 text-sm shadow-sm ${
                  own
                    ? "border-cyan-200 bg-cyan-50 text-slate-800"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                <p className={`mb-1 text-[11px] font-semibold uppercase tracking-wide ${own ? "text-cyan-700" : "text-slate-500"}`}>
                  {own ? "You" : item.playerName}
                </p>
                <p className="wrap-break-word whitespace-pre-wrap leading-5 text-slate-700">
                  {item.text}
                </p>
              </div>
            </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 border-t border-slate-200 p-3 sm:p-4">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type message..."
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;