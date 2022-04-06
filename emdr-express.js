
'use strict';

class EmdrExpress {

    constructor() {
        this._bindEventListeners();
    }

    _bindEventListeners() {
        document.querySelector('.js-start-button').addEventListener('click', e => {
            const button = e.currentTarget;
            if (this.playing) {
                button.textContent = 'Start';
                this.pause();
            } else {
                button.textContent = 'Stop';
                this.play();
            }
        });
        document.querySelector('.js-interval').value = localStorage.getItem('secs') || 1;
        document.querySelector('.js-interval').addEventListener('change', e => {
            const secs = e.currentTarget.value
            this.updateInterval(secs);
            localStorage.setItem('secs', secs);
        });
    }

    init() {
        if (this.initDone) return;
        this.initDone = true;
        this.audioEl = document.querySelector('audio');
        const audioContext = new AudioContext();
        const track = audioContext.createMediaElementSource(this.audioEl);
        this.stereoNode = new StereoPannerNode(audioContext, { pan: 0 });
        this.stereoNode.pan.value = -1;
        track.connect(this.stereoNode).connect(audioContext.destination);
    }


    play() {
        this.init();
        this.playing = true;
        if (this.interval) {
            clearInterval(this.interval);
        }
        const secs = document.querySelector('.js-interval').value;
        this.audioEl.play();
        this.interval = setInterval(() => {
            this.audioEl.currentTime = 0;
            this.stereoNode.pan.value *= -1;
            this.audioEl.play();
        }, secs * 1000);
    }

    pause() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.audioEl.pause();
        this.audioEl.currentTime = 0;
        this.playing = false;
    }

    updateInterval(secs) {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.interval = setInterval(() => {
            this.audioEl.currentTime = 0;
            this.stereoNode.pan.value *= -1;
            this.audioEl.play();
        }, secs * 1000);
    }

    secureRandomId() {
        const r = new Uint32Array(1);
        crypto.getRandomValues(r);
        return r[0];
    }
    
}

new EmdrExpress();