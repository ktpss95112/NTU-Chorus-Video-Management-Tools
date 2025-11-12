<script lang="ts">
    import LyricsLine from './LyricsLine.svelte';

    let videoFile = $state<FileList | null>(null);
    let videoUrl = $state<string | null>(null);
    let lyricsFile = $state<FileList | null>(null);

    let needReactionTime = $state<boolean>(false);
    let reactionTime = $state<number>(0.4);

    let lyrics = $state<Array<{ start: number | null; end: number | null; text: string }>>([]);
    let currentIndex = $state<number>(0);

    let startThisLineCursor = $derived(currentIndex);
    let startNextLineCursor = $derived(lyrics[currentIndex]?.start ? currentIndex + 1 : currentIndex);
    let endThisLineCursor = $derived(currentIndex);

    $effect(() => {
        if (videoFile && videoFile.length > 0) {
            videoUrl = URL.createObjectURL(videoFile[0]);
            return () => {
                URL.revokeObjectURL(videoUrl!);
            };
        }
    });

    $effect(() => {
        if (lyricsFile && lyricsFile.length > 0) {
            // parse lyrics file (split by lines)
            const file = lyricsFile[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
                const parsedLyrics: Array<{ start: number | null; end: number | null; text: string }> = [];
                for (const line of lines) {
                    parsedLyrics.push({ start: null, end: null, text: line });
                }
                if (parsedLyrics.length === 0) {
                    parsedLyrics.push({ start: null, end: null, text: '' });
                }
                lyrics = parsedLyrics;
            };
            reader.readAsText(file);
        }
    });
</script>


<div class="flex flex-col md:flex-row flex-1 min-h-0">
    <aside class="w-1/2 border-r border-gray-200 bg-gray-50 p-8 flex flex-col overflow-hidden">
        <h1 class="text-2xl font-semibold mb-4">字幕</h1>

        {#if lyricsFile && lyricsFile.length > 0}
            <div class="flex items-center gap-4 mb-4 flex-shrink-0">
                你是
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" bind:group={needReactionTime} value={false} class="w-4 h-4 text-indigo-600" />
                    <span class="text-sm font-medium text-gray-700">數拍子</span>
                </label>
                還是
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" bind:group={needReactionTime} value={true} class="w-4 h-4 text-indigo-600" />
                    <span class="text-sm font-medium text-gray-700">聽到唱出來才按</span>
                </label>
                {#if needReactionTime}
                    <div class="ml-4 flex items-center">
                        <label class="text-sm text-gray-600 mr-2">
                            反應時間 (秒)
                            <input type="number" bind:value={reactionTime} min="0" max="1" step="0.1" class="w-32 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </label>
                    </div>
                {/if}
            </div>

            <!-- TODO</div>: fix flex issue, automatically grow to fill remaining space and show scrollbar -->
            <div class="h-[400px] overflow-y-auto space-y-2 p-4 border border-gray-300 rounded-lg bg-gray-100 shadow-md">
                {#each lyrics as lyric, index (index)}
                    <LyricsLine
                        bind:text={lyric.text}
                        bind:start={lyric.start}
                        bind:end={lyric.end}
                        highlightStart={index === startThisLineCursor || index === startNextLineCursor}
                        highlightEnd={index === endThisLineCursor}
                        createLyricsBefore={() => {
                            lyrics = [
                                ...lyrics.slice(0, index),
                                { start: null, end: null, text: '' },
                                ...lyrics.slice(index),
                            ];
                        }}
                        createLyricsAfter={() => {
                            lyrics = [
                                ...lyrics.slice(0, index + 1),
                                { start: null, end: null, text: '' },
                                ...lyrics.slice(index + 1),
                            ];
                        }}
                        deleteThisLine={() => {
                            lyrics = [
                                ...lyrics.slice(0, index),
                                ...lyrics.slice(index + 1),
                            ];
                        }}
                        onfocus={() => {
                            currentIndex = index;
                        }}
                    />
                {/each}
            </div>
        {:else}
            <label class="w-full">
                <div class="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-indigo-500 bg-white text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-700">選取字幕檔案</span>
                    <span class="text-xs text-gray-500">TXT 格式</span>
                </div>
                <input bind:files={lyricsFile} type="file" accept=".txt,text/plain" class="sr-only" />
            </label>
        {/if}
    </aside>

    <main class="w-1/2 p-8 overflow-auto">
        <h1 class="text-2xl font-semibold mb-4">影片</h1>

        {#if videoFile && videoFile.length > 0}
            <div class="relative mb-4 w-full max-h-[60vh]">
                <video src={videoUrl} controls class="w-full h-full bg-black rounded">
                    <track kind="captions" />
                </video>

                <button
                    type="button"
                    aria-label="Close video"
                    onclick={() => { videoFile = null; videoUrl = null; }}
                    class="absolute top-2 right-2 inline-flex items-center justify-center p-1.5 bg-white rounded-full shadow hover:bg-gray-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        {:else}
            <label class="mb-4 w-full">
                <div class="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-indigo-500 bg-white text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-700">選取影片檔案</span>
                    <span class="text-xs text-gray-500">或 拖曳檔案至此 — MP4, MOV, ...</span>
                </div>
                <input bind:files={videoFile} type="file" accept="video/*" class="sr-only" />
            </label>
        {/if}
    </main>
</div>
