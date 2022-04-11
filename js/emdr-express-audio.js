export default class EmdrExpressAudio {

    constructor(audioEl) {
        this.audioEl = audioEl;
        this.interval = 1;
    }

    _init() {
        if (this.initDone) {
            return;
        }

        this.initDone = true;
        const audioContext = new AudioContext();
        const track = audioContext.createMediaElementSource(this.audioEl);
        this.stereoNode = new StereoPannerNode(audioContext, { pan: 0 });
        this.stereoNode.pan.value = -1;
        track.connect(this.stereoNode).connect(audioContext.destination);
    }


    play() {
        this._init();
        this.playing = true;

        if (this.intervalHandle) {
            clearInterval(this.intervalHandle);
        }

        const onInterval = () => {
            this.audioEl.currentTime = 0;
            this.stereoNode.pan.value *= -1;
            this.audioEl.play();
        };
        this.intervalHandle = setInterval(onInterval, this.interval * 1000);
        onInterval();
    }

    pause() {
        if (this.intervalHandle) {
            clearInterval(this.intervalHandle);
        }

        this.audioEl.pause();
        this.audioEl.currentTime = 0;
        this.playing = false;
    }

    setInterval(secs) {
        this.interval = secs;
        if (this.playing) {
            this.play();
        }
    }
}