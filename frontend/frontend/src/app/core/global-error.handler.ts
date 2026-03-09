import { ErrorHandler, Injectable } from '@angular/core';

/**
 * Captura errores de carga de chunks (lazy load) y recarga la página una vez
 * para intentar recuperar cuando el servidor devuelve ERR_EMPTY_RESPONSE.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private chunkErrorReloadKey = 'chunk_error_reload_attempted';

  handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    const isChunkLoadError =
      message.includes('Failed to fetch dynamically imported module') ||
      message.includes('Loading chunk') ||
      message.includes('Loading CSS chunk');

    if (isChunkLoadError && !sessionStorage.getItem(this.chunkErrorReloadKey)) {
      sessionStorage.setItem(this.chunkErrorReloadKey, '1');
      window.location.reload();
      return;
    }
    if (isChunkLoadError) {
      sessionStorage.removeItem(this.chunkErrorReloadKey);
    }

    console.error('Error no controlado:', error);
  }
}
