<script lang="ts">
    let lyricsFileOrig: FileList | null = $state(null);
    let lyricsFileTran: FileList | null = $state(null);

    let lyricsTextOrig: Array<string> = $state([]);
    let lyricsTextTran: Array<string> = $state([]);

    $effect(() => {
        if (lyricsFileOrig && lyricsFileOrig.length > 0) {
            const file = lyricsFileOrig[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                lyricsTextOrig = text.split('\n').map(line => line.trim());
            };
            reader.readAsText(file);
        }
    });

    $effect(() => {
        if (lyricsFileTran && lyricsFileTran.length > 0) {
            const file = lyricsFileTran[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                lyricsTextTran = text.split('\n').map(line => line.trim());
            };
            reader.readAsText(file);
        }
    });

</script>


<!-- use svelte-dnd-action to make the lyrics draggable -->


<main class="flex-1 flex flex-col items-center p-4 box-border">
    <div class="w-full max-w-5xl">
        <!-- uploaders -->
        <div class="grid grid-cols-2 gap-4 mb-4">
            <label class="w-full block">
                {#if lyricsFileOrig && lyricsFileOrig.length > 0}
                    <div class="flex items-center justify-between gap-3 p-4 border rounded-lg bg-white">
                    <div class="flex items-center gap-2 min-w-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div class="min-w-0">
                            <div class="text-sm font-medium text-gray-700 truncate max-w-[16rem]">{lyricsFileOrig[0].name}</div>
                            <div class="text-xs text-gray-500">{(lyricsFileOrig[0].size / 1024).toFixed(1)} KB</div>
                        </div>
                    </div>
                    <button
                        type="button"
                        class="px-2 py-1 text-sm rounded border border-red-200 text-red-600 hover:bg-red-50"
                        title="清除原文檔案"
                        onclick={(e) => { e.stopPropagation(); lyricsFileOrig = null; lyricsTextOrig = []; }}
                    >
                        刪除
                    </button>
                    </div>
                {:else}
                    <div class="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-indigo-500 bg-white text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span class="text-sm font-medium text-gray-700">選取 <b>原文</b> 字幕檔案</span>
                        <span class="text-xs text-gray-500">TXT 格式</span>
                    </div>
                    <input bind:files={lyricsFileOrig} type="file" accept=".txt,text/plain" class="sr-only" />
                {/if}
            </label>

            <label class="w-full block">
                {#if lyricsFileTran && lyricsFileTran.length > 0}
                    <div class="flex items-center justify-between gap-3 p-4 border rounded-lg bg-white">
                        <div class="flex items-center gap-2 min-w-0">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div class="min-w-0">
                                <div class="text-sm font-medium text-gray-700 truncate max-w-[16rem]">{lyricsFileTran[0].name}</div>
                                <div class="text-xs text-gray-500">{(lyricsFileTran[0].size / 1024).toFixed(1)} KB</div>
                            </div>
                        </div>
                        <button
                            type="button"
                            class="px-2 py-1 text-sm rounded border border-red-200 text-red-600 hover:bg-red-50"
                            title="清除譯文檔案"
                            onclick={(e) => { e.stopPropagation(); lyricsFileTran = null; lyricsTextTran = []; }}
                        >
                            刪除
                        </button>
                    </div>
                {:else}
                    <div class="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-indigo-500 bg-white text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span class="text-sm font-medium text-gray-700">選取 <b>譯文</b> 字幕檔案</span>
                        <span class="text-xs text-gray-500">TXT 格式</span>
                    </div>
                    <input bind:files={lyricsFileTran} type="file" accept=".txt,text/plain" class="sr-only" />
                {/if}
            </label>
        </div>

        {#if lyricsFileOrig || lyricsFileTran}
            <div class="w-full rounded-lg border bg-gray-50">
                <div class="grid grid-cols-2 gap-2 px-3 py-2 bg-white rounded-t-lg text-sm font-semibold text-gray-700">
                    <div class="text-center">原文歌詞</div>
                    <div class="text-center">譯文歌詞</div>
                </div>

                <div class="max-h-[70vh] overflow-y-auto p-2">
                    {#each [...Array(Math.max(lyricsTextOrig.length, lyricsTextTran.length)).keys()] as index}
                        <div class="grid grid-cols-2 gap-2 mb-1">
                            <!-- left: original -->
                            <div class="px-2 py-1 rounded-lg bg-white text-gray-800 flex items-center gap-1 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200">
                                <div class="cursor-move text-gray-400 hover:text-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                                    </svg>
                                </div>

                                <div class="flex flex-col gap-1">
                                    <button
                                        type="button"
                                        class="w-3 h-3 rounded-full bg-indigo-50 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-colors flex items-center justify-center shadow-sm"
                                        title="在上方插入一行"
                                        onclick={() => {
                                            lyricsTextOrig = [...lyricsTextOrig.slice(0, index), lyricsTextOrig[index], ...lyricsTextOrig.slice(index)];
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        class="w-3 h-3 rounded-full bg-indigo-50 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-colors flex items-center justify-center shadow-sm"
                                        title="在下方插入一行"
                                        onclick={() => {
                                            lyricsTextOrig = [...lyricsTextOrig.slice(0, index + 1), lyricsTextOrig[index], ...lyricsTextOrig.slice(index + 1)];
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>

                                <input
                                    type="text"
                                    bind:value={lyricsTextOrig[index]}
                                    class="flex-1 bg-transparent border border-gray-300 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                />

                                <button
                                    type="button"
                                    class="w-4 h-4 p-0.5 rounded-full bg-red-100 text-red-400 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center shadow-sm"
                                    title="刪除此行"
                                    onclick={() => {
                                        lyricsTextOrig = [...lyricsTextOrig.slice(0, index), ...lyricsTextOrig.slice(index + 1)];
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <!-- right: translation -->
                            <div class="px-2 py-1 rounded-lg bg-white text-gray-800 flex items-center gap-1 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200">
                                <div class="cursor-move text-gray-400 hover:text-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                                    </svg>
                                </div>

                                <div class="flex flex-col gap-1">
                                    <button
                                        type="button"
                                        class="w-3 h-3 rounded-full bg-indigo-50 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-colors flex items-center justify-center shadow-sm"
                                        title="在上方插入一行"
                                        onclick={() => {
                                            lyricsTextTran = [...lyricsTextTran.slice(0, index), lyricsTextTran[index], ...lyricsTextTran.slice(index)];
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        class="w-3 h-3 rounded-full bg-indigo-50 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-colors flex items-center justify-center shadow-sm"
                                        title="在下方插入一行"
                                        onclick={() => {
                                            lyricsTextTran = [...lyricsTextTran.slice(0, index + 1), lyricsTextTran[index], ...lyricsTextTran.slice(index + 1)];
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    bind:value={lyricsTextTran[index]}
                                    class="flex-1 bg-transparent border border-gray-300 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                />
                                <button
                                    type="button"
                                    class="w-4 h-4 p-0.5 rounded-full bg-red-100 text-red-400 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center shadow-sm"
                                    title="刪除此行"
                                    onclick={() => {
                                        lyricsTextTran = [...lyricsTextTran.slice(0, index), ...lyricsTextTran.slice(index + 1)];
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</main>
