<script lang="ts">
    import '../app.css';
    import favicon from '$lib/assets/favicon.svg';
    import { page } from '$app/state';
    import { resolve, asset } from '$app/paths';

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen flex flex-col">
    <nav class="bg-slate-900 text-white sticky top-0 z-40 shadow-sm">
        <div class="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
            <a class="flex items-center gap-2 no-underline text-current" href={resolve("/")}>
                <img src={favicon} alt="NTU Chorus logo" class="w-8 h-8" />
                <span class="font-semibold text-base">NTU Chorus Video Tools</span>
            </a>

            <ul class="flex items-center gap-3">
                <li><a class={["px-3 py-1 rounded hover:bg-white/40", page.url.pathname === resolve('/') ? "bg-white/20" : ""]} href={resolve("/")}>首頁</a></li>
                <li><a class={["px-3 py-1 rounded hover:bg-white/40", page.url.pathname === resolve('/lyrics-maker') ? "bg-white/20" : ""]} href={resolve("/lyrics-maker")}>上字幕</a></li>
                <li><a class={["px-3 py-1 rounded hover:bg-white/40", page.url.pathname === resolve('/lyrics-translation') ? "bg-white/20" : ""]} href={resolve("/lyrics-translation")}>歌詞翻譯</a></li>
                <li><a class="px-3 py-1 rounded hover:bg-white/40" href={asset("/old-files/index.html")}>舊版工具</a></li>
            </ul>
        </div>
    </nav>

    <div class="flex-1 flex flex-col min-h-0">
        {@render children()}
    </div>

    <footer class="bg-slate-800 text-slate-200 text-sm py-2 mt-auto">
        <div class="max-w-5xl mx-auto px-4">
            <div class="flex items-center justify-center gap-3 leading-none">
                <span>Credit: <a class="hover:underline" target="_blank" rel="noopener noreferrer" href="https://github.com/wiwikuan/fast-srt-subtitle">NiceChord (好和弦) 上字幕工具</a></span>
                <span class="text-white/40">|</span>
                <a
                    href={import.meta.env.VITE_GITHUB_REPO ? `https://github.com/${import.meta.env.VITE_GITHUB_REPO}` : '#'}
                    class="flex items-center gap-2 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View source code on GitHub"
                >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span>Source Code</span>
                </a>
            </div>
        </div>
    </footer>
</div>
