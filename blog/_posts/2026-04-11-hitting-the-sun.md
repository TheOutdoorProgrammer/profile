---
layout: post
title: "Why Is It Harder to Hit the Sun Than Leave the Solar System?"
date: 2026-04-11
description: "Built an interactive orbital sim to answer this, and the answer is weirder than I expected."
image: /assets/images/blogposts/2026-04-11-hitting-the-sun-title.jpg
icon: "mdi:white-balance-sunny"
tags: [physics, simulation, space, javascript, ai]
---

So I stumbled into this fact a while back and it kicked around in my head until it wouldn't leave: it's harder to hit the Sun than to escape the solar system. Not just a little harder. Like, significantly harder. And the reason is one of those things that's obvious once someone explains it but somehow never clicked for me.

Earth is moving. Really moving. We're whipping around the Sun at about 29.78 kilometers per second sideways. That's roughly 66,000 miles per hour for anyone still on imperial. When you launch from Earth, you inherit that velocity whether you like it or not. You're already falling around the Sun—you've just learned to ignore it because the floor stays solid under your feet.

To actually fall into the Sun, you need to cancel that sideways motion. You need to slow down enough that gravity wins, and gravity is currently losing hard because you're moving too fast sideways. The delta-v required to kill a 29.78 km/s tangential velocity is roughly 30 km/s. That's a big burn.

Here's where it gets weird. Escape velocity from the Sun at Earth's orbit is about 42 km/s. That's the speed you'd need to coast away from the Sun forever—you're already doing 29.78 km/s, so you only need another 12 km/s or so. But to hit the Sun, you're trying to kill all 30 km/s of your sideways speed. A 30 km/s retrograde burn costs more delta-v than a 12 km/s prograde burn. The solar escape is easier. The math is simple. It still feels backwards.

Parker Solar Probe figured this out the hard way. It actually wants to get close to the Sun, not fall into it, but the principle is the same—it needs to shed orbital energy. Seven Venus flybys over seven years, bleeding off speed a little at a time, inching inward with each pass. You can't just point at the Sun and fire. Physics doesn't work that way, and I find that genuinely satisfying to think about.

I wanted to see this myself, so I built a little sim. It's at theoutdoorprogrammer.com/solar/ if you want to play with it. One HTML file, canvas-based, mobile-first because that's where I usually break things. You can aim your probe, fire thrusters, try retro braking, enable Venus gravity assists if you want to get clever. There's an unlimited fuel toggle because sometimes you just want to experiment without playing by the rules.

The physics is real-ish. I'm using 2D Newtonian mechanics, RK4 integration for accuracy, actual orbital speeds (Earth at 29.78 km/s, Venus at 35 km/s), and real gravitational constants scaled for visualization. Nothing too fancy, but it behaves like you'd expect.

There were bugs. The aim prediction line had a race condition where it was computing a ghost trajectory before launchTimeMs was even set. I found a fmtSpeed() function that was multiplying km/s by 2.23694 instead of 2236.94—so every speed readout was comically wrong until that got sorted out. Mobile viewport centering broke in a way that was embarrassing enough that I'm not going to detail it here. Nothing dramatic — just the usual moment where you see it and feel stupid for missing it.

The thing that still gets me is the scale. Earth's tangential velocity is 29.78 km/s. That's enormous. We don't experience it because we're locked into the same motion, but launch something and suddenly you have to deal with it. The Sun looks close in diagrams. It's not. And hitting it means having to deal with all that sideways momentum you didn't ask for.

Anyway. Built it in an evening with some AI help. The code is messy and probably has more bugs I haven't found. It works well enough to show the concept, and that's what I was after.

You can play with it here: [theoutdoorprogrammer.com/solar/](https://theoutdoorprogrammer.com/solar/)
