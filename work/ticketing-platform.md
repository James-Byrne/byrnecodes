---
layout: case_study
published: false
permalink: /work/ticketing-platform/
title: Ticketing platform
description: "Box-office and online-checkout features for a ticketing platform used by venues: annual passes, donations with Gift Aid and Direct Debit, and card-terminal refunds."
meta: Ember · TypeScript · Rails · payments
image: /assets/img/social/ticketing-platform.png
hero: /assets/img/work/ticketing.jpg
hero_alt: "Illustrative box-office screen for a fictional venue: a seat map beside a basket with tickets, an annual pass, a Direct Debit donation with Gift Aid, and a card-terminal payment"
facts:
  - label: Role
    value: Full-stack developer
  - label: Front end
    value: Ember · TypeScript · XState
  - label: Back end
    value: Ruby on Rails · RSpec
  - label: Focus
    value: Box office, checkout and payments
---

## The work

I build features for a ticketing platform that venues use to sell tickets, memberships and donations: the box office their staff use at the counter, and the online checkout their customers use at home. The image above is an illustration, not the product.

## Highlights

- **Annual passes**: selling and renewing memberships from the box office, with their benefits applied at checkout.
- **Recurring donations**: monthly giving by Direct Debit, with Gift Aid declarations captured and kept on file.
- **Card terminals**: taking and refunding chip-and-pin payments, including reversing a payment cleanly when a confirmation is rejected.
- **Email campaigns**: the API behind venues' marketing emails.
- **Reliable flows**: strict TypeScript and state machines for multi-step checkouts, so every step has a known way forward and back.

## Why it matters

A box office is where a venue takes its money. When a terminal drops a connection mid-payment, or a donor ticks Gift Aid, the software has to get it right the first time. That is the part of the job I care about most.
