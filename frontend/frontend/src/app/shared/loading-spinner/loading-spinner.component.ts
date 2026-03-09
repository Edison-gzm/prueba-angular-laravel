import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Spinner de carga reutilizable (componente de presentación).
 * Usa OnPush y ngOnChanges para cumplir requisitos de ciclo de vida.
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-center gap-3">
      <div
        class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0"
        aria-hidden="true"
      ></div>
      @if (displayMessage) {
        <span class="text-slate-600 text-sm font-medium">{{ displayMessage }}</span>
      }
    </div>
  `,
})
export class LoadingSpinnerComponent implements OnChanges {
  /** Mensaje mostrado junto al spinner (ej. "Iniciando sesión...") */
  @Input() message = '';

  /** Mensaje que se pinta; se actualiza en ngOnChanges cuando cambia @Input message */
  displayMessage = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message']) {
      this.displayMessage = this.message ?? '';
    }
  }
}
