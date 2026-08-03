/**
 * Zymeup SDK - React Bindings
 * Change: sdk-full-process
 */

import React, { createContext, useContext, useMemo } from 'react';
import { ShipzyClient } from '../src/index';
import type { ShipzyConfig } from '../src/http-client';

const ZymeupContext = createContext<ShipzyClient | null>(null);

export function ZymeupProvider({
  config,
  children,
}: {
  config: Partial<ShipzyConfig>;
  children: React.ReactNode;
}) {
  const client = useMemo(() => new ShipzyClient(config), [config]);
  return React.createElement(ZymeupContext.Provider, { value: client }, children);
}

export function useZymeup(): ShipzyClient {
  const client = useContext(ZymeupContext);
  if (!client) {
    throw new Error('useZymeup must be used within a ZymeupProvider');
  }
  return client;
}

export { ShipzyClient } from '../src/index';
export type { ShipzyConfig } from '../src/http-client';
export type { ApiResult, EpodListItem, EpodListResponse, EpodDetail, OrderListItem, OrderListResponse, EcmrListItem, EcmrListResponse } from '../src/index';
