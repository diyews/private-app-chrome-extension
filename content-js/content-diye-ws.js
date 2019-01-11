'use strict';

window.addEventListener('message', function(event) {
    const eventData = event.data;
    try {
        // We only accept messages from ourselves
        // type must be 'P2C' (page to content js)
        if (event.source !== window || eventData.type !== 'P2C' || !eventData.data)
            return;
    } catch (e) {
        return;
    }
    switch (eventData.data.domain) {
        case 'douyu.com':
            handleDouyu(eventData.data);
            break;
        default:
    }
}, false);

function handleDouyu(eventData) {
    switch (eventData.action) {
        case 'request-sign':
            createSignEvalStringByRoomID(eventData);
            break;
        case 'post-sign':
            requestFlvUrlBySign(eventData.data);
            break;
        default:

    }
}

function createSignEvalStringByRoomID(data) {
    chrome.runtime.sendMessage(data, function(response) {
        // console.log(response);
        let signFuncStr = eval(response.resultScriptStr);
        const paddingMatch = signFuncStr.match(/=(?:\s*\w+\s*\+){3}"(.*?)"/);
        const paddingStr = paddingMatch[1];
        // console.log(signFuncStr);
        // could be any random 32-length string
        const douyuDid = 'aa5dfd2e75c05d1d152fd60700050000';
        const timeSec  = Math.floor(+new Date() / 1e3);
        const md5Str = CryptoJS.MD5(data.data + douyuDid + timeSec + paddingStr).toString();
        signFuncStr = signFuncStr.replace(/=\s*?CryptoJS.MD5\(.+?\).*?;/, `='${md5Str}';`);
        signFuncStr = signFuncStr.match(/(.*?);*$/)[1];
        signFuncStr = `${signFuncStr}(${data.data},"${douyuDid}",${timeSec})`;
        console.log(signFuncStr);
        // console.log(eval(signFuncStr)(data.data, douyuDid, timeSec) + formDataStr)
        postMessage({
            type: 'C2P',
            action: 'eval',
            data: signFuncStr
        }, '*')
    });
}

function requestFlvUrlBySign(data) {
    const formDataStr =  `${data.sign}&cdn=tct-h5&rate=1&ver=Douyu_219010471&iar=0&ive=0`;
    const urlParams = new URLSearchParams(formDataStr);
    fetch(`https://www.douyu.com/lapi/live/getH5Play/${data.roomID}`,
        {
            method: 'POST',
            body: urlParams
        })
        .then(data => data.json())
        .then(data => {
            console.log(data);
        });
}