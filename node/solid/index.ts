/**
 * Zymeup SDK - Solid.js Bindings
 * Change: sdk-full-process
 */

import { ShipzyClient } from '../src/index';
import type { ShipzyConfig } from '../src/http-client';

export function createZymeup(config: Partial<ShipzyConfig> = {}): ShipzyClient {
  return new ShipzyClient(config);
}

export { ShipzyClient } from '../src/index';
export type { ShipzyConfig } from '../src/http-client';
export type { ApiResult, EpodListItem, EpodListResponse, EpodDetail, OrderListItem, OrderListResponse, EcmrListItem, EcmrListResponse } from '../src/index';
