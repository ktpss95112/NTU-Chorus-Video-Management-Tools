<script lang="ts">
    let {
        text = $bindable(),
        start = $bindable(),
        end = $bindable(),
        thisIndex,
        currentIndex,
        startThisLineCursor,
        startNextLineCursor,
        endThisLineCursor,
        callbacks,
        createLyricsBefore,
        createLyricsAfter,
        deleteThisLine,
        onfocus,
        onblur,
    } = $props<{
        text: string;
        start: number | null;
        end: number | null;
        thisIndex: number;
        currentIndex: number;
        startThisLineCursor: number;
        startNextLineCursor: number;
        endThisLineCursor: number;
        callbacks: { [key: string]: { key: string; cb: () => void } };
        createLyricsBefore: () => void;
        createLyricsAfter: () => void;
        deleteThisLine: () => void;
        onfocus: () => void;
        onblur: () => void;
    }>();

    let ele = $state<HTMLDivElement | null>(null);

    export { ele };
</script>


<div bind:this={ele} class={["flex gap-1 items-start p-1", (thisIndex === currentIndex) ? 'ring-2 ring-black-400 rounded-md' : '']}>
    <div class="grid grid-cols-[auto_1fr] grid-rows-3 gap-0.5 items-center flex-1 min-w-0">
        <button
            class="col-start-1 row-start-1 w-4 h-4 flex items-center justify-center self-start rounded-full border border-gray-300 text-gray-700 text-[10px] leading-none bg-white hover:bg-gray-100 active:scale-95 transition duration-150 shadow-sm"
            onclick={createLyricsBefore}
            aria-label="Add line before"
            title="往前新增一行字幕"
        >
            +
        </button>

        <textarea
            bind:value={text}
            class="col-start-2 row-span-3 p-1.5 text-sm min-h-[2.5rem] w-full resize-y rounded border border-gray-300 bg-white/70 focus:outline-none focus:ring-1"
            placeholder="Enter lyrics..."
            {onfocus}
            {onblur}
        ></textarea>

        <button
            class="col-start-1 row-start-2 w-4 h-4 flex items-center justify-center self-center rounded-full border border-red-300 text-red-600 text-[8px] leading-none bg-white hover:bg-red-50 active:scale-95 transition duration-150 shadow-sm"
            onclick={deleteThisLine}
            aria-label="Delete line"
            title="刪除此行字幕"
        >
            X
        </button>

        <button
            class="col-start-1 row-start-3 w-4 h-4 flex items-center justify-center self-end rounded-full border border-gray-300 text-gray-700 text-[10px] leading-none bg-white hover:bg-gray-100 active:scale-95 transition duration-150 shadow-sm"
            onclick={createLyricsAfter}
            aria-label="Add line after"
            title="往後新增一行字幕"
        >
            +
        </button>
    </div>

    <div class="grid grid-cols-[auto_1fr] items-center gap-x-1.5 gap-y-1.5 w-24 self-center">
        <span class="text-[10px] text-gray-600 text-right">開始</span>
        <div class="relative">
            {#if thisIndex === startThisLineCursor || thisIndex === startNextLineCursor}
                <div class="absolute -top-2 bg-gray-700 text-white text-[10px] px-1 py-0.5 rounded whitespace-nowrap pointer-events-none flex items-center gap-1">
                    按
                    {#if thisIndex === startThisLineCursor}
                        <kbd class="px-1 bg-gray-200 rounded text-black font-mono text-[8px] my-soft-pulse-animation">{callbacks.startThisLine.key.toUpperCase()}</kbd>
                    {/if}
                    {#if thisIndex === startNextLineCursor}
                        <kbd class="px-1 bg-gray-200 rounded text-black font-mono text-[8px] my-soft-pulse-animation">{callbacks.startNextLine.key.toUpperCase()}</kbd>
                    {/if}
                </div>
            {/if}
            <input
                type="text"
                bind:value={start}
                aria-label="Start"
                class={["w-full min-w-0 p-0.5 text-[10px] text-center rounded border border-gray-300 focus:outline-none", (thisIndex === startThisLineCursor || thisIndex === startNextLineCursor) ? 'ring-2 ring-blue-400' : '']}
                placeholder="00:00:00.000"
                {onfocus}
                {onblur}
            />
        </div>
        <span class="text-[10px] text-gray-600 text-right">結束</span>
        <div class="relative">
            {#if thisIndex === endThisLineCursor}
                <div class="absolute -top-2 bg-gray-700 text-white text-[10px] px-1 py-0.5 rounded whitespace-nowrap pointer-events-none flex items-center gap-1">
                    按 <kbd class="px-1 bg-gray-200 rounded text-black font-mono text-[8px] my-soft-pulse-animation">{callbacks.endThisLine.key.toUpperCase()}</kbd>
                </div>
            {/if}
            <input
                type="text"
                bind:value={end}
                aria-label="End"
                class={["w-full min-w-0 p-0.5 text-[10px] text-center rounded border border-gray-300 focus:outline-none", (thisIndex === endThisLineCursor) ? 'ring-2 ring-blue-400' : '']}
                placeholder="00:00:00.000"
                {onfocus}
                {onblur}
            />
        </div>
    </div>
</div>


<style>
    .my-soft-pulse-animation {
        animation: soft-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes soft-pulse {
        50% {
            opacity: 0.7;
        }
    }
</style>
