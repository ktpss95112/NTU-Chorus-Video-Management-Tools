<script lang="ts">
    let {
        text = $bindable(),
        start = $bindable(),
        end = $bindable(),
        createLyricsBefore,
        createLyricsAfter,
        deleteThisLine,
    } = $props<{
        text: string;
        start: number | null;
        end: number | null;
        createLyricsBefore: () => void;
        createLyricsAfter: () => void;
        deleteThisLine: () => void;
    }>();
</script>


<div class="flex gap-2 items-start">
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
            class="col-start-2 row-span-3 p-1.5 text-sm min-h-[2.5rem] w-full resize-y rounded border border-gray-300 bg-white/70 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter lyrics..."
        ></textarea>

        <button
            class="col-start-1 row-start-2 w-4 h-4 flex items-center justify-center self-center rounded-full border border-red-300 text-red-600 text-[8px] leading-none bg-white hover:bg-red-50 active:scale-95 transition duration-150 shadow-sm"
            onclick={deleteThisLine}
            aria-label="Delete line"
            title="刪除此行字幕"
        >
            🗑️
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
        <span class="text-[10px] text-gray-600 text-right">Start</span>
        <input
            type="text"
            bind:value={start}
            aria-label="Start"
            class="w-full min-w-0 p-0.5 text-[10px] rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <span class="text-[10px] text-gray-600 text-right">End</span>
        <input
            type="text"
            bind:value={end}
            aria-label="End"
            class="w-full min-w-0 p-0.5 text-[10px] rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
    </div>
</div>
