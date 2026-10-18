import { useState } from "react";
import { Send, MessageSquare } from "lucide-react";
import { CONVERSATIONS } from "../data/mockData";

export default function Messages() {
  const [convs,       setConvs]       = useState(CONVERSATIONS);
  const [activeId,    setActiveId]    = useState(CONVERSATIONS[0]?.id || null);
  const [input,       setInput]       = useState("");

  const active = convs.find((c) => c.id === activeId);

  const handleSelect = (id) => {
    setActiveId(id);
    setConvs((prev) => prev.map((c) => c.id === id ? { ...c, unread: 0 } : c));
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg = { id: `m${Date.now()}`, from: "me", text: input.trim(), time: "Just now" };
    setConvs((prev) => prev.map((c) =>
      c.id === activeId
        ? { ...c, messages: [...c.messages, newMsg], lastMessage: input.trim(), lastMessageTime: "Just now" }
        : c
    ));
    setInput("");
  };

  return (
    <div className="space-y-4">
      <p className="text-[12px]" style={{ color: "#94A3B8" }}>
        UI prototype · Messaging backend not connected · Conversations are demo data
      </p>

      <div className="rounded-xl overflow-hidden flex" style={{ background: "#fff", border: "1px solid #E8EEF8", height: "520px" }}>

        {/* Conversation list */}
        <div className="w-[240px] shrink-0 flex flex-col" style={{ borderRight: "1px solid #F0F3FA" }}>
          <div className="px-4 py-3.5" style={{ borderBottom: "1px solid #F0F3FA" }}>
            <p className="text-[13px] font-black" style={{ color: "#09152E" }}>Messages</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {convs.map((c) => (
              <button key={c.id} onClick={() => handleSelect(c.id)}
                className="w-full flex gap-3 px-4 py-3.5 text-left transition-colors"
                style={{
                  background: activeId === c.id ? "#F5F8FF" : "transparent",
                  borderBottom: "1px solid #F5F7FB",
                  borderLeft: activeId === c.id ? "2.5px solid #3478F6" : "2.5px solid transparent",
                }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-black text-white shrink-0"
                  style={{ background: c.color }}>{c.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-[12.5px] font-semibold truncate" style={{ color: "#09152E" }}>{c.with}</p>
                    {c.unread > 0 && (
                      <span className="w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center text-white shrink-0"
                        style={{ background: "#3478F6" }}>{c.unread}</span>
                    )}
                  </div>
                  <p className="text-[11.5px] truncate mt-0.5" style={{ color: "#94A3B8" }}>{c.lastMessage}</p>
                  <p className="text-[10.5px] mt-0.5" style={{ color: "#B0BCC8" }}>{c.lastMessageTime}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Conversation panel */}
        {active ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="px-5 py-3.5 flex items-center gap-3" style={{ borderBottom: "1px solid #F0F3FA" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0"
                style={{ background: active.color }}>{active.initials}</div>
              <div>
                <p className="text-[13px] font-bold" style={{ color: "#09152E" }}>{active.with}</p>
                <p className="text-[11px]" style={{ color: "#94A3B8" }}>{active.org}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {active.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[75%]">
                    <div className="px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed"
                      style={msg.from === "me"
                        ? { background: "#3478F6", color: "#fff", borderBottomRightRadius: "4px" }
                        : { background: "#F0F3FA", color: "#09152E", borderBottomLeftRadius: "4px" }}>
                      {msg.text}
                    </div>
                    <p className={`text-[10.5px] mt-1 ${msg.from === "me" ? "text-right" : "text-left"}`}
                      style={{ color: "#B0BCC8" }}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSend}
              className="px-4 py-3 flex gap-2" style={{ borderTop: "1px solid #F0F3FA" }}>
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="Write a message…"
                className="flex-1 text-[13px] px-3.5 py-2 rounded-lg outline-none transition-colors"
                style={{ background: "#F5F7FA", border: "1px solid #E8EEF8", color: "#09152E" }}
                onFocus={(e) => (e.target.style.borderColor = "#3478F6")}
                onBlur={(e) => (e.target.style.borderColor = "#E8EEF8")} />
              <button type="submit"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors text-white"
                style={{ background: input.trim() ? "#3478F6" : "#CBD5E1" }}
                disabled={!input.trim()}>
                <Send size={15} />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <MessageSquare size={28} style={{ color: "#CBD5E1", marginBottom: "12px" }} />
            <p className="text-[14px] font-semibold" style={{ color: "#09152E" }}>No conversation selected</p>
            <p className="text-[13px] mt-1" style={{ color: "#94A3B8" }}>Select one from the list.</p>
          </div>
        )}
      </div>
    </div>
  );
}
