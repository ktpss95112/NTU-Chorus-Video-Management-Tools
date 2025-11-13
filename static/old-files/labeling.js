// This tool is a modification of https://github.com/wiwikuan/fast-srt-subtitle


function clamp(num) {
  return Math.max(num, 0);
}


class Labeling {
  constructor() {
    this.srtInput = document.querySelector('#srtFile');
    this.videoInput = document.querySelector('#videoFile');
    this.video = document.querySelector('#video');
    this.textArea = document.querySelector('#textArea');
    this.status = document.querySelector('#status');
    this.reactTime = 0.4;
    this.subTexts = [];
    this.currentLyricsLine = 0;
    this.lines = [];
    this.prevState = {
      currentTime: [0, 0],
      lines: [],
      currentLyricsLine: 0,
    };

    this.init();
  }

  init() {
    this.srtInput.addEventListener('change', this.handleFileUploadLyrics.bind(this));
    this.videoInput.addEventListener('change', this.handleFileUploadVideo.bind(this));
    this.video.addEventListener('timeupdate', this.updateStatus.bind(this));
    document.addEventListener('keydown', this.keydownHandler.bind(this));
  }

  saveStateLine() {
    this.prevState.currentTime = [this.prevState.currentTime[1], this.getCurrentTime()];
    this.prevState.lines = JSON.parse(JSON.stringify(this.lines));
    this.prevState.currentLyricsLine = this.currentLyricsLine;
  }

  restoreState() {
    this.video.currentTime = this.prevState.currentTime[0];
    this.lines = this.prevState.lines;
    this.currentLyricsLine = this.prevState.currentLyricsLine;
  }

  getNeedReactionTime() {
    try {
      return document.querySelector('input[name="need-reaction"]:checked').value;
    } catch (e) {
      return undefined;
    }
  }

  getCurrentTime() {
    const needReactionTime = this.getNeedReactionTime();
    if (needReactionTime === 'need') {
      return this.video.currentTime - this.reactTime;
    } else {
      return this.video.currentTime;
    }
  }

  keydownHandler(e) {
    if (e.key.toLowerCase() === 'j') {
      // start current line
      this.saveStateLine();
      this.lines[this.currentLyricsLine][0] = clamp(this.getCurrentTime());

      // check if we need to reset the end time
      if (this.lines[this.currentLyricsLine][1] === null &&
          this.lines[this.currentLyricsLine][0] >= this.lines[this.currentLyricsLine][1]) {
        this.lines[this.currentLyricsLine][1] = null;
      }
    }
    if (e.key.toLowerCase() === 'k') {
      if (this.currentLyricsLine >= this.lines.length) {
        return;
      }

      this.saveStateLine();

      // If current line is not stamped yet, start it;
      // otherwise, move to next line (and mark the current line's end time if needed)
      if (this.lines[this.currentLyricsLine][0] === null) {
        this.lines[this.currentLyricsLine][0] = clamp(this.getCurrentTime());
      } else {
        if (this.lines[this.currentLyricsLine][1] === null) {
          this.lines[this.currentLyricsLine][1] = clamp(this.getCurrentTime());
        }
        this.lines[this.currentLyricsLine + 1][0] = clamp(this.getCurrentTime());
        this.currentLyricsLine += 1;
      }
    }
    if (e.key.toLowerCase() === 'l') {
      this.saveStateLine();

      // if current line is not stamped yet, use previous line's end time as start time
      if (this.lines[this.currentLyricsLine][0] === null) {
        try {
          this.lines[this.currentLyricsLine][0] = this.lines[this.currentLyricsLine - 1][1];
        } catch (e) {
          this.lines[this.currentLyricsLine][0] = 0;
        }
      }

      this.lines[this.currentLyricsLine][1] = clamp(this.getCurrentTime());
      this.currentLyricsLine += 1;
    }
    if (e.key.toLowerCase() === 'z' && e.ctrlKey) {
      this.restoreState();
    }

    if (e.key.toLowerCase() === 'i') {
      this.currentLyricsLine -= 1;
      if (this.currentLyricsLine < 0) {
        this.currentLyricsLine = 0;
      }
    }
    if (e.key.toLowerCase() === 'o') {
      this.currentLyricsLine += 1;
    }
    if (e.key.toLowerCase() === 'u') {
      this.video.currentTime -= 2;
    }
    if (e.key.toLowerCase() === 'p') {
      this.video.currentTime += 2;
    }
    if (e.key.toLowerCase() === 'q') {
      this.makeSRT();
    }

    this.updateContent();
  }

  getCurrentStatus() {
    return `Stamping Line ${this.currentLyricsLine} | Playhead: ${this.video.currentTime}`;
  }

  updateContent() {
    const head = '** 目前 ---> ';

    const content = this.subTexts
      .slice(this.currentLyricsLine, this.currentLyricsLine + 5)
      .map((text, i) => {
        const [timeStart, timeEnd] = this.lines[this.currentLyricsLine + i];
        return `${i === 0 ? head : ''}${text} | ${timeStart} --> ${timeEnd}`;
      })
      .join('\n');

    this.textArea.value = content;
  }

  handleFileUploadLyrics(e) {
    if (e.target.files === null)
      return;

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.subTexts = reader.result.replace(/\r\n/g, '\n').split('\n');
      this.subTexts.forEach((_, i) => (this.lines[i] = [null, null]));

      this.updateContent();
    });
    reader.addEventListener('error', (e) => {
      alert('無法讀取檔案！');
      console.error(e);
    });

    const file = e.target.files[0];
    reader.readAsText(file);
  }

  handleFileUploadVideo(e) {
    this.video.src = URL.createObjectURL(e.target.files[0]);
  }

  updateStatus() {
    if (typeof this.getNeedReactionTime() === 'undefined') {
      this.video.pause();
      alert('請選擇是否需要反應時間！');
      return;
    }

    this.status.textContent = this.getCurrentStatus();
  }

  makeSRT() {
    let srt = '';
    for (let i = 0; i < this.subTexts.length; i++) {
      // line number
      srt += i + 1 + '\n';
      // line time
      let sh, sm, ss, sms;
      let eh, em, es, ems;
      const [timeStart, timeEnd] = this.lines[i];
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
      srt += this.subTexts[i];
      srt += '\n\n';
    }
    console.log(srt);
    let blob = new Blob([srt], {
      type: 'text/plain;charset=utf-8'
    });
    const a = document.createElement('a');
    const file = new Blob([srt], { type: 'text/plain;charset=utf-8' });
    a.href = URL.createObjectURL(file);
    a.download = 'lyrics.srt';
    a.click();
    URL.revokeObjectURL(a.href);
    a.remove();
  }
}

const labeling = new Labeling();
