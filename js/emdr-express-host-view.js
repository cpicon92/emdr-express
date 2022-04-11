
'use strict';

import EmdrExpressAudio from './emdr-express-audio.js';

export default class EmdrExpressHostView {

    constructor() {
        // this.audio = new EmdrExpressAudio(document.querySelector('audio'));
        this.id = EmdrExpressHostView._secureRandomId();
        this.connections = [];
        this.peer = new Peer(this.id);
        location.hash = this.id;
        document.querySelector('.js-session-id').textContent = this.id;
        this._bindEventListeners();
    }

    _bindEventListeners() {
        this.peer.on('error', err => {
            console.error(err);
        });
        this.peer.on('connection', conn => {
            this.connections.push(conn);
            conn.send({interval: this.interval});
            conn.on('data', data => {
                console.log(data);
            });
        });
        document.querySelector('.js-start-button').addEventListener('click', e => {
            const button = e.currentTarget;
            if (this.playing) {
                button.textContent = 'Start';
                // this.audio.pause();
                this.sendToClients({event: 'pause'});
                this.playing = false;
            } else {
                button.textContent = 'Stop';
                // this.audio.play();
                this.sendToClients({event: 'play'});
                this.playing = true;
            }
        });
        const intervalEl = document.querySelector('.js-interval');
        intervalEl.value = localStorage.getItem('secs') || 1;
        const onIntervalChange = () => {
            const secs = intervalEl.value
            // this.audio.setInterval(secs);
            localStorage.setItem('secs', secs);
            this.sendToClients({interval: secs});
        };
        intervalEl.addEventListener('change', onIntervalChange);
        onIntervalChange();
    }

    sendToClients(data) {
        this.connections.forEach(conn => conn.send(data));
    }

    static _secureRandomId() {
        const r = new Uint32Array(1);
        crypto.getRandomValues(r);
        return r[0].toString();
    }
    
}