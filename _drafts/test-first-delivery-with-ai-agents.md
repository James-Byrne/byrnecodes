---
layout: blog_post
title: "Shipping test-first with AI agents"
description: "How I build Bogha with AI coding agents without losing control: one card at a time, a hook that refuses code without a test, and nothing merged until I've seen it run."
topics: [AI, Testing, Workflow]
image: /assets/img/social/test-first-delivery-with-ai-agents.png
---

[Draft: written from how Bogha is actually built. Check the voice, trim, and add your own opinions before publishing.]

## The problem with fast

AI coding agents are fast. Give one a vague request and it will happily write a few hundred lines, tell you it's done, and be wrong in ways you won't notice until a user does. Speed isn't the hard part any more. Knowing the change is right is.

So for Bogha, my archery training app for iPhone and Apple Watch, I stopped asking "how do I get the agent to write more?" and started asking "what would make me trust what it writes?"

## One card at a time

Every piece of work is a card: a small markdown file with a type, a status and a link to its spec. An agent picks up the top ready card, writes a plan, and stops. Nothing gets built until I've read the plan and said yes.

The card is the unit of everything: one card per branch, one card per pull request, and every commit carries a `Card:` trailer so I can find a card's whole history later. When a defect turns up halfway through, it doesn't get fixed quietly in the same branch. It gets its own card.

## A hook that says no

The rule that changed the most is the simplest: **no production code without a failing test first.**

Agents are very good at agreeing with a rule and then not following it, so I don't ask. A hook refuses any edit to production Swift until a test file has changed since the last commit. A commit that touches production code without a test needs an explicit `No-Test:` reason in its message, and that reason gets logged on the card.

Every bug fix comes with a regression test, and the test has to be proven: put the bug back, watch the test fail, take it out again.

## Green isn't the same as working

Tests aren't the whole story, and I learned that the expensive way. Bogha syncs through SwiftData and CloudKit. Both test suites were green on a change that couldn't open any existing user's data, because the tests use fresh in-memory stores and the real app had a store from yesterday.

Now every schema change gets launched on a simulator that already holds data, with the console attached, and the card can't finish until someone has looked.

## Review, then the simulator, then me

Once the build is done, a review pass checks the branch against the project's own rules: the domain docs, the spec, and the shapes the codebase already uses. It fixes what it safely can, test-first, and stops to ask about the rest.

Then the app gets run on a simulator and the change is checked by hand. Only after that does the card move to device QA, and only my answer there merges it.

## Doing five things at once

For small, well-defined cards I can run a batch: up to five at once, each in its own git worktree, each going through the same plan, build, review and test gates on its own. I come back to a list of branches waiting for QA and the decisions that were taken on my behalf.

[Draft: add numbers here if you have them, e.g. cards shipped per week, or how often QA sends something back.]

## What I'd tell you to steal

- Make the unit of work small and written down before any code exists.
- Enforce test-first with tooling, not with a prompt.
- Treat "the tests pass" as necessary, not sufficient: run the real thing.
- Keep the merge decision human.

[Draft: closing line. Do you offer to set this workflow up for teams? If so, link to the contact band.]
