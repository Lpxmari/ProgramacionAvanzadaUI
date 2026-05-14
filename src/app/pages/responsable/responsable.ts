import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';

import {
  SolicitudService,
  SolicitudDTO,
  EstadoSolicitud,
  TipoSolicitud,
  NivelSolicitud,
  CierreDTO
} from '../../services/solicitud.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-responsable',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './responsable.html'
})
export class ResponsableComponent implements OnInit {

  solicitudes = signal<SolicitudDTO[]>([]);
  loading = signal(false);
  error = signal('');

  modalDetalle = signal(false);
  modalCierre = signal(false);

  solicitudSeleccionada = signal<SolicitudDTO | null>(null);

  formCierre = new FormGroup({
    observacion: new FormControl('', Validators.required)
  });

  constructor(
    private solicitudService: SolicitudService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarSolicitudesResponsable();
  }

  cargarSolicitudesResponsable() {

    console.log( this.authService.getPayload() );

    const responsableId = this.authService.getPayload()?.id;

    if (!responsableId) {
      this.error.set('No se encontró el responsable.');
      return;
    }

    this.loading.set(true);

    this.solicitudService
      .listarPorResponsable(responsableId)
      .subscribe({

        next: (data) => {

          this.solicitudes.set(data);

          this.loading.set(false);

        },

        error: (err) => {

          console.error(err);

          this.error.set('Error al cargar solicitudes.');

          this.loading.set(false);

        }

      });

  }

  atenderSolicitud(s: SolicitudDTO) {

    const observaciones = prompt('Observaciones de atención (opcional):');

    this.loading.set(true);

    this.solicitudService
      .atender(s.id, observaciones ?? '')
      .subscribe({

        next: () => {

          this.cargarSolicitudesResponsable();

          this.loading.set(false);

        },

        error: (err) => {

          console.error(err);

          this.error.set('Error al marcar solicitud como atendida.');

          this.loading.set(false);

        }

      });

  }

  abrirCierre(s: SolicitudDTO) {

    this.solicitudSeleccionada.set(s);

    this.formCierre.reset();

    this.modalCierre.set(true);

  }

  guardarCierre() {

    if (
      this.formCierre.invalid ||
      !this.solicitudSeleccionada()
    ) return;

    const responsableId = Number(localStorage.getItem('responsableId'));

    const dto: CierreDTO = {
      responsableId,
      observacion: this.formCierre.value.observacion!,
      fecha: new Date().toISOString().slice(0, 19)
    };

    this.loading.set(true);

    this.solicitudService
      .cerrar(this.solicitudSeleccionada()!.id, dto)
      .subscribe({

        next: () => {

          this.modalCierre.set(false);

          this.cargarSolicitudesResponsable();

          this.loading.set(false);

        },

        error: (err) => {

          console.error(err);

          this.error.set('Error al cerrar solicitud.');

          this.loading.set(false);

        }

      });

  }

  verDetalle(s: SolicitudDTO) {

    this.solicitudSeleccionada.set(s);

    this.modalDetalle.set(true);

  }

  estadoClase(estado: EstadoSolicitud): string {

    const map: Record<EstadoSolicitud, string> = {
      REGISTRADA: 'bg-blue-100 text-blue-700',
      CLASIFICADA: 'bg-yellow-100 text-yellow-700',
      EN_ATENCION: 'bg-orange-100 text-orange-700',
      ATENDIDA: 'bg-green-100 text-green-700',
      CERRADA: 'bg-gray-100 text-gray-500'
    };

    return map[estado] ?? 'bg-gray-100 text-gray-500';

  }

  nivelClase(nivel?: NivelSolicitud): string {

    if (!nivel) {
      return 'bg-gray-100 text-gray-400';
    }

    const map: Record<NivelSolicitud, string> = {
      BAJA: 'bg-green-100 text-green-700',
      MEDIA: 'bg-yellow-100 text-yellow-700',
      ALTA: 'bg-orange-100 text-orange-700',
      CRITICA: 'bg-red-100 text-red-700'
    };

    return map[nivel];

  }

  labelTipo(tipo: TipoSolicitud): string {

    const map: Record<TipoSolicitud, string> = {
      REGISTRO_ASIGNATURAS: 'Registro asignaturas',
      HOMOLOGACION: 'Homologación',
      CANCELACION_ASIGNATURAS: 'Cancelación asignaturas',
      SOLICITUD_CUPOS: 'Solicitud cupos',
      CONSULTA_ACADEMICA: 'Consulta académica'
    };

    return map[tipo] ?? tipo;

  }

  formatFecha(f: string): string {

    if (!f) return '-';

    return new Date(f).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

  }

}