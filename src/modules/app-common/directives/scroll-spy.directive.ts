import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { UtilityService } from '@common/services';

@Directive({
    selector: '[sbproScrollSpy]',
})
export class ScrollSpyDirective implements AfterViewInit, OnDestroy, OnInit {
    @Input() inViewportOptions: IntersectionObserverInit = {
        // rootMargin: '-1px 0px -1px 0px',
    };

    inViewport!: boolean;
    hasIntersectionObserver!: boolean;
    observer!: IntersectionObserver;

    constructor(public utilityService: UtilityService, private _elRef: ElementRef) {
        this.hasIntersectionObserver = this.intersectionObserverFeatureDetection();
    }

    ngOnInit() {
        if (!this.hasIntersectionObserver) {
            this.inViewport = true;
            console.log('### INFO: Unable to find IntersectionObserver');
        }
    }

    ngAfterViewInit() {
        if (this.hasIntersectionObserver) {
            const IntersectionObserver = this.utilityService.window.IntersectionObserver;
            this.observer = new IntersectionObserver(this.intersectionObserverCallback.bind(this), {
                ...this.inViewportOptions,
                root: this.utilityService.window.document.querySelector('#layoutSidenav_content'),
            });

            this.observer.observe(this._elRef.nativeElement);
        }
    }

    ngOnDestroy() {
        if (this.observer) {
            this.observer.unobserve(this._elRef.nativeElement);
        }
    }

    intersectionObserverCallback(entries: IntersectionObserverEntry[]) {
        entries.forEach((entry) => {
            if (this.inViewport === entry.isIntersecting) {
                return;
            }
            this.inViewport = entry.isIntersecting;
        });
    }

    intersectionObserverFeatureDetection() {
        // Exits early if all IntersectionObserver and IntersectionObserverEntry
        // features are natively supported.
        if (
            'IntersectionObserver' in this.utilityService.window &&
            'IntersectionObserverEntry' in this.utilityService.window
        ) {
            // Minimal polyfill for Edge 15's lack of `isIntersecting`
            // See: https://github.com/w3c/IntersectionObserver/issues/211
            if (
                !(
                    'isIntersecting' in
                    this.utilityService.window.IntersectionObserverEntry.prototype
                )
            ) {
                Object.defineProperty(
                    this.utilityService.window.IntersectionObserverEntry.prototype,
                    'isIntersecting',
                    {
                        get() {
                            return this.intersectionRatio > 0;
                        },
                    }
                );
            }
            return true;
        }
        return false;
    }
}
