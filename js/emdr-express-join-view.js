
'use strict';

import EmdrExpressAudio from './emdr-express-audio.js';

export default class EmdrExpressJoinView {

    constructor(id) {
        this.audio = new EmdrExpressAudio(document.querySelector('audio'));
        this.id = id;
        this.peer = new Peer();
        location.hash = this.id;
        this._bindEventListeners();
    }

    _bindEventListeners() {
        this.peer.on('error', err => {
            console.error(err);
        });
        this.peer.on('open', () => {
            const conn = this.peer.connect(this.id);
            conn.on('data', data => {
                console.log(data);
                if (data.event === 'play') {
                    this.audio.play();
                } else if (data.event === 'pause') {
                    this.audio.pause();
                } else if (data.interval) {
                    this.audio.setInterval(data.interval);
                }
            });
        });

    }
    
}