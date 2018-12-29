// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let changeColor = document.getElementById('changeColor');
chrome.storage.sync.get('color', function(data) {
  console.log(data);
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});
changeColor.onclick = function(element) {
    fetch('https://www.douyu.com/betard/610588')
	.then(data => data.json())
	.then(data => {
		console.log(data);
	})
	fetch('https://www.douyu.com/lapi/live/getH5Play/1758008', 
	{
		method: 'POST',
		body: new URLSearchParams('sign=b0b463bc6811ac3072cb1aabdd75b761')
	})
	.then(data => data.json())
	.then(data => {
		console.log(data);
	})
  };

chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
    console.log(response.farewell);
});