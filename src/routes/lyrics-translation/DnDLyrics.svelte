<script lang="ts">
    let {
        title,
        lyricsText = $bindable(),
        highlightLine = (_: string) => false,
        editDisabled = false,
        initHidden = false,
    } = $props<{
        title: string;
        lyricsText: Array<string>;
        highlightLine?: (_: string) => boolean
        editDisabled?: boolean;
        initHidden?: boolean;
    }>();

    let draggedIndex = $state<number | null>(null);
    let hidden = $state<boolean>(initHidden);

    function handleDragStart(i: number) {
        draggedIndex = i;
    }

    function handleDragOver(e: DragEvent, i: number) {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === i) return;

        const item = lyricsText[draggedIndex];
        lyricsText.splice(draggedIndex, 1);
        lyricsText.splice(i, 0, item);

        draggedIndex = i;
    }

    function handleDrop() {
        draggedIndex = null;
    }
</script>


<div class={["rounded-lg border bg-gray-50 overflow-hidden", hidden ? '' : 'flex-1']}>
    <div class={["px-2 py-2 bg-white rounded-t-lg text-sm font-semibold text-center flex items-center gap-1 justify-center leading-none", hidden ? 'vertical-text' : 'border-b']}>
        <button
            type="button"
            class="inline-flex items-center justify-center w-6 h-6 text-gray-600 hover:text-gray-900"
            onclick={() => hidden = !hidden}
            title={hidden ? '顯示字幕檔' : '隱藏字幕檔'}
        >
            {#if !hidden}
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
            {/if}
        </button>
        <span class="leading-none">{title}</span>
    </div>
    {#if !hidden}
        {#if lyricsText && lyricsText.length > 0}
            <div role="list" class="rounded-md border border-gray-200 bg-white shadow-sm divide-y divide-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:divide-gray-800 overflow-hidden">
                {#each lyricsText as _, i (i)}
                    <div
                        role="listitem"
                        class={["flex items-center gap-1 px-2 py-1", [highlightLine(lyricsText[i]) ? 'bg-yellow-50' : '']]}
                        ondragover={(e) => handleDragOver(e, i)}
                        ondrop={handleDrop}
                    >
                        {#if !editDisabled}
                            <div draggable="true" ondragstart={() => handleDragStart(i)} role="listitem" class="mr-1 cursor-grab text-gray-400 hover:text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                                </svg>
                            </div>
                        {/if}

                        {#if !editDisabled}
                            <div class="flex flex-col gap-2">
                                <button
                                    type="button"
                                    class="w-3 h-3 rounded-full bg-indigo-50 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-colors flex items-center justify-center shadow-sm"
                                    title="在上方插入一行"
                                    onclick={() => {
                                        lyricsText = [...lyricsText.slice(0, i), lyricsText[i], ...lyricsText.slice(i)];
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
                                        lyricsText = [...lyricsText.slice(0, i + 1), lyricsText[i], ...lyricsText.slice(i + 1)];
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>
                        {/if}

                        <span class="font-mono text-gray-400 text-sm ml-2">{i + 1}:</span>

                        {#if editDisabled}
                            <input
                                readonly
                                type="text"
                                value={lyricsText[i]}
                                class="grow min-w-0 bg-transparent border border-gray-300 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        {:else}
                            <input
                                type="text"
                                bind:value={lyricsText[i]}
                                class="grow min-w-0 bg-transparent border border-gray-300 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        {/if}

                        {#if !editDisabled}
                            <button
                                type="button"
                                class="w-4 h-4 p-0.5 rounded-full bg-red-100 text-red-400 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center shadow-sm"
                                title="刪除此行"
                                onclick={() => {
                                    lyricsText = [...lyricsText.slice(0, i), ...lyricsText.slice(i + 1)];
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        {/if}
                    </div>
                {/each}
            </div>
        {:else}
            <div class="p-4 text-center text-gray-500">請上傳檔案以瀏覽。</div>
        {/if}
    {/if}
</div>


<style>
    .vertical-text {
        writing-mode: vertical-rl;
        text-orientation: mixed;
    }
</style>
