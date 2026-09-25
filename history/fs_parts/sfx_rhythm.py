# ---------------- SFX score (rhythm-locked: every hit sits on the music's grid) ----------------
FG = 0.24   # foreground reference amplitude (~ -12dB)
MB, K8 = 0.63832, 9.0197
vb = lambda k: K8 + MB * (k - 8)       # beat index -> film time (94 BPM)
S16 = MB / 4

# S1 chaos: tile ticks + slip-off airy whoosh (the music has not entered yet)
for i in range(7):
    place(tick(1900 + i * 90, 0.028), 0.15 + i * 0.07, pan=(-0.35 + 0.12 * i), gain=FG * 0.28)
place(whoosh(0.7, 120, 1200, 0.55), 3.28, gain=FG * 0.5)

# scene whoosh S1->S2
place(whoosh(0.5), 4.341, gain=FG * 0.8)      # peaks on beat 4.551 (slide)
# S2 friction: question pops on the 2+, clock ticks with every counter step, the typing dots tick on the last two 16ths
place(pop(560, 0.14), vb(1.5), gain=FG * 0.55)
for j, k in enumerate([kk + d for kk in range(2, 8) for d in (0.5, 0.75)]):
    place(tick(2100 + (j % 3) * 160, 0.022), vb(k), pan=-0.15 + 0.15 * (j % 3), gain=FG * 0.16)
for k in range(3, 9):
    place(tick(1250, 0.03), vb(k), gain=FG * 0.22)
place(pop(480, 0.15), vb(4), gain=FG * 0.4)

# S2->S3 + gravity absorbs + ignition
place(whoosh(0.55), 9.433, gain=FG * 0.8)     # peaks on beat 9.658 (zoom-through)
for i, k in enumerate([10, 10.5, 11, 11.25, 11.5, 11.75]):
    place(absorb(i), vb(k) - 0.005, pan=(-0.3 if i % 2 else 0.3), gain=FG * 0.46)
place(riser(1.25), vb(12) - 1.25, gain=FG * 0.36)          # charge-up swell into the downbeat
place(thump(58, 0.9, 0.7), 11.585, gain=FG * 1.0)
place(bandnoise(int(0.8 * SR), 2800, 8000) * env(0.8, 0.01, 0.78, 3.5)[:int(0.8 * SR)] * 0.5, 11.62, gain=FG * 0.5)

# S3->S4 ring + node pings: one per node, with its word (D minor arpeggio)
place(whoosh(0.45, 220, 2000), vb(14.5) - 0.12, gain=FG * 0.55)
for i, (f, k) in enumerate(zip([293.66, 349.23, 440.00, 587.33], [16, 17.5, 19, 20])):
    place(ping(f, 1.0), vb(k) - 0.004, pan=[0, 0.3, 0, -0.3][i], gain=FG * 0.62)
place(pop(500, 0.15), vb(22), gain=FG * 0.4)

# S4->S5 model: chips on 16ths from the whip beat, objects on 16ths, links on 8ths, hub on beat 2
place(whoosh(0.5), 20.299, gain=FG * 0.75)    # peaks on beat 20.509 (whip)
for i in range(4):
    place(whoosh(0.3, 400, 3000, 0.5), vb(26) + i * S16 - 0.12, pan=(-0.4 + 0.27 * i), gain=FG * 0.3)
for i in range(6):
    place(blip(700 + 60 * i, 0.08), vb(29) + i * S16, pan=(-0.3 + 0.12 * i), gain=FG * 0.3)
for i in range(5):
    place(tick(2500 + 120 * i, 0.024), vb(30.5) + i * MB / 2, pan=(0.3 - 0.12 * i), gain=FG * 0.24)
place(pop(500, 0.15), vb(33), gain=FG * 0.4)

# S5->S6 contract + spinner + content
place(whoosh_rev(0.6), 26.835, gain=FG * 0.6)
place(pop(640, 0.14), vb(37), gain=FG * 0.45)
place(pop(520, 0.16), vb(39), gain=FG * 0.42)
for i in range(3):
    place(pop(620 + i * 60, 0.11), vb(40) + i * S16, pan=0.1 - 0.1 * i, gain=FG * 0.3)

# S6->S7 decisions: stats on 16ths, lift on beat 4, hover a 16th early, click on beat 4, success on the downbeat
place(whoosh(0.4, 260, 2400), 34.385, gain=FG * 0.55)
for i in range(4):
    place(blip(760 + i * 70, 0.07), vb(48.5) + i * S16, pan=0.25 - 0.16 * i, gain=FG * 0.26)
place(swell(0.7, 180, 1000), vb(51) - 0.35, gain=FG * 0.35)
place(blip(980, 0.06), vb(54.75), gain=FG * 0.3)            # hover
click = np.concatenate([key(2000), np.zeros(int(0.035 * SR)), key(1500) * 0.6])
place(click, vb(55) - 0.003, gain=FG * 0.95)
place(chime_success(), vb(56), gain=FG * 0.8)
place(pop(480, 0.15), vb(56.5), gain=FG * 0.38)

# S7->S8 shield: one ring snap per 8th from the downbeat
place(whoosh_rev(0.55), 41.585, gain=FG * 0.6)
for i in range(6):
    place(snap(i), vb(60) + i * MB / 2, pan=(-0.12 + 0.05 * i), gain=FG * 0.66)
place(swell(1.0, 140, 900), vb(66) - 0.1, gain=FG * 0.3)
place(pop(500, 0.15), vb(66.5), gain=FG * 0.36)

# S8->S9 ask: one key per 32nd from the breakdown downbeat, send on the 3+, answer words on 16ths
place(whoosh(0.5), 48.385, gain=FG * 0.75)
for j in range(20):
    place(key(1500 + (j * 53 % 7) * 90), vb(72) + j * MB / 8, pan=-0.1 + 0.02 * (j % 5), gain=FG * 0.34)
place(blip(1040, 0.09), vb(74.5), gain=FG * 0.4)           # send
for i in range(15):
    place(tick(2300 + (i % 4) * 150, 0.02), vb(75.75) + i * S16, pan=0.12, gain=FG * 0.15)
place(pop(560, 0.13), vb(79.5), gain=FG * 0.32)

# S9->S10 logo bloom on the drop, end-card lines on the downbeats
place(riser(0.65), vb(81) - 0.65, gain=FG * 0.55)
place(bloom(), vb(81) - 0.01, gain=FG * 1.0)
place(pop(440, 0.16), vb(82), gain=FG * 0.3)
place(pop(470, 0.15), vb(84), gain=FG * 0.28)
place(pop(500, 0.15), vb(86), gain=FG * 0.28)

