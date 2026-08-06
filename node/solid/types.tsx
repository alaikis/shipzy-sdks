import type { ZymeupConfig } from '../src/http-client';
import type { ZymeupClient } from '../src/index';

export interface ZymeupSolidContext {
    config: ZymeupConfig;
    client: ZymeupClient;
}

export interface ZymeupSolidStore {
    config: ZymeupConfig;
    client: ZymeupClient;
}
