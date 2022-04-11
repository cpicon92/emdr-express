
'use strict';

import EmdrExpressAudio from './emdr-express-audio.js';

export default class EmdrExpressJoinView {

    constructor(id) {
        this.audio = new EmdrExpressAudio(document.querySelector('audio'));
        this.id = id;
        this.peer = new Peer();
        location.hash = this.id;
        this._bindEventListeners();
        this.view = document.querySelector('.js-join-view');
    }

    _bindEventListeners() {
        this.peer.on('error', err => {
            console.error(err);
            this.peer = null;
            //remove hash
            history.replaceState("", document.title, location.pathname + location.search);
            location.reload();
        });
        this.peer.on('open', () => {
            this.view.textContent = 'Connecting...';
            const conn = this.peer.connect(this.id);
            conn.on('open', () => {
                this.view.textContent = 'Connected.';
            });
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