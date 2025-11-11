<script lang="ts">
    import '../app.css';
    import favicon from '$lib/assets/favicon.svg';
    import { page } from '$app/state';

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen flex flex-col">
    <nav class="bg-slate-900 text-white sticky top-0 z-40 shadow-sm">
        <div class="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
            <a class="flex items-center gap-2 no-underline text-current" href="/">
                <img src={favicon} alt="NTU Chorus logo" class="w-8 h-8" />
                <span class="font-semibold text-base">NTU Chorus Video Tools</span>
            </a>

            <ul class="flex items-center gap-3">
                <li><a class={["px-3 py-1 rounded hover:bg-white/40", page.url.pathname === '/' ? "bg-white/20" : ""]} href="/">Home</a></li>
                <li><a class={["px-3 py-1 rounded hover:bg-white/40", page.url.pathname === '/lyrics-maker' ? "bg-white/20" : ""]} href="/lyrics-maker">Lyrics Maker</a></li>
                <li><a class={["px-3 py-1 rounded hover:bg-white/40", page.url.pathname === '/lyrics-translation' ? "bg-white/20" : ""]} href="/lyrics-translation">Lyrics Translation</a></li>
            </ul>
        </div>
    </nav>

    <div class="flex-1 flex flex-col overflow-y-auto min-h-0">
        {@render children()}
    </div>
</div>
