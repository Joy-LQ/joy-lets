// Contact sheet – inject once into any page
(function () {
  const sheet = document.createElement('div');
  sheet.id = 'contact-sheet-overlay';
  sheet.style.cssText = `
    display:none; position:fixed; inset:0; background:rgba(0,0,0,0.45);
    z-index:999; align-items:flex-end; justify-content:center;
  `;
  sheet.innerHTML = `
    <div id="contact-sheet" style="
      background:white; width:100%; max-width:480px;
      border-radius:20px 20px 0 0; padding:24px 24px 40px;
    ">
      <div style="width:36px;height:4px;background:#e0e0e0;border-radius:2px;margin:0 auto 20px;"></div>
      <div style="font-size:16px;font-weight:700;color:#0A0A0A;margin-bottom:6px;">Contact Joy Lets</div>
      <div style="font-size:13px;color:#717375;margin-bottom:20px;">Choose how you'd like to reach us</div>

      <a href="https://wa.me/447510757408" target="_blank" onclick="closeContactSheet()"
        style="display:flex;align-items:center;gap:14px;padding:16px;border:1.5px solid #e8e8e8;
               border-radius:12px;text-decoration:none;color:#0A0A0A;margin-bottom:10px;">
        <span style="font-size:28px;">💬</span>
        <div>
          <div style="font-size:15px;font-weight:600;">WhatsApp</div>
          <div style="font-size:13px;color:#717375;">+44 7510 757408</div>
        </div>
        <span style="margin-left:auto;color:#c0c0c0;font-size:18px;">›</span>
      </a>

      <div onclick="openWeChat()"
        style="display:flex;align-items:center;gap:14px;padding:16px;border:1.5px solid #e8e8e8;
               border-radius:12px;cursor:pointer;color:#0A0A0A;margin-bottom:10px;">
        <span style="font-size:28px;">🟢</span>
        <div>
          <div style="font-size:15px;font-weight:600;">WeChat 微信</div>
          <div style="font-size:13px;color:#717375;">manchester_room</div>
        </div>
        <span style="margin-left:auto;color:#c0c0c0;font-size:18px;">›</span>
      </div>

      <div id="wechat-copied" style="display:none;background:#f0fff6;border:1px solid #b2dfdb;
        border-radius:8px;padding:10px 14px;font-size:13px;color:#1a8a4a;margin-bottom:10px;">
        ✓ WeChat ID copied! Opening WeChat…
      </div>

      <button onclick="closeContactSheet()"
        style="width:100%;padding:14px;border:none;border-radius:10px;
               background:#f5f5f5;font-size:15px;font-weight:500;cursor:pointer;margin-top:4px;">
        Cancel
      </button>
    </div>
  `;
  document.body.appendChild(sheet);

  sheet.addEventListener('click', function (e) {
    if (e.target === sheet) closeContactSheet();
  });
})();

function openContactSheet() {
  const el = document.getElementById('contact-sheet-overlay');
  el.style.display = 'flex';
  document.getElementById('wechat-copied').style.display = 'none';
}

function closeContactSheet() {
  document.getElementById('contact-sheet-overlay').style.display = 'none';
}

function openWeChat() {
  const inWeChat = /MicroMessenger/i.test(navigator.userAgent);
  navigator.clipboard.writeText('manchester_room').catch(() => {});
  const tip = document.getElementById('wechat-copied');

  if (inWeChat) {
    // Already inside WeChat — just show copy tip
    tip.innerHTML = '✓ 微信号已复制：<strong>manchester_room</strong><br>请直接搜索添加';
    tip.style.display = 'block';
  } else {
    // External browser — copy + jump to WeChat app
    tip.innerHTML = '✓ WeChat ID copied! Opening WeChat…';
    tip.style.display = 'block';
    setTimeout(() => { window.location.href = 'weixin://'; }, 800);
  }
}
