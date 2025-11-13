<script lang="ts">
    let {
        callbacks,
        inputMode,
    } = $props<{
        callbacks: { [key: string]: { key: string; cb: () => void } };
        inputMode: 'manual' | 'keyboard';
    }>();

    let videoFile = $state<FileList | null>(null);
    let videoUrl = $state<string | null>(null);
    let videoElement = $state<HTMLVideoElement | null>(null);

    $effect(() => {
        if (videoFile && videoFile.length > 0) {
            videoUrl = URL.createObjectURL(videoFile[0]);
            return () => {
                URL.revokeObjectURL(videoUrl!);
            };
        }
    });

    $effect(() => {
        if (inputMode === 'manual' && videoElement) {
            videoElement.pause();
        } else if (inputMode === 'keyboard' && videoElement) {
            videoElement.focus();
        }
    });

    export function currentTime(): number {
        return videoElement?.currentTime || 0;
    }

    export { videoElement };
</script>


<h1 class="text-2xl font-semibold mb-4">影片</h1>

{#if videoFile && videoFile.length > 0}
    <div class="relative mb-4 w-full max-h-[60vh]">
        <video bind:this={videoElement} src={videoUrl} controls class="w-full h-full bg-black rounded">
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

    <div class="relative">
        {#if inputMode === 'manual'}
            <div class="absolute inset-0 z-10 bg-gray-900/30 rounded backdrop-blur-[2px]"></div>
            <!-- note that inputMode is automatically updated by <LyricsLine>, so we don't need to change it here -->
            <button
                type="button"
                class="absolute inset-0 z-20 flex items-center justify-center text-white text-xl font-bold rounded cursor-pointer hover:bg-black/20 transition-colors"
            >
                <span class="bg-indigo-600 px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors">
                    點擊此處或影片,回到快捷鍵模式
                </span>
            </button>
        {/if}

        <div class="flex flex-wrap gap-2">
            <button type="button" aria-label="這一行開始" onclick={() => callbacks.startThisLine.cb()}
                class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-gray-50 px-2.5 py-1.5 text-sm text-gray-800 shadow hover:bg-white active:translate-y-px">
                <kbd class="inline-flex min-w-6 justify-center rounded border border-gray-300 bg-white px-1.5 py-0.5 font-mono text-xs text-gray-700 shadow-inner">{callbacks.startThisLine.key.toUpperCase()}</kbd>
                <span>這一行開始</span>
            </button>

            <button type="button" aria-label="下一行開始" onclick={() => callbacks.startNextLine.cb()}
                class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-gray-50 px-2.5 py-1.5 text-sm text-gray-800 shadow hover:bg-white active:translate-y-px">
                <kbd class="inline-flex min-w-6 justify-center rounded border border-gray-300 bg-white px-1.5 py-0.5 font-mono text-xs text-gray-700 shadow-inner">{callbacks.startNextLine.key.toUpperCase()}</kbd>
                <span>下一行開始<sup class="text-xs text-gray-500">*</sup></span>
            </button>

            <button type="button" aria-label="這一行提早結束" onclick={() => callbacks.endThisLine.cb()}
                class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-gray-50 px-2.5 py-1.5 text-sm text-gray-800 shadow hover:bg-white active:translate-y-px">
                <kbd class="inline-flex min-w-6 justify-center rounded border border-gray-300 bg-white px-1.5 py-0.5 font-mono text-xs text-gray-700 shadow-inner">{callbacks.endThisLine.key.toUpperCase()}</kbd>
                <span>這一行提早結束</span>
            </button>

            <button type="button" aria-label="往前一行" onclick={() => callbacks.gotoPrevLine.cb()}
                class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-gray-50 px-2.5 py-1.5 text-sm text-gray-800 shadow hover:bg-white active:translate-y-px">
                <kbd class="inline-flex min-w-6 justify-center rounded border border-gray-300 bg-white px-1.5 py-0.5 font-mono text-xs text-gray-700 shadow-inner">{callbacks.gotoPrevLine.key.toUpperCase()}</kbd>
                <span>往前一行</span>
            </button>

            <button type="button" aria-label="往後一行" onclick={() => callbacks.gotoNextLine.cb()}
                class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-gray-50 px-2.5 py-1.5 text-sm text-gray-800 shadow hover:bg-white active:translate-y-px">
                <kbd class="inline-flex min-w-6 justify-center rounded border border-gray-300 bg-white px-1.5 py-0.5 font-mono text-xs text-gray-700 shadow-inner">{callbacks.gotoNextLine.key.toUpperCase()}</kbd>
                <span>往後一行</span>
            </button>

            <button type="button" aria-label="倒帶 2 秒" onclick={() => callbacks.rewind2Seconds.cb()}
                class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-gray-50 px-2.5 py-1.5 text-sm text-gray-800 shadow hover:bg-white active:translate-y-px">
                <kbd class="inline-flex min-w-6 justify-center rounded border border-gray-300 bg-white px-1.5 py-0.5 font-mono text-xs text-gray-700 shadow-inner">{callbacks.rewind2Seconds.key.toUpperCase()}</kbd>
                <span>倒帶 2 秒</span>
            </button>

            <button type="button" aria-label="快轉 2 秒" onclick={() => callbacks.forward2Seconds.cb()}
                class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-gray-50 px-2.5 py-1.5 text-sm text-gray-800 shadow hover:bg-white active:translate-y-px">
                <kbd class="inline-flex min-w-6 justify-center rounded border border-gray-300 bg-white px-1.5 py-0.5 font-mono text-xs text-gray-700 shadow-inner">{callbacks.forward2Seconds.key.toUpperCase()}</kbd>
                <span>快轉 2 秒</span>
            </button>

            <button type="button" aria-label="輸出 SRT 檔" onclick={() => callbacks.exportSRT.cb()}
                class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-gray-50 px-2.5 py-1.5 text-sm text-gray-800 shadow hover:bg-white active:translate-y-px">
                <kbd class="inline-flex min-w-6 justify-center rounded border border-gray-300 bg-white px-1.5 py-0.5 font-mono text-xs text-gray-700 shadow-inner">{callbacks.exportSRT.key.toUpperCase()}</kbd>
                <span>輸出 SRT 檔</span>
            </button>
        </div>

        <p class="mt-4 text-xs text-gray-500">
            * 如果這一行還沒開始（開始的時間點還沒給），則開始這一行（效果同按鍵 J）。<br/>
            * 如果這一行還沒結束（結束的時間點還沒給），則在開始下一行的同時將會同時結束這一行。
        </p>
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
