import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Community } from '../../../models/community';
import { User } from '../../../models/user';
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-community-info-card',
  templateUrl: './community-info-card.component.html',
  styleUrl: '../view-community/view-community.component.scss',
})
export class CommunityInfoCardComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollElement') scrollElement!: ElementRef;

  @Input() community!: Community;
  @Input() moderator!: User | null;
  @Input() isModerator!: boolean;
  showMore: boolean = false;
  constructor(public userService: UserService, private router: Router) {}
  ngOnInit(): void {}
  ngAfterViewInit() {
    this.updateTopPosition();
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.updateTopPosition();
  }

  updateTopPosition() {
    const scrollTop = window.scrollY;
    const minTop = 65;
    let maxTop;
    if (this.router.url.includes('community')) {
      maxTop = 250;
    } else {
      maxTop = 75;
    }
    let newTop = maxTop - scrollTop;
    if (newTop < minTop) {
      newTop = minTop;
    }
    this.scrollElement.nativeElement.style.top = `${newTop}px`;
  }

  expandContractText() {
    this.showMore = !this.showMore;
  }
}
