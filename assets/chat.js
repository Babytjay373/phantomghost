/* Phantom Ghost — site chat widget.
   Self-contained: injects its own styles. No API key, no backend, no tracking.
   Answers the questions clients actually ask, then hands off to email. */
(function () {
  "use strict";

  const BRAND = "Phantom Ghost";
  const EMAIL = "ixtjay36@gmail.com";

  /* ── knowledge base ──────────────────────────────────────────────────── */
  const KB = [
    {
      id: "price",
      keys: ["price", "pricing", "cost", "how much", "rate", "charge", "fee", "budget", "$", "cedis", "ghc"],
      reply: "Three tiers:\n\n• Visualiser — <b>$60</b> (24h)\n• Lyric video — <b>$120</b> (48h)\n• Release package — <b>$260</b> (5 days)\n\n50% up front, 50% on delivery. Two rounds of changes included.",
      chips: ["What's in the package?", "How fast?", "Start a project"],
    },
    {
      id: "package",
      keys: ["package", "include", "what do i get", "deliverable", "release"],
      reply: "The <b>Release Package ($260)</b> is the best value:\n\n• Full lyric video\n• Cover art — 3 concepts\n• 6 vertical clips cut for Reels/TikTok\n• Captions burned in\n• 5-day delivery\n\nOne session, everything you need for a drop.",
      chips: ["Pricing", "Start a project"],
    },
    {
      id: "speed",
      keys: ["how long", "how fast", "turnaround", "deadline", "when", "delivery time", "duration", "quick", "urgent", "rush"],
      reply: "Visualiser: <b>24 hours</b>\nLyric video: <b>48 hours</b>\nRelease package: <b>5 days</b>\n\nThose are from the moment I get your track and lyrics — not from when you first message me. If you need it faster, say so and I'll tell you honestly whether I can hit it.",
      chips: ["Pricing", "How does it work?", "Start a project"],
    },
    {
      id: "process",
      keys: ["how does it work", "process", "steps", "how it works", "what do i need", "send you", "requirements"],
      reply: "Three steps:\n\n<b>1. You send</b> — the audio file (WAV or MP3) and the lyrics as text\n<b>2. I build</b> — first cut in 24–48h, you get two rounds of changes\n<b>3. You post</b> — final files in vertical (1080×1920) and widescreen (1920×1080)\n\nThat's it. You don't need to install anything.",
      chips: ["Pricing", "How fast?", "Start a project"],
    },
    {
      id: "payment",
      keys: ["pay", "payment", "momo", "mobile money", "mtn", "vodafone", "bank", "transfer", "deposit", "invoice"],
      reply: "Payment is <b>50% deposit, 50% on delivery</b>.\n\nI take MTN MoMo, Vodafone Cash, or bank transfer. You get the clean, unwatermarked file once the balance lands — the preview before that has a watermark, which is standard practice.",
      chips: ["Pricing", "Start a project"],
    },
    {
      id: "revisions",
      keys: ["change", "revision", "edit", "redo", "fix", "adjust", "wrong", "mistake"],
      reply: "Two rounds of changes are included in every tier — lyrics, colours, timing, font. That's normally enough.\n\nIf you need a third round it's $20, because at that point we're usually changing the direction rather than correcting something.",
      chips: ["Pricing", "Start a project"],
    },
    {
      id: "formats",
      keys: ["format", "resolution", "vertical", "horizontal", "1080", "size", "aspect", "instagram", "reels", "tiktok", "youtube"],
      reply: "Every video comes in <b>two formats</b> from one render:\n\n• <b>1080 × 1920</b> vertical — Reels, TikTok, Shorts\n• <b>1920 × 1080</b> widescreen — YouTube, TV\n\nBoth H.264 MP4 with AAC audio, ready to upload. No conversion needed on your end.",
      chips: ["Pricing", "How fast?", "Start a project"],
    },
    {
      id: "lyrics",
      keys: ["lyric", "lyrics", "words", "transcri", "text", "sync"],
      reply: "Send the lyrics as plain text — one line per line, the way it should appear on screen.\n\nIf you don't have them written out, send the track anyway and I'll transcribe it and sync word-by-word. That's included, not extra.",
      chips: ["How does it work?", "Pricing"],
    },
    {
      id: "sound",
      keys: ["beat", "react", "sync", "motion", "background", "visual", "style", "colours", "colors", "look"],
      reply: "The background reads your track's energy and moves with it — kicks, drops, builds. Every song gets a different visual because every song has different energy.\n\nYou pick the palette: hot (red/gold), cold (blue), warm, or icy. Or send me a reference and I'll match it.",
      chips: ["Pricing", "Start a project"],
    },
    {
      id: "who",
      keys: ["who are you", "who is", "about", "studio", "where", "based", "location", "accra", "ghana"],
      reply: `<b>${BRAND}</b> is a video studio in Accra, Ghana. We make lyric videos, visualisers and edits for independent artists.\n\nSmall on purpose — one person, direct communication, no account managers. You message me, I answer.`,
      chips: ["Pricing", "See the work"],
    },
    {
      id: "work",
      keys: ["portfolio", "example", "see work", "show me", "demo", "sample", "previous", "reference"],
      reply: "There's a beat-reactive lyric video demo at the top of this page — scroll up to <b>Selected Work</b>.\n\nBetter: send me a track and I'll cut you a <b>15-second sample free</b>, so you're judging your own song rather than someone else's.",
      chips: ["Start a project", "Pricing"],
    },
    {
      id: "free",
      keys: ["free", "trial", "test", "sample free", "free sample", "free trial", "no charge", "try"],
      reply: "Yes — <b>one free 15-second sample</b> from your own track.\n\nSend the audio and I'll cut a section so you can see the style before paying anything. If you don't like it, you keep the clip and we part ways.",
      chips: ["Start a project", "Pricing"],
    },
    {
      id: "human",
      keys: ["human", "person", "talk to", "call", "whatsapp", "phone", "contact", "email", "speak"],
      reply: `Of course — email me directly:\n\n<b>${EMAIL}</b>\n\nOr tap the button below and it opens a draft with the subject already filled in. I reply within a few hours, Ghana time.`,
      chips: ["Email me", "Pricing"],
    },
    {
      id: "hello",
      keys: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "yo", "sup"],
      reply: "Hey 👋 What are you working on — a track that needs a video, or are you just checking pricing?",
      chips: ["Pricing", "How does it work?", "See the work"],
    },
    {
      id: "thanks",
      keys: ["thanks", "thank you", "cheers", "appreciate", "nice", "cool", "great"],
      reply: "Anytime. If you want to move on it, send the track and lyrics to the email and I'll start the sample tonight.",
      chips: ["Start a project", "Pricing"],
    },
  ];

  const FALLBACK = {
    reply: "I'm not sure I got that one. I can help with <b>pricing</b>, <b>turnaround</b>, <b>how it works</b>, <b>payment</b> or <b>formats</b> — or put you straight through to Dennis.",
    chips: ["Pricing", "How fast?", "Email me"],
  };

  const GREETING = {
    reply: "Hey — this is the Phantom Ghost studio assistant 👻\n\nAsk me anything about pricing, turnaround or how it works. If you'd rather talk to a person, just say so.",
    chips: ["Pricing", "How fast?", "How does it work?"],
  };

  /* ── matching ────────────────────────────────────────────────────────── */
  function match(text) {
    const t = " " + text.toLowerCase().replace(/[^\w\s$]/g, " ").replace(/\s+/g, " ") + " ";
    let best = null, bestScore = 0;
    for (const item of KB) {
      let score = 0;
      for (const k of item.keys) {
        if (t.includes(k)) score += k.includes(" ") ? 3 : 2;
      }
      if (score > bestScore) { bestScore = score; best = item; }
    }
    return bestScore >= 2 ? best : null;
  }

  function resolveChip(label) {
    const l = label.toLowerCase();
    if (l.includes("email") || l.includes("human")) return { type: "email" };
    if (l.includes("see the work")) {
      const el = document.getElementById("work");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      return { type: "reply", reply: "Scrolled you to the demo — it's the vertical video just above." };
    }
    if (l.includes("start a project")) return { type: "email" };
    const hit = match(label);
    return { type: "reply", reply: hit ? hit.reply : FALLBACK.reply, chips: hit ? hit.chips : FALLBACK.chips };
  }

  /* ── styles ──────────────────────────────────────────────────────────── */
  const CSS = `
  #pgchat-btn{position:fixed;right:22px;bottom:22px;z-index:9000;width:60px;height:60px;border-radius:50%;
    background:#EEECE7;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;
    box-shadow:0 8px 30px rgba(0,0,0,.55);transition:transform .2s,background .2s}
  #pgchat-btn:hover{transform:translateY(-2px);background:#fff}
  #pgchat-btn svg{width:26px;height:26px}
  #pgchat-btn .dot{position:absolute;top:9px;right:9px;width:9px;height:9px;border-radius:50%;
    background:#B0D0E0;box-shadow:0 0 0 2px #EEECE7}
  #pgchat-panel{position:fixed;right:22px;bottom:94px;z-index:9001;width:380px;max-width:calc(100vw - 32px);
    height:540px;max-height:calc(100vh - 130px);background:#0E1014;border:1px solid rgba(238,236,231,.16);
    border-radius:10px;display:none;flex-direction:column;overflow:hidden;
    box-shadow:0 24px 70px rgba(0,0,0,.72);font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif}
  #pgchat-panel.open{display:flex}
  .pgc-head{display:flex;align-items:center;gap:11px;padding:15px 17px;border-bottom:1px solid rgba(238,236,231,.11);
    background:#07080A;flex:0 0 auto}
  .pgc-head img{width:28px;height:28px}
  .pgc-head .t{flex:1}
  .pgc-head .n{font-family:Georgia,serif;font-size:14px;letter-spacing:.16em;color:#EEECE7}
  .pgc-head .s{font-size:11px;color:#8A8A85;margin-top:2px;display:flex;align-items:center;gap:5px}
  .pgc-head .s i{width:6px;height:6px;border-radius:50%;background:#7FD1A6;display:inline-block}
  .pgc-head button{background:none;border:none;color:#8A8A85;font-size:20px;cursor:pointer;line-height:1;padding:2px 4px}
  .pgc-head button:hover{color:#EEECE7}
  .pgc-body{flex:1;overflow-y:auto;padding:18px 16px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth}
  .pgc-body::-webkit-scrollbar{width:5px}
  .pgc-body::-webkit-scrollbar-thumb{background:rgba(238,236,231,.16);border-radius:3px}
  .pgc-msg{max-width:86%;padding:11px 14px;border-radius:11px;font-size:14px;line-height:1.55;
    white-space:pre-wrap;word-wrap:break-word;animation:pgcIn .22s ease-out}
  @keyframes pgcIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
  .pgc-bot{background:#171A20;color:#DCDAD4;border-bottom-left-radius:3px;align-self:flex-start}
  .pgc-bot b{color:#EEECE7}
  .pgc-me{background:#EEECE7;color:#07080A;border-bottom-right-radius:3px;align-self:flex-end}
  .pgc-typing{display:flex;gap:4px;padding:14px 16px;background:#171A20;border-radius:11px;
    border-bottom-left-radius:3px;align-self:flex-start;width:fit-content}
  .pgc-typing span{width:6px;height:6px;border-radius:50%;background:#6E6E6A;animation:pgcB 1.2s infinite}
  .pgc-typing span:nth-child(2){animation-delay:.18s}
  .pgc-typing span:nth-child(3){animation-delay:.36s}
  @keyframes pgcB{0%,60%,100%{opacity:.35;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}
  .pgc-chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:2px}
  .pgc-chip{background:none;border:1px solid rgba(176,208,224,.42);color:#B0D0E0;font-size:12px;
    padding:7px 13px;border-radius:20px;cursor:pointer;transition:.18s;font-family:inherit}
  .pgc-chip:hover{background:rgba(176,208,224,.13);border-color:#B0D0E0}
  .pgc-foot{flex:0 0 auto;border-top:1px solid rgba(238,236,231,.11);padding:11px;display:flex;gap:8px;background:#07080A}
  .pgc-foot input{flex:1;background:#14161B;border:1px solid rgba(238,236,231,.14);border-radius:7px;
    padding:11px 13px;color:#EEECE7;font-size:14px;outline:none;font-family:inherit}
  .pgc-foot input:focus{border-color:rgba(176,208,224,.55)}
  .pgc-foot input::placeholder{color:#5E5E5A}
  .pgc-foot button{background:#EEECE7;border:none;border-radius:7px;width:42px;cursor:pointer;
    display:flex;align-items:center;justify-content:center;transition:.18s}
  .pgc-foot button:hover{background:#fff}
  .pgc-foot button svg{width:17px;height:17px}
  @media(max-width:460px){
    #pgchat-panel{right:8px;left:8px;width:auto;bottom:88px;height:calc(100vh - 150px)}
    #pgchat-btn{right:16px;bottom:16px;width:54px;height:54px}
  }`;

  /* ── build ───────────────────────────────────────────────────────────── */
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  const style = el("style");
  style.textContent = CSS;
  document.head.appendChild(style);

  const btn = el("button");
  btn.id = "pgchat-btn";
  btn.setAttribute("aria-label", "Chat with Phantom Ghost");
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="#07080A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg><span class="dot"></span>`;

  const panel = el("div");
  panel.id = "pgchat-panel";
  panel.innerHTML = `
    <div class="pgc-head">
      <img src="assets/mark.png" alt="">
      <div class="t">
        <div class="n">PHANTOM GHOST</div>
        <div class="s"><i></i> Online — replies instantly</div>
      </div>
      <button id="pgc-x" aria-label="Close chat">&times;</button>
    </div>
    <div class="pgc-body" id="pgc-body"></div>
    <div class="pgc-foot">
      <input id="pgc-in" type="text" placeholder="Ask about pricing, turnaround…" autocomplete="off">
      <button id="pgc-send" aria-label="Send">
        <svg viewBox="0 0 24 24" fill="none" stroke="#07080A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>`;

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  const body  = panel.querySelector("#pgc-body");
  const input = panel.querySelector("#pgc-in");
  const dot   = btn.querySelector(".dot");
  let started = false, busy = false;

  function scroll() { body.scrollTop = body.scrollHeight; }

  function addMe(text) {
    const m = el("div", "pgc-msg pgc-me");
    m.textContent = text;
    body.appendChild(m);
    scroll();
  }

  function addBot(text, chips) {
    const m = el("div", "pgc-msg pgc-bot", text);
    body.appendChild(m);
    if (chips && chips.length) {
      const wrap = el("div", "pgc-chips");
      chips.forEach(c => {
        const b = el("button", "pgc-chip");
        b.textContent = c;
        b.onclick = () => handleChip(c);
        wrap.appendChild(b);
      });
      body.appendChild(wrap);
    }
    scroll();
  }

  function typing(on) {
    let t = body.querySelector(".pgc-typing");
    if (on && !t) {
      t = el("div", "pgc-typing", "<span></span><span></span><span></span>");
      body.appendChild(t);
      scroll();
    } else if (!on && t) {
      t.remove();
    }
  }

  function botSay(text, chips, delay) {
    busy = true;
    typing(true);
    const d = delay !== undefined ? delay : Math.min(1100, 260 + text.length * 5);
    setTimeout(() => {
      typing(false);
      addBot(text, chips);
      busy = false;
    }, d);
  }

  function emailMe() {
    const sub = encodeURIComponent("Music video enquiry — " + BRAND);
    const bodyTxt = encodeURIComponent(
      "Hi Dennis,\n\nTrack:\nDeadline:\nStyle I like:\n\n");
    window.location.href = `mailto:${EMAIL}?subject=${sub}&body=${bodyTxt}`;
  }

  function handleChip(label) {
    addMe(label);
    const r = resolveChip(label);
    if (r.type === "email") {
      botSay("Opening your email app with the details filled in — just add your track and send.", ["Pricing"], 600);
      setTimeout(emailMe, 500);
    } else {
      botSay(r.reply, r.chips, 700);
    }
  }

  function send(text) {
    const v = (text || input.value || "").trim();
    if (!v || busy) return;
    input.value = "";
    addMe(v);

    if (/^email me$/i.test(v)) { emailMe(); return; }

    const hit = match(v);
    if (hit) {
      botSay(hit.reply, hit.chips);
    } else {
      botSay(FALLBACK.reply, FALLBACK.chips);
    }
  }

  /* ── events ──────────────────────────────────────────────────────────── */
  btn.onclick = () => {
    const open = panel.classList.toggle("open");
    dot.style.display = open ? "none" : "block";
    if (open && !started) {
      started = true;
      botSay(GREETING.reply, GREETING.chips, 500);
    }
    if (open) setTimeout(() => input.focus(), 260);
  };

  panel.querySelector("#pgc-x").onclick = () => {
    panel.classList.remove("open");
    dot.style.display = "block";
  };

  panel.querySelector("#pgc-send").onclick = () => send();
  input.addEventListener("keydown", e => { if (e.key === "Enter") send(); });

  // deep link: site/#chat opens the panel
  if (location.hash === "#chat") {
    panel.classList.add("open");
    dot.style.display = "none";
    started = true;
    botSay(GREETING.reply, GREETING.chips, 300);
  }

  // gentle nudge after 22s, once per session
  setTimeout(() => {
    if (started || sessionStorage.getItem("pgc_nudged")) return;
    sessionStorage.setItem("pgc_nudged", "1");
    dot.style.display = "block";
  }, 22000);
})();
