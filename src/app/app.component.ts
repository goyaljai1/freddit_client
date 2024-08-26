import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  showLowResolution: boolean = false;

  ngOnInit() {
    this.checkScreenResolution();
    window.addEventListener('resize', this.checkScreenResolution.bind(this));
  }

  checkScreenResolution() {
    this.showLowResolution = window.innerWidth < 1024;
  }
}
