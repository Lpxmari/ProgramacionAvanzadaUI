import { Component, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import {
  SolicitudDTO,
  EstadoSolicitud,
  TipoSolicitud,
  NivelSolicitud,
  CrearSolicitudDTO
} from '../../core/shared/models/solicitud.model';

import { SolicitudService } from '../../core/services/solicitud.service';
import { IAService } from '../../core/services/ia.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-estudiante',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './estudiante.html'
})
export class EstudianteComponent implements OnInit {

  solicitudes = signal<SolicitudDTO[]>([]);
  loading = signal(false);
  error = signal('');

  modalNueva = signal(false);
  modalDetalle = signal(false);

  solicitudSeleccionada = signal<SolicitudDTO | null>(null);

  resumenIA = signal('');
  loadingIA = signal(false);

  readonly tipos: TipoSolicitud[] = [
    'REGISTRO_ASIGNATURAS',
    'HOMOLOGACION',
    'CANCELACION_ASIGNATURAS',
    'SOLICITUD_CUPOS',
    'CONSULTA_ACADEMICA'
  ];

  readonly canales = [
    'CSU',
    'Correo',
    'SAC',
    'Telefónico',
    'Presencial'
  ];

  formNueva = new FormGroup({

    descripcion: new FormControl(
      '',
      Validators.required
    ),

    tipoSolicitud: new FormControl<TipoSolicitud | ''>(
      '',
      Validators.required
    ),

    canalOrigen: new FormControl(
      '',
      Validators.required
    )

  });

  constructor(
    private solicitudService: SolicitudService,
    private iaService: IAService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {

    const estudianteId =
      this.authService.getPayload()?.id;

    if (!estudianteId) {
      this.error.set(
        'No se encontró el estudiante.'
      );
      return;
    }

    this.loading.set(true);

    this.solicitudService
      .listarPorEstudiante(estudianteId)
      .subscribe({

        next: (data: SolicitudDTO[]) => {

          this.solicitudes.set(data);

          this.loading.set(false);

        },

        error: () => {

          this.error.set(
            'Error al cargar solicitudes.'
          );

          this.loading.set(false);

        }

      });

  }

  abrirNueva() {

    this.formNueva.reset();

    this.modalNueva.set(true);

  }

  guardarSolicitud() {

    if (this.formNueva.invalid) return;

    const estudianteId =
      this.authService.getPayload()?.id;

    const dto: CrearSolicitudDTO = {

      descripcion:
        this.formNueva.value.descripcion!,

      tipoSolicitud:
      this.formNueva.value.tipoSolicitud as TipoSolicitud,

      canalOrigen:
        this.formNueva.value.canalOrigen!,

      estudianteId

    };

    this.solicitudService
      .crear(dto)
      .subscribe({

        next: () => {

          this.modalNueva.set(false);

          this.cargarSolicitudes();

        },

        error: () => {

          this.error.set(
            'Error al crear solicitud.'
          );

        }

      });

  }

  verDetalle(s: SolicitudDTO) {

    this.solicitudSeleccionada.set(s);

    this.modalDetalle.set(true);

    this.loadingIA.set(true);

    this.resumenIA.set('');

    this.iaService
      .resumir(s.id)
      .subscribe({

        next: (res) => {

          this.resumenIA.set(res.token);

          this.loadingIA.set(false);

        },

        error: () => {

          this.resumenIA.set(
            'No fue posible generar el resumen.'
          );

          this.loadingIA.set(false);

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

    return map[estado];

  }

  nivelClase(nivel?: NivelSolicitud): string {

    if (!nivel) {
      return 'bg-gray-100 text-gray-400';
    }

    const map: Record<NivelSolicitud, string> = {

      BAJA:
        'bg-green-100 text-green-700',

      MEDIA:
        'bg-yellow-100 text-yellow-700',

      ALTA:
        'bg-orange-100 text-orange-700',

      CRITICA:
        'bg-red-100 text-red-700'

    };

    return map[nivel];

  }

  labelTipo(tipo: TipoSolicitud): string {

    const map: Record<TipoSolicitud, string> = {

      REGISTRO_ASIGNATURAS:
        'Registro asignaturas',

      HOMOLOGACION:
        'Homologación',

      CANCELACION_ASIGNATURAS:
        'Cancelación asignaturas',

      SOLICITUD_CUPOS:
        'Solicitud cupos',

      CONSULTA_ACADEMICA:
        'Consulta académica'

    };

    return map[tipo] ?? tipo;

  }

  formatFecha(f: string): string {

    if (!f) return '-';

    return new Date(f)
      .toLocaleDateString('es-CO', {

        day: '2-digit',
        month: 'short',
        year: 'numeric'

      });

  }

}