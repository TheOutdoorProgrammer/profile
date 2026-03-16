---
layout: post
title: "I Started a Fishing Club for People in Tech"
date: 2026-02-23
description: "Nerds Who Fish is a private, membership-based community for people who work in tech and love the outdoors. Here's why I built it and what it is."
tags: [fishing, tech, community, nerds-who-fish]
icon: "twemoji:fish"
---

I've been a software engineer for over a decade. I've also been fishing since I was a kid. For most of that time, those two parts of my life didn't really overlap. My fishing buddies don't care about Kubernetes. My coworkers don't care about crankbait patterns. And that's fine, but I always thought there had to be other people out there who sit in the same weird overlap.

Turns out there are. A lot of them, actually.

## What is Nerds Who Fish?

[Nerds Who Fish](https://nerdswhofish.com) is a private community for people who work in tech and love the outdoors. Fishing, hunting, trapping, whatever gets you outside. The whole point is having one place where you can talk about both sides of your life without context-switching between two completely different groups of people.

We run on a self-hosted Mattermost instance we call Haven. It's got channels for fishing, hunting, gear talk, DIY projects, home labs, code, devops, hardware, AI, and more. We built a custom profile plugin so members can share what they're into on both sides. It's small and intentional, and we'd like to keep it that way.

## Why not just use Reddit or Discord?

I've been on fishing forums and tech forums for years. They're fine for what they are. But I wanted something smaller. Something where you actually get to know people. A subreddit with 200,000 members isn't a community, it's a feed. And most Discord servers feel the same way after a while.

The membership-based model means everyone who's there actually wants to be there. You apply, we review it, and if you're a good fit you're in. No bots, no lurkers with zero posts, no one trying to sell you stuff. Just people who like fishing and happen to also write code for a living.

## Who is it for?

Anyone in tech. Software engineers, devops, sysadmins, IT, data, hardware, security, whatever. If you spend your working hours staring at a terminal or a dashboard, you qualify. Skill level on the outdoor side doesn't matter at all. We've got people who fish tournaments and people who just bought their first rod.

The outdoor side isn't limited to fishing either. Hunting, trapping, foraging, hiking, whatever. If you're into the outdoors and you work in tech, this is your spot.

## How I built it

The whole thing runs on infrastructure I already had. Mattermost is self-hosted on my home Kubernetes cluster. The landing page and membership application run on Cloudflare Workers. I wrote a custom Mattermost plugin for member profiles so people can share their interests, tech stack, fishing style, and hunting preferences right from the app.

I'll probably write a separate post about the technical side at some point. There's a Turnstile captcha on the application form, a welcome bot that onboards new members, and a bunch of small quality-of-life touches that make it feel like a real community platform instead of a generic chat server.

## Come fish with us

If any of this sounds like your thing, go check out [nerdswhofish.com](https://nerdswhofish.com) and apply. It takes about 30 seconds. We're not looking for a specific type of person, just people who are genuinely into both worlds.

Also, if you want to see what I'm up to outdoors, check out my [YouTube channel](https://youtube.com/@TheOutdoorProgrammer). I post fishing, hunting, and outdoor content there.

See you on the water.
