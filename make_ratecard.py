#!/usr/bin/env python3
"""Phantom Ghost — rate card, 1080×1350 (Instagram / WhatsApp shareable)."""
import os
from PIL import Image, ImageDraw, ImageFont

OUT = "/Users/mac/Documents/deepseek-harness/default-workspace/phantomghost-site/assets"
INK = (7, 8, 10); BONE = (238, 236, 231); DIM = (138, 138, 133)
SPECT = (176, 208, 224); LINE = (38, 40, 45); BODY = (168, 166, 160)

F_DIDOT = "/System/Library/Fonts/Supplemental/Didot.ttc"
F_DIN   = "/System/Library/Fonts/Supplemental/DIN Condensed Bold.ttf"
F_DINL  = "/System/Library/Fonts/Supplemental/DIN Alternate Bold.ttf"

def F(p, s, i=0):
    try:    return ImageFont.truetype(p, s, index=i)
    except Exception: return ImageFont.truetype(p, s)

def tracked(d, x, y, t, f, fill, trk=0):
    for c in t:
        d.text((x, y), c, font=f, fill=fill)
        x += d.textlength(c, font=f) + trk
    return x

def tw(d, t, f, trk=0):
    return sum(d.textlength(c, font=f) for c in t) + trk * max(0, len(t) - 1)


W, H = 1080, 1350
im = Image.new("RGB", (W, H), INK)
d = ImageDraw.Draw(im)
cx = W // 2

# ── mark: ring + sliver ──
r = 52
d.ellipse([cx - r, 86 - r, cx + r, 86 + r], outline=(150, 150, 145), width=2)
for i in range(26):
    t = i / 25
    a = int(255 * (1 - abs(t - 0.5) * 1.35))
    if a > 10:
        d.ellipse([cx - 3, 62 + i * 2, cx + 3, 65 + i * 2], fill=(a, a, a))

f_d32 = F(F_DIDOT, 32)
tracked(d, cx - tw(d, "PHANTOM GHOST", f_d32, 7) / 2, 168, "PHANTOM GHOST", f_d32, BONE, 7)
f_sub = F(F_DIN, 17)
sub = "P R O D U C T I O N S"
d.text((cx - d.textlength(sub, font=f_sub) / 2, 216), sub, font=f_sub, fill=DIM)

# ── headline ──
f_h = F(F_DIDOT, 64)
tracked(d, cx - tw(d, "RATE CARD", f_h, 10) / 2, 280, "RATE CARD", f_h, BONE, 10)
f_l = F(F_DINL, 20)
line = "LYRIC VIDEOS / VISUALISERS / EDITS"
d.text((cx - d.textlength(line, font=f_l) / 2, 362), line, font=f_l, fill=SPECT)

# ── tiers ──
tiers = [
    ("VISUALISER", "$60",
     ["Looping motion visual", "Fits your track exactly", "1080p vertical + wide", "24-hour delivery"], False),
    ("LYRIC VIDEO", "$120",
     ["Word-synced lyrics", "Beat-reactive background", "Vertical + widescreen", "2 styles to choose", "48-hour delivery"], True),
    ("RELEASE PKG", "$260",
     ["Lyric video", "Cover art (3 concepts)", "6 Reels clips", "Captions burned in", "5-day delivery"], False),
]

y, th, gap = 432, 300, 26
cw = (W - 160 - gap * 2) // 3
for i, (name, price, items, feat) in enumerate(tiers):
    x = 80 + i * (cw + gap)
    d.rectangle([x, y, x + cw, y + th], outline=(SPECT if feat else LINE), width=2 if feat else 1)
    if feat:
        d.rectangle([x, y, x + cw, y + 5], fill=SPECT)
    tracked(d, x + 26, y + 30, name, F(F_DIN, 16), SPECT if feat else DIM, 3)
    d.text((x + 26, y + 56), price, font=F(F_DIDOT, 50), fill=BONE)
    f_i = F(F_DINL, 16)
    yy = y + 140
    for it in items:
        d.text((x + 26, yy), "—", font=f_i, fill=SPECT)
        d.text((x + 50, yy), it, font=f_i, fill=BODY)
        yy += 28
    if feat:
        d.rectangle([x + cw - 100, y - 12, x + cw - 12, y + 14], fill=SPECT)
        tracked(d, x + cw - 92, y - 7, "POPULAR", F(F_DIN, 13), INK, 1)

# ── terms ──
ty = y + th + 52
f_t = F(F_DINL, 18)
terms = [
    "50% deposit, 50% on delivery",
    "Two rounds of changes included",
    "Delivery by WeTransfer or Google Drive",
    "Payment by Mobile Money or bank transfer",
]
for i, t in enumerate(terms):
    d.text((80, ty + i * 32), "—", font=f_t, fill=SPECT)
    d.text((106, ty + i * 32), t, font=f_t, fill=(160, 158, 152))

# ── how it works ──
hy = ty + len(terms) * 32 + 62
d.rectangle([80, hy - 40, W - 80, hy - 38], fill=LINE)
tracked(d, 80, hy - 18, "HOW IT WORKS", F(F_DIN, 17), SPECT, 5)

steps = [
    ("01", "SEND", ["Your track, your lyrics", "and your deadline."]),
    ("02", "WE BUILD", ["First cut in 24-48h.", "Two rounds of changes."]),
    ("03", "YOU POST", ["Final files, both formats,", "ready to upload."]),
]
sy = hy + 22
for i, (n, t, body) in enumerate(steps):
    sx = 80 + i * ((W - 160) // 3)
    d.text((sx, sy), n, font=F(F_DIDOT, 40), fill=(58, 62, 68))
    tracked(d, sx, sy + 52, t, F(F_DIN, 20), BONE, 3)
    f_b = F(F_DINL, 16)
    for j, ln in enumerate(body):
        d.text((sx, sy + 86 + j * 24), ln, font=f_b, fill=(150, 148, 143))

# ── footer ──
fy = H - 96
d.rectangle([80, fy - 34, W - 80, fy - 32], fill=LINE)
tracked(d, 80, fy, "ixtjay36@gmail.com", F(F_DIDOT, 30), BONE, 1)
f_w = F(F_DINL, 16)
web = "babytjay373.github.io/phantomghost"
d.text((W - 80 - d.textlength(web, font=f_w), fy + 10), web, font=f_w, fill=SPECT)

im.save(os.path.join(OUT, "rate-card.png"))
im.resize((W // 2, H // 2), Image.LANCZOS).save(os.path.join(OUT, "rate-card-small.png"))
print("  ✅ rate-card.png  1080×1350")
