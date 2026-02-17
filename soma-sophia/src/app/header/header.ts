import { Component, input } from '@angular/core';

@Component({
  selector: 'ss-header',
  imports: [],
  templateUrl: './header.html',
})
export class Header {
    text = input('');
}
