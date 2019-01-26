import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthTokenComponent } from './auth-token/auth-token.component';
import { createCustomElement } from '@angular/elements';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AuthTokenComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  entryComponents: [AuthTokenComponent]
})
export class OptionsModule {
  constructor(injector: Injector) {
    const AuthTokenElement = createCustomElement(AuthTokenComponent, { injector });
    customElements.define('auth-token-element', AuthTokenElement);
  }
}
