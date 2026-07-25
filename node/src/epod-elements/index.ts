import './components/epod-list';
import './components/epod-detail';
import './components/epod-create';
import './components/epod-login';
import './components/epod-signature';

export { Epod } from './imperative-api';
export type { ShowListOptions, ShowDetailOptions, ShowCreateOptions } from './imperative-api';

export { EpodApiClient, EpodAuthError, EpodApiError } from './api-client';
export type { EpodApiClientConfig, EpodListResponse, EpodDetail, EpodListItem } from './api-client';

export { epodAuth, EpodAuthManager } from './auth';
export type { AuthState } from './auth';

export function registerEpodElements() {
    // Components self-register via customElements.define()
}
