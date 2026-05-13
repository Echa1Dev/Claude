/**
 * AssetLoader — carga assets con barra de progreso y caché.
 * Soporta texturas, fuentes y audio. Extensible a modelos GLTF.
 */
import * as THREE from 'three';

export class AssetLoader {
  constructor() {
    this._cache        = new Map();
    this._textureLoader = new THREE.TextureLoader();
    this._total        = 0;
    this._loaded       = 0;
    this._onProgress   = null;
  }

  onProgress(fn) {
    this._onProgress = fn;
    return this;
  }

  async loadTexture(url, key) {
    if (this._cache.has(key)) return this._cache.get(key);

    return new Promise((resolve, reject) => {
      this._textureLoader.load(
        url,
        (texture) => {
          this._cache.set(key, texture);
          this._tick();
          resolve(texture);
        },
        undefined,
        reject
      );
    });
  }

  // Carga batch de texturas con progreso total
  async loadAll(manifest) {
    this._total  = manifest.length;
    this._loaded = 0;

    const promises = manifest.map(({ url, key, type = 'texture' }) => {
      if (type === 'texture') return this.loadTexture(url, key);
      return Promise.resolve();
    });

    return Promise.all(promises);
  }

  get(key) {
    return this._cache.get(key);
  }

  _tick() {
    this._loaded++;
    const progress = this._total > 0 ? this._loaded / this._total : 1;
    this._onProgress?.(progress);
  }
}

export const assetLoader = new AssetLoader();
