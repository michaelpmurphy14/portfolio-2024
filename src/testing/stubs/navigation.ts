import { SBRouteData } from '@modules/navigation/models';
import { NavigationService } from '@modules/navigation/services';
import { of, Subject } from 'rxjs';

const _expand$ = new Subject<string[]>();

export const NavigationServiceStub: Partial<NavigationService> = {
    sideNavVisible$: () => of(true),
    toggleSideNav: (visibility?: boolean) => {},
    routeData$: () => of({} as SBRouteData),
    currentURL$: () => of('TEST_URL'),
};
