'use strict';

console.log('douyu bg');
const createSubscription = (callback, subjectRef) => {
    const symbol = Symbol();
    return {
        symbol,
        callback,
        unsubscribe() {
            subjectRef.unsubscribe(symbol);
        }
    }
};
const Subject = function () {
    return {
        subscriptions: [],
        next(data) {
            this.subscriptions.forEach(x => {
                x.callback(data);
            })
        },
        subscribe(callback) {
            if (!callback) return;
            const subscription = createSubscription(callback, this);
            this.subscriptions.push(subscription);
            return subscription;
        },
        unsubscribe(symbol) {
            for (let i = 0; i < this.subscriptions.length; i++) {
                const subscription = this.subscriptions[i];
                if (subscription.symbol === symbol) {
                    this.subscriptions.splice(i, 1);
                    break;
                }
            }
        }
    }
};

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        try {
            if (request.domain !== 'douyu.com') return;
        } catch (e) {
            return;
        }
        switch (request.action) {
            case 'request-sign':
                createSign({ roomID: request.data, sendResponse });
                return true;
        }
    });
/*let once = true;
const webReqSubject = new Subject();
webReqSubject.subscribe(data => console.log(data));
chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        console.log(details.requestBody);
        const param = details.requestBody.formData;
        const requestParam = new FormData();
        ['v', 'did', 'tt', 'sign', 'cdn', 'rate', 'ver', 'iar', 'ive'].forEach(x => {
            requestParam.append(x, param[x]);
        });
        if (once) {
            once = false;
            fetch(details.url,
                {
                    method: 'POST',
                    body: new URLSearchParams(requestParam)
                })
                .then(data => data.json())
                .then(data => {
                    console.log(data);
                    webReqSubject.next(data);
                })
        }
        return details;
    },
    {urls: ['*://!*!/!*!/getH5Play/!*']},
    ['requestBody']);*/

// fetch page
function createSign({roomID, sendResponse}) {
    const result = {
        roomID,
        resultScriptStr: null
    };

    return new Promise(((resolve, reject) => {
        fetch(`https://www.douyu.com/${roomID}`)
            .then(data => data.text())
            .then(data => {
                // console.log(data);
                try {
                    // get script string
                    const scriptMatch = data.match(/var vdwdae325w_64we.*?=\s*?"(.*?)".*?(?=<\/script>)/);
                    // console.log(scriptMatch);
                    const scriptStr = scriptMatch[0];
                    const funcNameMatch = scriptStr.match(/function (\w*?)\((?:[\s\w]*?,){2}[\s\w]*?\)\s*?{/);
                    // console.log(funcNameMatch);
                    const funcName = funcNameMatch[1];
                    const funcReplace = /return eval\((\w*?)\)\((?:[\s\w]*?,){2}[\s\w]*?\);/;
                    let resultScriptStr = scriptStr.replace(funcReplace, 'return $1;');
                    resultScriptStr = `(() => {${resultScriptStr}return ${funcName}();})()`;
                    console.log(resultScriptStr);
                    result.resultScriptStr = resultScriptStr;
                    sendResponse(result);
                    resolve(result);
                } catch (e) {
                    reject();
                }
            });
    }));
}