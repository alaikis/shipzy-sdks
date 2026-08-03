/**
 * Zymeup SDK - Vue 3 Bindings
 * Change: sdk-full-process
 *
 * Vue 3 Composition API bindings for the Shipzy SDK.
 */

import type { ShipzyConfig } from '../src/http-client';
import { ShipzyClient } from '../src/index';

/**
 * Create a reactive Shipzy client for Vue 3.
 */
export function useZymeup(config: Partial<ShipzyConfig> = {}): ShipzyClient {
  return new ShipzyClient(config);
}

export { ShipzyClient } from '../src/index';
export type { ShipzyConfig } from '../src/http-client';
export type { ApiResult, EpodListItem, EpodListResponse, EpodDetail, SignUrlResponse, OrderListItem, OrderListResponse, OrderDetail, EcmrListItem, EcmrListResponse } from '../src/index';
