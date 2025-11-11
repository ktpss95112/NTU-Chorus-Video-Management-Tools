<script lang="ts">
    let videoFile = $state<FileList | null>(null);
    let videoUrl = $state<string | null>(null);

    $effect(() => {
        if (videoFile && videoFile.length > 0) {
            videoUrl = URL.createObjectURL(videoFile[0]);
            return () => {
                URL.revokeObjectURL(videoUrl!);
            };
        }
    });
</script>

<div class="flex flex-col md:flex-row h-screen">
    <aside class="w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50 p-8 overflow-auto">
        <h1 class="text-2xl font-semibold mb-4">Left Panel</h1>
        <p class="text-sm text-gray-600">Place navigation, controls, or inputs here.</p>
    </aside>

    <main class="w-full md:w-1/2 h-1/2 md:h-full p-8 overflow-auto">
        <h1 class="text-2xl font-semibold mb-4">Video</h1>

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
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-700">Click to select a video</span>
                    <span class="text-xs text-gray-500">or drag and drop — MP4, MOV, etc.</span>
                </div>
                <input bind:files={videoFile} type="file" accept="video/*" class="sr-only" />
            </label>
        {/if}
    </main>
</div>
