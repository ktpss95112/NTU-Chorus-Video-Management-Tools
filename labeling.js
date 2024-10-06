// This tool is a modification of https://github.com/wiwikuan/fast-srt-subtitle

const SRT_ID = 'srtFile';
const VIDEO_ID = 'videoFile';

const srtInput = document.querySelector('#srtFile');
const videoInput = document.querySelector('#videoFile');
const video = document.querySelector('#video');
const textArea = document.querySelector('#textArea');
const status = document.querySelector('#status');
const reactTime = 0.4;
let subTexts = [];
let currentLyricsLine = 0;
let lines = [];

function clamp(num) {
  return Math.max(num, 0);
}

function getNeedReactionTime() {
  try {
    return document.querySelector('input[name="need-reaction"]:checked').value;
  } catch (e) {
    return undefined;
  }
}

function getCurrentTime() {
  const needReactionTime = getNeedReactionTime();
  if (needReactionTime === 'need') {
    return video.currentTime - reactTime;
  } else {
    return video.currentTime;
  }
}

const keyMap = {
  'k': video => {
    if (currentLyricsLine >= lines.length) {
      return;
    }

    // If current line is not stamped yet, stamp it;
    // otherwise, move to next line
    if (lines[currentLyricsLine][0] === null) {
      lines[currentLyricsLine][0] = clamp(getCurrentTime());
    } else {
      lines[currentLyricsLine][1] = clamp(getCurrentTime());
      lines[currentLyricsLine + 1][0] = clamp(getCurrentTime());
      currentLyricsLine += 1;
    }
  },
  'l': video => {
    // if current line is not stamped yet, use previous line's end time as start time
    if (lines[currentLyricsLine][0] === null) {
      try {
        lines[currentLyricsLine][0] = lines[currentLyricsLine - 1][1];
      } catch (e) {
        lines[currentLyricsLine][0] = 0;
      }
    }

    lines[currentLyricsLine][1] = clamp(getCurrentTime());
    currentLyricsLine += 1;
  },
  'i': () => {
    currentLyricsLine -= 1;
  },
  'o': () => {
    currentLyricsLine += 1;
  },
  'u': () => (video.currentTime -= 2),
  'p': () => (video.currentTime += 2),
  'q': () => makeSRT()
};

function getCurrentStatus() {
  return `Stamping Line ${currentLyricsLine} | Playhead: ${video.currentTime}`;
}

function execHotkey(keyMap) {
  document.addEventListener('keydown', function(e) {
    const execFn = keyMap[e.key.toLowerCase()];
    if (typeof execFn === 'function') {
      execFn(video);
      updateContent();
    }
  });
}

function updateContent() {
  const head = '** 目前 ---> ';

  const content = subTexts
    .slice(currentLyricsLine, currentLyricsLine + 5)
    .map((text, i) => {
      const [timeStart, timeEnd] = lines[currentLyricsLine + i];
      return `${i === 0 ? head : ''}${text} | ${timeStart} --> ${timeEnd}`;
    })
    .join('\n');

  textArea.value = content;
}

function handleFileUpload(e) {
  if (e.target.files !== null) {
    const reader = new FileReader();
    const file = e.target.files[0];

    /*
      if it's srt file, fill text area with srt content
      if it's video, load it into video tag
    */
    reader.onload = function() {
      if (e.target.id === SRT_ID) {
        subTexts = reader.result.split('\n');
        subTexts.forEach((_, i) => (lines[i] = [null, null]));

        updateContent();

        execHotkey(keyMap);
      }
    };

    reader.onerror = function() {
      alert('無法讀取檔案！');
    };

    if (e.target.id === SRT_ID) {
      reader.readAsText(file);
    } else {
      video.src = URL.createObjectURL(file);
    }
  }
}

videoInput.addEventListener('change', handleFileUpload);
srtInput.addEventListener('change', handleFileUpload);

video.addEventListener('timeupdate', function(e) {
  if (typeof getNeedReactionTime() === 'undefined') {
    video.pause();
    alert('請選擇是否需要反應時間！');
    return;
  }

  status.textContent = getCurrentStatus();
});

function makeSRT() {
  srt = '';
  for (let i = 0; i < subTexts.length; i++) {
    // line number
    srt += i + 1 + '\n';
    // line time
    let sh, sm, ss, sms;
    let eh, em, es, ems;
    const [timeStart, timeEnd] = lines[i];
    const leftPad = str => `${str}`.padStart(2, '0');
    const leftPad3 = str => `${str}`.padStart(3, '0');
    sh = leftPad(Math.floor(timeStart / 3600));
    sm = leftPad(Math.floor((timeStart % 3600) / 60));
    ss = leftPad(Math.floor(timeStart % 60));
    sms = leftPad3(Math.floor((timeStart * 1000) % 1000));
    eh = leftPad(Math.floor(timeEnd / 3600));
    em = leftPad(Math.floor((timeEnd % 3600) / 60));
    es = leftPad(Math.floor(timeEnd % 60));
    ems = leftPad3(Math.floor((timeEnd * 1000) % 1000));

    srt += `${sh}:${sm}:${ss},${sms} --> ${eh}:${em}:${es},${ems}\n`;
    srt += subTexts[i];
    srt += '\n\n';
  }
  console.log(srt);
  let blob = new Blob([srt], {
    type: 'text/plain;charset=utf-8'
  });
  const a = document.createElement('a');
  const file = new Blob([srt], { type: 'text/plain;charset=utf-8' });
  a.href = URL.createObjectURL(file);
  a.download = 'srt.txt';
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
}
