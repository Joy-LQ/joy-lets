/**
 * Joy Lets AI 客服聊天窗口
 * 使用方法：在 HTML 底部加一行：
 *   <script src="chat-widget.js"></script>
 *
 * 配置项（可在引入前设置 window.JOY_CHAT_CONFIG）：
 *   window.JOY_CHAT_CONFIG = { apiUrl: "https://chat.man-live.uk" }
 */

(function () {
  const CONFIG = window.JOY_CHAT_CONFIG || {};
  const API_URL = CONFIG.apiUrl || "https://chat.man-live.uk";

  // ── 样式 ─────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    #joy-chat-btn {
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      width: 56px; height: 56px; border-radius: 50%;
      background: #2d6a4f; color: white; font-size: 24px;
      border: none; cursor: pointer; box-shadow: 0 4px 16px rgba(0,0,0,0.25);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s;
    }
    #joy-chat-btn:hover { transform: scale(1.1); }

    #joy-chat-box {
      position: fixed; bottom: 90px; right: 24px; z-index: 9998;
      width: 320px; max-height: 480px;
      background: white; border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      display: none; flex-direction: column; overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
    }
    #joy-chat-box.open { display: flex; }

    #joy-chat-header {
      background: #2d6a4f; color: white;
      padding: 14px 16px; font-weight: 600; font-size: 15px;
      display: flex; justify-content: space-between; align-items: center;
    }
    #joy-chat-header span { font-size: 12px; opacity: 0.8; font-weight: 400; }
    #joy-chat-close { cursor: pointer; font-size: 20px; line-height: 1; }

    #joy-chat-messages {
      flex: 1; overflow-y: auto; padding: 12px;
      display: flex; flex-direction: column; gap: 10px;
      max-height: 320px;
    }

    .joy-msg {
      max-width: 80%; padding: 9px 13px; border-radius: 14px;
      font-size: 14px; line-height: 1.5; word-break: break-word;
    }
    .joy-msg.bot {
      background: #f0f4f1; color: #1a1a1a; align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .joy-msg.user {
      background: #2d6a4f; color: white; align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .joy-msg.typing { opacity: 0.6; font-style: italic; }

    #joy-chat-input-area {
      display: flex; gap: 8px; padding: 10px 12px;
      border-top: 1px solid #eee;
    }
    #joy-chat-input {
      flex: 1; border: 1px solid #ddd; border-radius: 20px;
      padding: 8px 14px; font-size: 14px; outline: none;
      font-family: inherit;
    }
    #joy-chat-input:focus { border-color: #2d6a4f; }
    #joy-chat-send {
      background: #2d6a4f; color: white; border: none;
      border-radius: 50%; width: 36px; height: 36px;
      cursor: pointer; font-size: 16px; flex-shrink: 0;
    }
    #joy-chat-send:disabled { opacity: 0.5; cursor: not-allowed; }
  `;
  document.head.appendChild(style);

  // ── HTML 结构 ─────────────────────────────────────
  document.body.insertAdjacentHTML("beforeend", `
    <button id="joy-chat-btn" title="AI 客服">💬</button>
    <div id="joy-chat-box">
      <div id="joy-chat-header">
        <div>Ethan · AI 客服 <span>Joy Lets</span></div>
        <div id="joy-chat-close">×</div>
      </div>
      <div id="joy-chat-messages">
        <div class="joy-msg bot">
          你好！我是 Joy Lets 的 AI 客服 Ethan 🏠<br>
          可以问我曼城租房相关的问题，或者告诉我你的需求，我来推荐合适的房源～
        </div>
      </div>
      <div id="joy-chat-input-area">
        <input id="joy-chat-input" placeholder="输入你的问题..." maxlength="200" />
        <button id="joy-chat-send">➤</button>
      </div>
    </div>
  `);

  // ── 逻辑 ─────────────────────────────────────────
  const btn      = document.getElementById("joy-chat-btn");
  const box      = document.getElementById("joy-chat-box");
  const closeBtn = document.getElementById("joy-chat-close");
  const messages = document.getElementById("joy-chat-messages");
  const input    = document.getElementById("joy-chat-input");
  const sendBtn  = document.getElementById("joy-chat-send");

  let history = [];

  btn.addEventListener("click", () => box.classList.toggle("open"));
  closeBtn.addEventListener("click", () => box.classList.remove("open"));

  function appendMsg(text, role) {
    const div = document.createElement("div");
    div.className = `joy-msg ${role}`;
    div.innerHTML = text.replace(/\n/g, "<br>");
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  async function send() {
    const text = input.value.trim();
    if (!text) return;

    input.value = "";
    sendBtn.disabled = true;
    appendMsg(text, "user");

    const typing = appendMsg("正在思考中…", "bot typing");

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      const reply = data.reply || "抱歉，暂时无法回复，请联系 Joy（微信：manchester_room）。";

      typing.className = "joy-msg bot";
      typing.innerHTML = reply.replace(/\n/g, "<br>");

      history.push({ role: "user", content: text });
      history.push({ role: "bot", content: reply });
      if (history.length > 12) history = history.slice(-12);  // 最多保留6轮

    } catch (e) {
      typing.className = "joy-msg bot";
      typing.innerHTML = "网络错误，请稍后再试，或直接联系 Joy：微信 manchester_room 💬";
    }

    sendBtn.disabled = false;
    input.focus();
  }

  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
})();
