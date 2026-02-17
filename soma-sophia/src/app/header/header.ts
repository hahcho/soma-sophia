import { Component, input } from '@angular/core';

@Component({
  selector: 'ss-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
    text = input('');
}
