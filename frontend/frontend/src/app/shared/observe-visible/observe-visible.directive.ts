import {
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

/**
 * Emite (visible) cuando el elemento entra en el viewport (para scroll infinito).
 */
@Directive({
  selector: '[appObserveVisible]',
  standalone: true,
})
export class ObserveVisibleDirective implements OnInit, OnDestroy {
  @Output() visible = new EventEmitter<void>();

  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          this.visible.emit();
        }
      },
      { rootMargin: '100px', threshold: 0 }
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
