import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { NgStyle } from '@angular/common';

import { Source } from './sources/source';
import { AsyncSource } from './sources/async-source';
import { SourceFactory } from './sources/source.factory';
import { AvatarService } from './avatar.service';
import { AvatarSource } from './sources/avatar-source.enum';
import { takeWhile, map } from 'rxjs/operators';

type Style = Partial<CSSStyleDeclaration>;

/**
 * Universal avatar component that
 * generates avatar from different sources
 *
 * export
 * class AvatarComponent
 * implements {OnChanges}
 */

@Component({
  selector: 'ngx-avatar',
  standalone: true,
  imports: [NgStyle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
     :host {
        border-radius: 50%;
      }
      
      // :host {
      //   border-radius: 50%;
      //   display: inline-block;
      // }
      
      // .avatar-container {
      //   outline: none;
      // }
    `
  ],
  template: `
    <div
      (click)="onAvatarClicked()"
      (keydown)="onKeyDown($event)"
      class="avatar-container"
      [ngStyle]="hostStyle"
      [attr.role]="role"
      [attr.aria-label]="getAriaLabel()"
      [attr.tabindex]="clickable ? '0' : null"
      [class.clickable]="clickable"
    >
      @if (avatarSrc) {
        <img
          [src]="avatarSrc"
          [alt]="getAltText()"
          [width]="size"
          [height]="size"
          [ngStyle]="avatarStyle"
          (error)="fetchAvatarSource()"
          class="avatar-content"
          loading="lazy"
          [attr.aria-hidden]="role === 'img' ? null : 'true'"
        />
      } @else if (avatarText) {
        <div 
          class="avatar-content" 
          [ngStyle]="avatarStyle"
          [attr.aria-label]="getAriaLabel()"
        >
          {{ avatarText }}
        </div>
      }
    </div>
  `
})
export class AvatarComponent implements OnChanges, OnDestroy {
  @Input()
  public round = true;
  @Input()
  public size: string | number = 50;
  @Input()
  public textSizeRatio = 3;
  @Input()
  public bgColor: string | undefined;
  @Input()
  public fgColor = '#FFF';
  @Input()
  public borderColor: string | undefined;
  @Input()
  public style: Style = {};
  @Input()
  public cornerRadius: string | number = 0;

  // Accessibility inputs
  @Input()
  public alt?: string;
  @Input()
  public ariaLabel?: string;
  @Input()
  public role: string = 'img';
  @Input()
  public clickable: boolean = false;
  
  // Avatar source inputs - aliases needed for backward compatibility
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('facebookId')
  public facebook?: string | null;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('twitterId')
  public twitter?: string | null;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('googleId')
  public google?: string | null;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('instagramId')
  public instagram?: string | null;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vkontakteId')
  public vkontakte?: string | null;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('skypeId')
  public skype?: string | null;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('gravatarId')
  public gravatar?: string | null;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('githubId')
  public github?: string | null;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('src')
  public custom?: string | null;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('name')
  public initials?: string | null;
  @Input()
  public value?: string | null;
  @Input()
  public placeholder?: string;
  @Input()
  public initialsSize: string | number = 0;

  @Output()
  public clickOnAvatar: EventEmitter<Source> = new EventEmitter<Source>();

  public isAlive = true;
  public avatarSrc: string | null = null;
  public avatarText: string | null = null;
  public avatarStyle: Style = {};
  public hostStyle: Style = {};

  private currentIndex = -1;
  private sources: Source[] = [];

  // Modern Angular 17 dependency injection
  public sourceFactory = inject(SourceFactory);
  private avatarService = inject(AvatarService);
  private cdr = inject(ChangeDetectorRef);

  public onAvatarClicked(): void {
    if (this.clickable) {
      this.clickOnAvatar.emit(this.sources[this.currentIndex]);
    }
  }

  public onKeyDown(event: KeyboardEvent): void {
    if (this.clickable && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      this.onAvatarClicked();
    }
  }

  /**
   * Generate accessible alt text for avatar images
   */
  public getAltText(): string {
    if (this.alt) {
      return this.alt;
    }

    if (this.initials) {
      return `Avatar for ${this.initials}`;
    }

    if (this.value) {
      return `Avatar displaying ${this.value}`;
    }

    // Determine source type for better description
    const currentSource = this.sources[this.currentIndex];
    if (currentSource?.sourceType) {
      return `Avatar from ${currentSource.sourceType}`;
    }

    return 'User avatar';
  }

  /**
   * Generate ARIA label for accessibility
   */
  public getAriaLabel(): string {
    if (this.ariaLabel) {
      return this.ariaLabel;
    }

    if (this.clickable) {
      return `${this.getAltText()}, clickable`;
    }

    return this.getAltText();
  }

  /**
   * Detect inputs change
   *
   * param {{ [propKey: string]: SimpleChange }} changes
   *
   * memberof AvatarComponent
   */
  public ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (this.avatarService.isSource(propName)) {
        const sourceType: AvatarSource = AvatarSource[propName.toUpperCase() as keyof typeof AvatarSource] ;
        const currentValue = changes[propName].currentValue;
        if (currentValue && typeof currentValue === 'string') {
          this.addSource(sourceType, currentValue);
        } else {
          this.removeSource(sourceType);
        }
      }
    }
    // reinitialize the avatar component when a source property value has changed
    // the fallback system must be re-invoked with the new values.
    this.initializeAvatar();
  }

  /**
   * Fetch avatar source
   *
   * memberOf AvatarComponent
   */
  public fetchAvatarSource(): void {
    const previousSource = this.sources[this.currentIndex];
    if (previousSource) {
      this.avatarService.markSourceAsFailed(previousSource);
    }

    const source = this.findNextSource();
    if (!source) {
      return;
    }

    if (this.avatarService.isTextAvatar(source.sourceType)) {
      this.buildTextAvatar(source);
      this.avatarSrc = null;
      this.cdr.markForCheck();
    } else {
      this.buildImageAvatar(source);
    }
  }

  private findNextSource(): Source | null {
    while (++this.currentIndex < this.sources.length) {
      const source = this.sources[this.currentIndex];
      if (source && !this.avatarService.sourceHasFailedBefore(source)) {
        return source;
      }
    }

    return null;
  }

  public ngOnDestroy(): void {
    this.isAlive = false;
  }

  /**
   * Initialize the avatar component and its fallback system
   */
  private initializeAvatar(): void {
    this.currentIndex = -1;
    if (this.sources.length > 0) {
      this.sortAvatarSources();
      this.fetchAvatarSource();
      this.hostStyle = {
        width: this.size + 'px',
        height: this.size + 'px'
      };
    }
  }

  private sortAvatarSources(): void {
    this.sources.sort((source1, source2) =>
      this.avatarService.compareSources(source1.sourceType, source2.sourceType)
    );
  }

  private buildTextAvatar(avatarSource: Source): void {
    this.avatarText = avatarSource.getAvatar(+this.initialsSize);
    this.avatarStyle = this.getInitialsStyle(avatarSource.sourceId);
  }

  private buildImageAvatar(avatarSource: Source): void {
    this.avatarStyle = this.getImageStyle();
    if (avatarSource instanceof AsyncSource) {
      this.fetchAndProcessAsyncAvatar(avatarSource);
    } else {
      this.avatarSrc = avatarSource.getAvatar(+this.size);
      this.cdr.markForCheck();
    }
  }

  /**
   *
   * returns initials style
   *
   * memberOf AvatarComponent
   */
  private getInitialsStyle(avatarValue: string): Style {
    return {
      textAlign: 'center',
      borderRadius: this.round ? '100%' : this.cornerRadius + 'px',
      border: this.borderColor ? '1px solid ' + this.borderColor : '',
      textTransform: 'uppercase',
      color: this.fgColor,
      backgroundColor: this.bgColor
        ? this.bgColor
        : this.avatarService.getRandomColor(avatarValue),
      font:
        Math.floor(+this.size / this.textSizeRatio) +
        'px Helvetica, Arial, sans-serif',
      lineHeight: this.size + 'px',
      ...this.style
    };
  }

  /**
   *
   * returns image style
   *
   * memberOf AvatarComponent
   */
  private getImageStyle(): Style {
    return {
      maxWidth: '100%',
      borderRadius: this.round ? '50%' : this.cornerRadius + 'px',
      border: this.borderColor ? '1px solid ' + this.borderColor : '',
      width: this.size + 'px',
      height: this.size + 'px',
      ...this.style,
    };
  }
  /**
   * Fetch avatar image asynchronously.
   *
   * param {Source} source represents avatar source
   * memberof AvatarComponent
   */
  private fetchAndProcessAsyncAvatar(source: AsyncSource): void {
    if (this.avatarService.sourceHasFailedBefore(source)) {
      return;
    }

    this.avatarService
        .fetchAvatar(source.getAvatar(+this.size))
        .pipe(
            takeWhile(() => this.isAlive),
            map(response => source.processResponse(response, +this.size)),
        )
        .subscribe({
            next: avatarSrc => {
              this.avatarSrc = avatarSrc;
              this.cdr.markForCheck();
            },
            error: _err => {
              this.fetchAvatarSource();
            },
          }
        );
  }

  /**
   * Add avatar source
   *
   * param sourceType avatar source type e.g facebook,twitter, etc.
   * param sourceValue  source value e.g facebookId value, etc.
   */
  private addSource(sourceType: AvatarSource, sourceValue: string): void {
    const source = this.sources.find(s => s.sourceType === sourceType);
    if (source) {
      source.sourceId = sourceValue;
    } else {
      this.sources.push(
          this.sourceFactory.newInstance(sourceType, sourceValue),
      );
    }
  }

  /**
   * Remove avatar source
   *
   * param sourceType avatar source type e.g facebook,twitter, etc.
   */
  private removeSource(sourceType: AvatarSource): void {
    this.sources = this.sources.filter(source => source.sourceType !== sourceType);
  }
}
