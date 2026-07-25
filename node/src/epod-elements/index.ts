import './components/epod-list';
import './components/epod-detail';
import './components/epod-create';
import './components/epod-login';
import './components/epod-signature';
import './components/tracking-list';
import './components/tracking-detail';

export { Epod } from './imperative-api';
export type { ShowListOptions, ShowDetailOptions, ShowCreateOptions, ShowSignatureOptions } from './imperative-api';

export { EpodApiClient, EpodAuthError, EpodApiError } from './api-client';
export type { EpodApiClientConfig, EpodListResponse, EpodDetail, EpodListItem, TrackingDetail, TrackingEvent, TrackingListItem, TrackingListResponse } from './api-client';

export { epodAuth, EpodAuthManager } from './auth';
export type { AuthState } from './auth';

export function registerEpodElements() {
    // Components self-register via customElements.define()
}
