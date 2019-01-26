import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-token',
  templateUrl: './auth-token.component.html',
  styleUrls: ['./auth-token.component.scss']
})
export class AuthTokenComponent implements OnInit {
  authToken: string;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    chrome.storage.sync.get('auth-token', data => {
      console.log(data['auth-token']);
      this.authToken = data['auth-token'] || '';
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnInit() {
  }

  confirm() {
    chrome.storage.sync.set({'auth-token': this.authToken});
    chrome.tabs.create()
  }
}
