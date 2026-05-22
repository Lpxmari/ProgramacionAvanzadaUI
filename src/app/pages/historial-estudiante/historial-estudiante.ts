import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { HistorialService } from '../../core/services/historial.service';
import { AuthService } from '../../core/services/auth.service';

import {
  HistorialDTO,
  EstadoSolicitud
} from '../../core/shared/models/solicitud.model';

@Component({
  selector: 'app-historial-estudiante',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './historial-estudiante.html'
})
export class HistorialEstudianteComponent implements OnInit {

  historial = signal<HistorialDTO[]>([]);
  loading = signal(false);
  error = signal('');
  buscado = signal(false);

  solicitudId = new FormControl<number | null>(null);

  constructor(
    private historialService: HistorialService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  buscar() {

    const solicitudId = this.solicitudId.value;

    if (!solicitudId) {

      this.error.set(
        'Debes ingresar un ID de solicitud.'
      );

      return;

    }

    const estudianteId =
      this.authService.getPayload()?.id;

    if (!estudianteId) {

      this.error.set(
        'No se encontró el estudiante.'
      );

      return;

    }

    this.loading.set(true);

    this.error.set('');

    this.historialService
      .obtenerHistorialEstudiante(
        estudianteId,
        solicitudId
      )
      .subscribe({

        next: (data: HistorialDTO[]) => {

          this.historial.set(data);

          this.loading.set(false);

          this.buscado.set(true);

        },

        error: (err) => {

          console.error(err);

          this.error.set(
            'No tienes acceso a esta solicitud o no existe.'
          );

          this.loading.set(false);

          this.buscado.set(true);

        }

      });

  }

  estadoClase(estado: EstadoSolicitud): string {

    const map: Record<EstadoSolicitud, string> = {

      REGISTRADA:
        'bg-blue-100 text-blue-700',

      CLASIFICADA:
        'bg-yellow-100 text-yellow-700',

      EN_ATENCION:
        'bg-orange-100 text-orange-700',

      ATENDIDA:
        'bg-green-100 text-green-700',

      CERRADA:
        'bg-gray-100 text-gray-500'

    };

    return map[estado] ??
      'bg-gray-100 text-gray-500';

  }

  formatFecha(f: string): string {

    if (!f) return '-';

    return new Date(f).toLocaleString(
      'es-CO',
      {

        day: '2-digit',

        month: 'short',

        year: 'numeric',

        hour: '2-digit',

        minute: '2-digit'

      }
    );

  }

}