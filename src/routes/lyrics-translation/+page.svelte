<script lang="ts">
    import DnDLyrics from "./DnDLyrics.svelte";

    let captionFile: FileList | null = $state(null);
    let lyricsFileOrig: FileList | null = $state(null);
    let lyricsFileTran: FileList | null = $state(null);

    let captionContent: string | null = $state(null);
    let captionFileType: 'srt' | 'sbv' | 'unknown' = $derived(detectLyricsFileType(captionContent ?? ''));
    let captionLines: Array<string> = $derived.by(() => {
        if (!captionContent || captionFileType === 'unknown') return [];
        const lyricsLineIndex = (i: number) => captionFileType === 'srt' ? i * 4 + 2 : i * 3 + 1;
        const lines = captionContent.split('\n');
        const result: Array<string> = [];
        for (let i = 0; ; i++) {
            const idx = lyricsLineIndex(i);
            if (idx >= lines.length || lines[idx].trim() === '') break;
            result.push(lines[idx].trim());
        }
        return result;
    });
    let captionTranslatedContent: string | null = $state(null);

    let lyricsTextOrig: Array<string> = $state([]);
    let lyricsTextTran: Array<string> = $state([]);

    let errorText: string | null = $state(null);

    $effect(() => {
        if (captionFile && captionFile.length > 0) {
            const file = captionFile[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                captionContent = text;

                if (captionFileType === 'unknown') {
                    errorText = '無法辨識字幕檔案格式，請確認為 SRT 或 SBV 格式。';
                    captionFile = null;
                    captionContent = null;
                    return;
                } else {
                    errorText = null;
                }
            };
            reader.readAsText(file);
        }
    });

    $effect(() => {
        if (lyricsFileOrig && lyricsFileOrig.length > 0) {
            const file = lyricsFileOrig[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                lyricsTextOrig = text.split('\n').map((line) => line.trim()).filter((line) => line !== '');
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
                lyricsTextTran = text.split('\n').map((line) => line.trim()).filter((line) => line !== '');
            };
            reader.readAsText(file);
        }
    });

    function detectLyricsFileType(content: string): 'srt' | 'sbv' | 'unknown' {
        const lines = content.split('\n');

        let isSrt = true;
        for (let i = 1; i < lines.length; i += 4) {
            if (!lines[i].includes('-->')) {
                isSrt = false;
                break;
            }
        }
        if (isSrt) return 'srt';

        let isSbv = true;
        for (let i = 0; i < lines.length; i += 3) {
            if (!lines[i].includes(',')) {
                isSbv = false;
                break;
            }
        }
        if (isSbv) return 'sbv';

        return 'unknown';
    }

    $effect(() => {
        captionTranslatedContent = null;
        if (!captionContent || !lyricsTextOrig.length) {
            return;
        }

        // if any caption lines are not in the original lyrics, show an error
        if (captionLines.some(line => !lyricsTextOrig.includes(line))) {
            errorText = '字幕檔中的某些歌詞行在原文歌詞檔中找不到，請確認兩者內容完全相符。';
            return;
        }

        // if any original lyrics are not in the caption lines, show an error
        if (lyricsTextOrig.some(line => !captionLines.includes(line))) {
            errorText = '原文歌詞檔中的某些歌詞行在字幕檔中找不到，請將多餘的行刪除。';
            return;
        }

        // if original and translated lyrics have different lengths, show an error
        if (lyricsTextOrig.length !== lyricsTextTran.length) {
            errorText = '原文歌詞與譯文歌詞的行數不相符，請確認兩者行數一致且一一對應。';
            return;
        }

        const resultLines: Array<string> = captionContent.split('\n');
        const lyricsLineIndex = (i: number) => captionFileType === 'srt' ? i * 4 + 2 : i * 3 + 1;
        for (let i = 0; lyricsLineIndex(i) < resultLines.length; i++) {
            resultLines[lyricsLineIndex(i)] = lyricsTextTran[lyricsTextOrig.indexOf(captionLines[i])];
        }
        captionTranslatedContent = resultLines.join('\n');
        errorText = null;
    });
</script>


<main class="flex-1 flex flex-col items-center p-4 box-border">
    <div class="w-full max-w-5xl">
        <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 class="text-lg font-semibold text-blue-900 mb-2">使用說明</h2>
            <p class="text-sm text-blue-800 mb-2">請上傳一個 SRT 檔（或 SBV 檔）和兩種語言的歌詞 TXT 檔。請注意：</p>
            <ul class="list-disc list-inside text-sm text-blue-800 space-y-1">
                <li>字幕檔的每段歌詞都只能有一行，不能有換行符號。</li>
                <li>字幕檔與原文歌詞檔的同一行內容必須完全相同，不能有多餘的行首、行尾空白或標點。</li>
                <li>原文歌詞檔與譯文歌詞檔的行數須完全相同且一一對應。</li>
            </ul>
        </div>

        <div class="flex">
            <button
                disabled={captionTranslatedContent === null}
                class="mb-4 mr-4 px-4 py-2 rounded-lg transition-colors {captionTranslatedContent === null ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'}"
                onclick={() => {
                    if (captionTranslatedContent) {
                        const blob = new Blob([captionTranslatedContent], { type: 'text/plain;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = (detectLyricsFileType(captionTranslatedContent) === 'srt') ? 'translated.srt' : 'translated.sbv';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }
                }}
            >
                下載翻譯檔
            </button>
            {#if errorText}
                <div class="grow mb-4 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    {errorText}
                </div>
            {/if}
        </div>

        <div class="grid grid-cols-3 gap-4 mb-4">
            <label class="w-full block">
                {#if captionFile && captionFile.length > 0}
                    <div class="flex items-center justify-between gap-3 p-4 border rounded-lg bg-white">
                        <div class="flex items-center gap-2 min-w-0">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div class="min-w-0">
                                <div class="text-sm font-medium text-gray-700 truncate max-w-[16rem]">{captionFile[0].name}</div>
                                <div class="text-xs text-gray-500">{(captionFile[0].size / 1024).toFixed(1)} KB</div>
                            </div>
                        </div>
                        <button
                            type="button"
                            class="px-2 py-1 text-sm rounded border border-red-200 text-red-600 hover:bg-red-50"
                            title="清除字幕檔案"
                            onclick={(e) => { e.stopPropagation(); captionFile = null; lyricsTextOrig = []; }}
                        >
                            刪除
                        </button>
                    </div>
                {:else}
                    <div class="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-indigo-500 bg-white text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span class="text-sm font-medium text-gray-700">選取 <b>字幕</b> 檔案</span>
                        <span class="text-xs text-gray-500">SRT 或 SBV 格式</span>
                    </div>
                    <input bind:files={captionFile} type="file" accept=".srt,.sbv,text/plain" class="sr-only" />
                {/if}
            </label>

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
                        <span class="text-sm font-medium text-gray-700">選取 <b>原文歌詞</b> 檔案</span>
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
                        <span class="text-sm font-medium text-gray-700">選取 <b>譯文歌詞</b> 檔案</span>
                        <span class="text-xs text-gray-500">TXT 格式</span>
                    </div>
                    <input bind:files={lyricsFileTran} type="file" accept=".txt,text/plain" class="sr-only" />
                {/if}
            </label>
        </div>

        <div class="flex gap-4">
            <DnDLyrics
                title="字幕檔"
                bind:lyricsText={captionLines}
                highlightLine={(line) => (lyricsTextOrig.length > 0 && !lyricsTextOrig.includes(line))}
                editDisabled={true}
                initHidden={true}
            />

            <DnDLyrics
                title="原文歌詞"
                bind:lyricsText={lyricsTextOrig}
                highlightLine={(line) => (captionLines.length > 0 && !captionLines.includes(line))}
            />

            <DnDLyrics
                title="譯文歌詞"
                bind:lyricsText={lyricsTextTran}
            />
        </div>
    </div>
</main>
