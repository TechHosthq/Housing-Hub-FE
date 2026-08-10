# Housing Hub — Chat Kickoff Briefs

Three workstreams to run as separate chats in the Housing Hub project.
Paste the relevant brief as the first message in each new chat.

---

## Chat 1 — Content Engine

> **Paste this to start the chat:**
>
> I want a recurring content operation for Housing Hub, a Nigerian proptech
> platform for browsing verified property listings and booking inspections.
> Audience is split: renters/buyers in Lagos, Abuja and Port Harcourt, and
> property owners/agents who list with us.
>
> Before we generate anything, help me decide:
> - Which channels are worth the effort at our stage (Instagram, X, LinkedIn,
>   TikTok, blog/SEO, WhatsApp broadcast)
> - A realistic cadence I can actually sustain
> - 4–6 recurring content pillars, with the reasoning for each
>
> Then draft two weeks of content against that plan so I can judge the quality.
>
> Once we've settled the plan, set it up as a scheduled task that drafts the
> next batch on a recurring basis.

**Why this framing:** asks for the strategy before the output, so the recurring
task is generating against a considered plan rather than improvising each run.

**Set up the recurring run** once the pillars are agreed — scheduled tasks can
draft each batch automatically.

---

## Chat 2 — Next Phase Planning

> Continue in the current chat.

This chat already carries the full context: the 18 bu-fixes, the SignalR work,
the rollback, and the brand refresh. Starting fresh would lose it.

Open threads to pick up:

- `dotnet build` on the BE — the email rewrite is unverified (no dotnet in the
  sandbox where it was written)
- Commit + push the brand work across both repos
- `email-previews/` is sitting in the FE repo — commit, gitignore, or delete
- Optional: real PNG logomark for the email header, replacing the CSS-drawn "H"
- The admin project, once it's connected

---

## Chat 3 — Marketing Strategy

> **Paste this to start the chat:**
>
> I want a go-to-market strategy for Housing Hub, a Nigerian proptech platform.
> We're a two-sided marketplace: renters/buyers browsing verified listings and
> booking inspections, and property owners/agents listing inventory.
>
> Our core differentiator is fraud protection — mandatory KYC on landlords and
> agents, verified listing badges, and an inspection-before-payment protocol.
> Rental fraud is the dominant pain in this market.
>
> Research the current Nigerian property-search landscape before advising —
> who the incumbents are, how they position, and where the gaps sit.
>
> Then work through:
> - Which side of the marketplace to seed first, and why
> - Positioning and messaging per side
> - Channels and rough CAC expectations for this market
> - Launch sequencing, city by city
> - What to measure, and what would tell us the thesis is wrong
>
> Push back on assumptions rather than validating them.

**Why this framing:** the research-first instruction matters — market conditions
here move faster than any model's training data.

---

## Notes

- Chats 1 and 3 will produce better output with the admin project connected,
  since it likely reveals real listing volumes and user counts.
- Chat 3's findings should feed Chat 1's content pillars — run the strategy
  chat first if you're picking an order.
