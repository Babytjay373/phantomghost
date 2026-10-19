# Phantom Ghost — how to get the first three clients

**The site is live.** https://babytjay373.github.io/phantomghost/
**Rate card:** `assets/rate-card.png` — send this in DMs.

Nothing below costs money. All of it is sending messages.

---

## The rule that matters

**Do not post "I make lyric videos, DM me."** Nobody replies to that.

**Do this instead:** pick an artist, **make one clip for free from their actual song**, send it
with the message *"made this for you, want the rest?"* — that converts.

**A finished clip is the sales pitch.** Everything else is noise.

---

## Where to find artists

### 1. YouTube — the highest-intent source

Search YouTube for:

```
afrobeats official audio 2026 ghana
ghana drill official video
hiplife new song
[artist name] official audio
```

**Look for:** videos with **1k–50k views**, uploaded in the **last 3 months**, on channels
with no visual identity — plain album art, no lyric video.

**That's your client.** They have a song, an audience, and no video.

### 2. Instagram — search the hashtags

```
#ghanamusic #afrobeatsghana #ghdrill #accramusic #newmusicghana
#undergroundartistgh #ghanadrill #afrobeatsnigeria
```

**Filter by:** recent posts, music clips, artists with 500–20k followers.

### 3. TikTok — the fastest-growing pool

Search `#ghanamusic`, `#afrobeats`, `#newartist`. Look for people posting snippets of
their own tracks with no visual.

### 4. WhatsApp music groups

Ask around — every Ghanaian music scene runs on WhatsApp groups. **One group of 200
artists is worth more than a month of cold DMs.**

### 5. Telegram

Search `Ghana music`, `Afrobeats promo`. Same logic.

---

## The message that works

### WhatsApp / DM — first contact

> Hey [Name] — I make lyric videos. I heard [track name] and cut a 15-second piece
> from it so you can see what it'd look like.
>
> [send the clip]
>
> If you want the full thing it's $120, done in 48 hours. If not, keep the clip —
> no charge.

**Why it works:**
- Leads with **work, not a pitch**
- Names the specific track — proves you listened
- States the price immediately (**hiding it wastes both your time**)
- Removes the risk: *"keep the clip, no charge"*

### Instagram DM — shorter

> yo [name] — made this from [track] 👇
> [clip]
> full version $120, 48hrs. lmk

**Match their register.** Formal emails to drill artists get ignored. Be brief.

### Email — for managers and labels only

> Subject: Lyric video for [Artist] — [Track]
>
> Hi [Name],
>
> I run Phantom Ghost Productions, a video studio in Accra.
>
> I cut a 15-second sample from [Track] so you can see the approach before
> committing to anything: [link]
>
> A full lyric video is $120 and takes 48 hours — word-synced, beat-reactive,
> delivered in vertical and widescreen.
>
> Happy to do the first one at $80 if it helps you test us.
>
> — Dennis
> ixtjay373.github.io/phantomghost

---

## The follow-up (most people skip this — it's where the money is)

**Most replies come from the second or third message.** Not the first.

| When | Message |
|---|---|
| **Day 3** | *"hey — did you see the clip? happy to change the style if that one's not you"* |
| **Day 8** | *"last one from me — offer stands if you want it before your next drop"* |
| **Stop** | After 3. More than that and you're spam. |

**Never guilt-trip. Never "just following up."** Give them a reason: *"before your next drop."*

---

## Making the free sample (10 minutes)

This is the whole engine. Do it once per artist.

```bash
cd music-video

# 1. grab their audio
yt-dlp -x --audio-format wav -o "demo/client.wav" "<youtube url>"

# 2. paste 4-5 lines of their lyrics into a text file
#    (get them from Genius, or transcribe with the caption skill)

# 3. render just 15 seconds
../tools/voice-venv/bin/python make_lyric_video.py \
  --audio demo/client.wav \
  --lyrics demo/client-lyrics.txt \
  --out demo/client-sample.mp4 \
  --limit 15
```

**15 seconds renders in about 45 seconds.** Send it as a WhatsApp video or IG DM.

---

## Pricing — hold the line

| Situation | Do this |
|---|---|
| *"That's too expensive"* | *"I can do $80 for the first one. After that it's $120."* |
| *"Can you do it for $30?"* | *"Not for a full video. I can do a 15-second clip for $30."* |
| *"Do it free and I'll promote you"* | *"I do one free sample — you've got it. The full video is paid."* |
| They want to pay after posting | *"50% now, 50% on delivery. That's how I keep 48-hour turnaround."* |

**Never work for free twice.** The free sample is marketing. The second one is exploitation.

---

## Cash flow

| Stage | Action |
|---|---|
| **Before starting** | **50% deposit.** No deposit, no render. |
| **On delivery** | Send a **watermarked preview**, then the clean file after the balance |
| **Payment** | MTN MoMo / Vodafone Cash / bank transfer |

**The watermark is not distrust — it's standard practice.** Say so plainly:
*"Preview has a watermark, I remove it when the balance lands."*

---

## Realistic expectations

| Metric | Number |
|---|---|
| DMs sent | **30** |
| Replies | **5–8** |
| Free samples made | 5 |
| **Paying clients** | **1–2** |
| **Revenue from that** | **$120–240** |

**Thirty DMs is one evening's work.** At $120 a job, three clients a month is $360 —
and the second month is easier because you have a portfolio.

**The first client is the hardest. Everything after that is repeatable.**

---

## Today's list — do this now

1. **Pick 10 artists** from YouTube search (1k–50k views, last 3 months, no lyric video)
2. **Download 3 of their tracks**
3. **Render one 15-second sample each** (~3 minutes total)
4. **Send 10 messages** with the clip attached
5. **Follow up on day 3**

**That's the entire business.** Everything else — the logo, the site, the rate card —
exists to make those ten messages land.

---

## ⚠️ The one thing to avoid

**Don't sell "AI-generated videos."** It invites the question *"so it's cheap, why are
you charging $120?"* and it makes you sound like a tool, not a studio.

**Sell the outcome:** *"a lyric video for your track, in 48 hours."*

How it's made is your business. What they buy is a finished video.
