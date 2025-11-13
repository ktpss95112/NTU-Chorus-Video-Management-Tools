<script lang="ts">
    import LyricsLine from './LyricsLine.svelte';
    import VideoPanel from './VideoPanel.svelte';

    let lyricsFile = $state<FileList | null>(null);

    let needReactionTime = $state<boolean>(false);
    let reactionTime = $state<number>(0.4);

    let lyrics = $state<Array<{ start: number | null; end: number | null; text: string; ele: LyricsLine | null }>>([]);
    let currentIndex = $state<number>(0);
    let startThisLineCursor = $derived(currentIndex);
    let startNextLineCursor = $derived(lyrics[currentIndex]?.start ? currentIndex + 1 : currentIndex);
    let endThisLineCursor = $derived(currentIndex);

    let inputMode = $state<'manual' | 'keyboard'>('keyboard');

    let lyricsContainerElement = $state<HTMLDivElement | null>(null);
    let videoPanelElement = $state<VideoPanel | null>(null);

    $effect(() => {
        if (lyricsFile && lyricsFile.length > 0) {
            // parse lyrics file (split by lines)
            const file = lyricsFile[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
                const parsedLyrics: Array<{ start: number | null; end: number | null; text: string; ele: LyricsLine | null }> = [];
                for (const line of lines) {
                    parsedLyrics.push({ start: null, end: null, text: line, ele: null });
                }
                if (parsedLyrics.length === 0) {
                    parsedLyrics.push({ start: null, end: null, text: '', ele: null });
                }
                lyrics = parsedLyrics;
            };
            reader.readAsText(file);
        }
    });

    $effect(() => {
        // scroll so that currentIndex and (currentIndex + 1) is visible
        const currLyricsRect = lyrics[currentIndex]?.ele?.ele?.getBoundingClientRect();
        const nextLyricsRect = lyrics[currentIndex + 1]?.ele?.ele?.getBoundingClientRect();
        const mergedTop = currLyricsRect ? currLyricsRect.top : nextLyricsRect ? nextLyricsRect.top : null;
        const mergedBottom = nextLyricsRect ? nextLyricsRect.bottom : currLyricsRect ? currLyricsRect.bottom : null;
        const containerRect = lyricsContainerElement?.getBoundingClientRect();
        if (mergedTop !== null && mergedBottom !== null && containerRect) {
            if (mergedTop < containerRect.top) {
                // scroll up
                lyricsContainerElement!.scrollBy({ top: mergedTop - containerRect.top - 8, behavior: 'smooth' });
            } else if (mergedBottom > containerRect.bottom) {
                // scroll down
                lyricsContainerElement!.scrollBy({ top: mergedBottom - containerRect.bottom + 8, behavior: 'smooth' });
            }
        }
    });

    function getTimestamp() {
        const timestamp = videoPanelElement?.currentTime() || 0;
        if (needReactionTime) {
            return Math.max(0, timestamp - reactionTime);
        }
        return timestamp;
    }

    const callbacks = $derived<Record<string, { key: string; cb: () => void }>>({
        startThisLine: {
            key: 'j',
            cb: () => {
                if (lyrics[currentIndex]) {
                    lyrics[currentIndex].start = getTimestamp();
                    // ensure end is not before start
                    if (lyrics[currentIndex].end !== null && lyrics[currentIndex].end! < lyrics[currentIndex].start!) {
                        lyrics[currentIndex].end = null;
                    }
                }
            },
        },
        startNextLine: {
            key: 'k',
            cb: () => {
                if (lyrics[currentIndex] && lyrics[currentIndex].start === null) {
                    // if current line hasn't started yet, start it
                    lyrics[currentIndex].start = getTimestamp();
                } else {
                    // end current line if needed
                    if (lyrics[currentIndex].end === null) {
                        lyrics[currentIndex].end = getTimestamp();
                    }
                    // start next line if exists
                    if (lyrics[currentIndex + 1]) {
                        lyrics[currentIndex + 1].start = getTimestamp();
                        currentIndex = Math.min(currentIndex + 1, lyrics.length - 1);
                    }
                }
            },
        },
        endThisLine: {
            key: 'l',
            cb: () => {
                if (lyrics[currentIndex]) {
                    lyrics[currentIndex].end = getTimestamp();
                    // clear next line's start if it's before this end
                    if (lyrics[currentIndex + 1] && lyrics[currentIndex + 1].start !== null && lyrics[currentIndex + 1].start! < lyrics[currentIndex].end!) {
                        lyrics[currentIndex + 1].start = null;
                    }
                }
                currentIndex = Math.min(currentIndex + 1, lyrics.length - 1);
            },
        },
        gotoPrevLine: {
            key: 'i',
            cb: () => {
                currentIndex = Math.max(0, currentIndex - 1);
            },
        },
        gotoNextLine: {
            key: 'o',
            cb: () => {
                currentIndex = Math.min(currentIndex + 1, lyrics.length - 1);
            },
        },
        rewind2Seconds: {
            key: 'u',
            cb: () => {
                if (videoPanelElement?.videoElement) {
                    videoPanelElement.videoElement.currentTime = Math.max(0, videoPanelElement.videoElement.currentTime - 2);
                }
            },
        },
        forward2Seconds: {
            key: 'p',
            cb: () => {
                if (videoPanelElement?.videoElement) {
                    videoPanelElement.videoElement.currentTime = Math.min(videoPanelElement.videoElement.duration, videoPanelElement.videoElement.currentTime + 2);
                }
            },
        },
        exportSRT: {
            key: 'q',
            cb: () => {
                let srtContent = '';
                let lastTimestamp = 0;
                for (let i = 0; i < lyrics.length; i++) {
                    const line = lyrics[i];
                    const startTimestamp = line.start !== null ? line.start : lastTimestamp;
                    const endTimestamp = line.end !== null ? line.end : lastTimestamp;
                    const start = new Date(startTimestamp * 1000).toISOString().substring(11, 23).replace('.', ',');
                    const end = new Date(endTimestamp * 1000).toISOString().substring(11, 23).replace('.', ',');
                    srtContent += `${i + 1}\n${start} --> ${end}\n${line.text}\n\n`;
                    lastTimestamp = endTimestamp;
                }
                const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'lyrics.srt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            },
        },
    });
</script>


<svelte:window onkeydown={(e) => {
    if (inputMode === 'keyboard') {
        for (const key in callbacks) {
            if (e.key === callbacks[key].key) {
                e.preventDefault();
                callbacks[key].cb();
                break;
            }
        }
    }
}} />


<!-- TODO: preview subtitle panel (or modal) -->

<div class="flex flex-col md:flex-row flex-1 min-h-0">
    <aside class="w-1/2 border-r border-gray-200 bg-gray-50 p-8 flex flex-col overflow-hidden">
        <div class="flex items-center justify-between mb-4">
            <h1 class="text-2xl font-semibold">字幕</h1>
            <div class="flex items-center gap-2">
                <span class={["text-sm font-medium rounded px-2 py-1 transition-all cursor-default", inputMode === 'manual' ? 'bg-indigo-500 text-white font-bold ring-2 ring-indigo-300' : 'bg-gray-200 text-gray-700']}>手動輸入模式</span>
                <span class={["text-sm font-medium rounded px-2 py-1 transition-all cursor-default", inputMode === 'keyboard' ? 'bg-indigo-500 text-white font-bold ring-2 ring-indigo-300' : 'bg-gray-200 text-gray-700']}>快捷鍵模式</span>
            </div>
        </div>

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
                            <span class="cursor-help border-b border-dashed border-gray-600" title="將會被用來校正按按鍵和字幕出現的時間差。（紀錄的時間將會是「按下去的時間點」扣掉「反應時間」）">反應時間 (秒)</span>
                            <input type="number" bind:value={reactionTime} min="0" max="1" step="0.1" class="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </label>
                    </div>
                {/if}
            </div>

            <!-- TODO</div>: fix flex issue, automatically grow to fill remaining space and show scrollbar -->
            <div bind:this={lyricsContainerElement} class="h-[400px] overflow-y-auto space-y-2 p-4 border border-gray-300 rounded-lg bg-gray-100 shadow-md">
                {#each lyrics as lyric, index (index)}
                    <LyricsLine
                        bind:text={lyric.text}
                        bind:start={lyric.start}
                        bind:end={lyric.end}
                        bind:this={lyric.ele}
                        thisIndex={index}
                        {currentIndex}
                        {startThisLineCursor}
                        {startNextLineCursor}
                        {endThisLineCursor}
                        {callbacks}
                        createLyricsBefore={() => {
                            lyrics = [
                                ...lyrics.slice(0, index),
                                { start: null, end: null, text: '', ele: null },
                                ...lyrics.slice(index),
                            ];
                            currentIndex = index;
                        }}
                        createLyricsAfter={() => {
                            lyrics = [
                                ...lyrics.slice(0, index + 1),
                                { start: null, end: null, text: '', ele: null },
                                ...lyrics.slice(index + 1),
                            ];
                            currentIndex = Math.min(lyrics.length - 1, index + 1);
                        }}
                        deleteThisLine={() => {
                            lyrics = [
                                ...lyrics.slice(0, index),
                                ...lyrics.slice(index + 1),
                            ];
                            if (currentIndex >= index) {
                                currentIndex = Math.max(0, currentIndex - 1);
                            }
                        }}
                        onfocus={() => {
                            currentIndex = index;
                            inputMode = 'manual';
                        }}
                        onblur={() => {
                            inputMode = 'keyboard';
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
        <VideoPanel
            bind:this={videoPanelElement}
            {callbacks}
            {inputMode}
        />
    </main>
</div>
