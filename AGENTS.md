<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Each user's app data is one JSON document in `user_data` (RLS by user_id), loaded/saved by `src/lib/store.ts`; sales feed the finance ledger via `ledger()` — keeps the prototype store API unchanged.
- App pages live under `src/routes/_authenticated/` (gate + AppShell in its route.tsx); `/auth` is the public sign-in page.
