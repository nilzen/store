import { InjectionToken, Type } from '@angular/core';
import { StateToken, ɵMETA_OPTIONS_KEY } from '@ngxs/store';
import { StateClass } from '@ngxs/store/internals';

import { StorageEngine } from '../symbols';

/** This enables the user to provide a storage engine per individual key. */
export interface KeyWithExplicitEngine {
  key: string | StateClass | StateToken<any>;
  engine: Type<StorageEngine> | InjectionToken<StorageEngine>;
}

/** Determines whether the provided key has the following structure. */
export function isKeyWithExplicitEngine(key: any): key is KeyWithExplicitEngine {
  return !!key?.engine;
}

/**
 * This tuples all of the possible types allowed in the `key` property.
 * This is not exposed publicly and used internally only.
 */
export type StorageKey = string | StateClass | StateToken<any> | KeyWithExplicitEngine;

export function extractStateName(storageKey: StorageKey): string {
  // Extract the actual key out of the `{ key, engine }` structure.
  if (isKeyWithExplicitEngine(storageKey)) {
    storageKey = storageKey.key;
  }

  // Given the `storageKey` is a class, for instance, `AuthState`.
  // We should retrieve its metadata and the `name` property.
  // The `name` property might be a string (state name) or a state token.
  if (storageKey.hasOwnProperty(ɵMETA_OPTIONS_KEY)) {
    storageKey = (storageKey as any)[ɵMETA_OPTIONS_KEY].name;
  }

  return storageKey instanceof StateToken ? storageKey.getName() : <string>storageKey;
}
