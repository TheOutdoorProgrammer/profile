---
layout: post
title: "Why Is It Harder to Hit the Sun Than Leave the Solar System?"
date: 2026-04-11
description: "Built an interactive orbital sim to answer this, and the answer is weirder than I expected."
image: /assets/images/blogposts/2026-04-11-hitting-the-sun-title.jpg
icon: "mdi:white-balance-sunny"
tags: [physics, simulation, space, javascript, ai]
---

I was killing time on Reddit tonight and ended up in [this thread on r/askastronomy](https://www.reddit.com/r/askastronomy/s/RPRPtMeeTr). Someone asked how long it takes to reach the Sun. Typical late-night reading. But a commenter dropped a detail that completely derailed my evening: it is actually physically easier to shoot a rocket out of the solar system forever than it is to hit the Sun.

I had to read that sentence a few times. It sounds like a bad joke. The Sun is the biggest object in our neighborhood. It contains 99.8 percent of all the mass around us. Its gravity dictates everything from planetary orbits to the tides. You should be able to just point a ship at it, fire the engines, and fall right in. 

But you can't. And once you understand the physics behind why you can't, it ruins your intuition about space entirely.

I spent the next several hours building an interactive orbital mechanics simulator to prove it to myself. I probably should have just gone to sleep.

Here is the problem. Earth is moving sideways. We are screaming through the void at 29.78 kilometers per second. That translates to roughly 66,000 mph. We don't notice it down here because the ground, the atmosphere, and everything else is moving with us. But the second you launch a rocket off the pad, you inherit that sideways velocity. You are basically throwing a baseball out the window of a speeding car, except the car is moving at Mach 85 and the road is circular.

Orbiting is just falling and missing the ground. If you want to actually hit the Sun, you have to stop missing. You have to kill off that 29.78 km/s of sideways movement. You need a retrograde burn of roughly 30 km/s just to come to a dead stop and let gravity take over. 

Now compare that to leaving. Escape velocity from the Sun at our distance is roughly 42 km/s. Earth is already providing nearly 30 of that just by existing. If you simply fire your engines in the exact direction we are already traveling, you only need to add about 12 km/s of additional prograde velocity to break free forever. 

Thirty to hit the Sun. Twelve to reach the edge of the solar system. 

It takes less than half the effort to abandon our star than it does to touch it. I keep thinking about this math. It goes against every instinct I have from throwing sinkers into a lake or sighting a rifle. You point at the target, you account for a little drop, and you hit it. Space does not care about your intuition. 

Look at the Parker Solar Probe. NASA wanted to get it close to the Sun. They did not build a rocket big enough to kill 30 km/s of orbital velocity. That ship does not exist. Instead, they designed a mission that used seven separate Venus flybys over the course of seven years. They used the gravity of a whole different planet to slowly bleed off their speed, inching closer with each pass. It is an absurd piece of engineering, but it exists because the physics of simply pointing at the target are impossible.

I couldn't let this go. I fired up my editor and leaned on some AI to help me quickly scaffold a simulator. I needed to interact with the physics directly to make it feel real in my head. 

The result is a single HTML file canvas app. I built it mobile-first because I figured I would want to mess with it on my phone later. The physics engine uses 2D Newtonian mechanics with an RK4 integrator to keep the orbits stable over time. I hardcoded the real orbital speeds into the system. Earth gets 29.78 km/s. Venus sits closer at 35 km/s. 

You can play with it live right now at [theoutdoorprogrammer.com/solar/](https://theoutdoorprogrammer.com/solar/). You can launch probes, burn fuel, try retrograde braking, or set up your own Venus gravity assists. 

Building it humbled me quickly. I ran into two bugs that made me question if I should even be allowed near a keyboard. The first was a nasty race condition. The prediction logic was computing the entire ghost trajectory of the probe before launchTimeMs was even set in the state. The aim line was practically a random number generator on the first frame. 

The second bug was a dumb typo in my `fmtSpeed()` function that made the spacecraft appear to crawl through the void at the speed of a riding lawnmower.

I finally got it working right around 2 AM. The sim proves the math on the screen. You burn retrograde, watch your fuel gauge empty instantly, and you barely dent your orbit. You burn prograde, and your trajectory line shoots off the screen and never comes back.

I work in infrastructure. My whole day is configuring clusters and writing deployment scripts. Everything is abstracted behind layers of code, buried under APIs and network policies. Sometimes it takes staying up half the night building a physics toy to remind myself that the universe operates on raw, unbreakable math. The rules are absolute, and they do not care if they make sense to us.