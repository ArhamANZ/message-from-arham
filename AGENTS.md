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

- Render the flower celebration in its own browser-only canvas effect using CSS palette tokens and pre-rendered character-textured sprites, so the full-screen field remains efficient and adapts to any screen size.
- Keep celebration message delays in a shared, tested constants module so sequence timing stays consistent.
- Use CDN asset pointers for individually curated name-entry photos in a non-repeating, viewport-filling grid that switches to portrait tracks on small or tall screens, so the collage stays varied without a live Google Photos dependency.
