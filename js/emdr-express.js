
'use strict';

import EmdrExpressHostView from './emdr-express-host-view.js';
import EmdrExpressJoinView from './emdr-express-join-view.js';

export default class EmdrExpress {

    constructor() {
        this._bindEventListeners();
    }

    _bindEventListeners() {
        document.querySelector('.js-host-button').addEventListener('click', e => {
            document.querySelectorAll('.c-view').forEach(el => el.classList.remove('c-view--active'));
            document.querySelector('.c-view--host').classList.add('c-view--active');
            new EmdrExpressHostView();
        });

        document.querySelector('.js-join-button').addEventListener('click', e => {
            const id = window.prompt('Please enter session ID: ');
            if (id) {
                document.querySelectorAll('.c-view').forEach(el => el.classList.remove('c-view--active'));
                document.querySelector('.c-view--join').classList.add('c-view--active');
                new EmdrExpressJoinView(id);
            }
        });

        if (location.hash) {
            document.querySelectorAll('.c-view').forEach(el => el.classList.remove('c-view--active'));
            document.querySelector('.c-view--join').classList.add('c-view--active');
            new EmdrExpressJoinView(location.hash.substr(1));
        }
    }
    
}