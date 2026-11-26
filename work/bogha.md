---
layout: case_study
published: false
permalink: /work/bogha/
title: Bogha
description: "An archery training app for iPhone and Apple Watch, built in Swift and SwiftUI, with iCloud sync, on-device AI and scoring from the wrist."
meta: iOS · watchOS · own product · 2026
image: /assets/img/social/bogha.png
hero: /assets/img/work/bogha.jpg
hero_alt: "Three Bogha iPhone screens: a live WA 18m scorecard, the entries list and the weekly progress chart"
facts:
  - label: Role
    value: Design, build and ship, solo
  - label: Platforms
    value: iPhone and Apple Watch
  - label: Stack
    value: Swift · SwiftUI · SwiftData · CloudKit
  - label: Status
    value: "[e.g. in TestFlight]"
---

## The problem

Archers keep their scores on paper, their sight marks in a notebook and their training in their heads. Bogha puts all three in one place: the phone in your quiver pocket and the watch on your wrist.

## What I built

- **Live scorecards** for standard rounds such as WA 18m and WA 720, with end totals, X counts and handicaps.
- **Equipment setups** with sight marks per arrow set, so the right mark is a tap away at each distance.
- **Training plans and progress**: weekly arrow counts, personal bests and upcoming competitions.
- **Video of your shots**, synced over iCloud through a CloudKit pipeline written for large files.
- **Voice notes summarised on the device** with Apple's Foundation Models, so nothing leaves the phone.
- **An Apple Watch app** with a complication, scoring from the wrist and arrow counting from motion.

## How it's built

Bogha is SwiftUI throughout, with SwiftData for storage and CloudKit for sync between the phone, the watch and other devices. Every change starts with a failing test: the project has more than 160 test files across the iOS and watch apps. Work is planned as small cards, built in parallel by AI agents that I review, and checked on a simulator before it ships.

## Results

[Add: who uses it, TestFlight or App Store link, a line from an archer.]
