import { Component, OnInit, signal, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SolicitudService } from '../../core/services/solicitud.service';
import {
  SolicitudDTO,
  EstadoSolicitud,
  TipoSolicitud,
  NivelSolicitud,
  CrearSolicitudDTO,
  CierreDTO,
  PrioridadDTO
} from '../../core/shared/models/solicitud.model';
import { ResponsableService } from '../../core/services/responsable.service';
import { ResponsableDTO } from '../../core/shared/models/usuario.model';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './solicitudes.html'
})
export class SolicitudesComponent implements OnInit {

  solicitudes = signal<SolicitudDTO[]>([]);
  responsables = signal<ResponsableDTO[]>([]);
  loading = signal(false);
  error = signal('');

  // Filtros
  filtros = new FormGroup({
    responsableId: new FormControl<number | null>(null),
    prioridad: new FormControl<NivelSolicitud | ''>(''),
    estado: new FormControl<EstadoSolicitud | ''>(''),
    tipo: new FormControl<TipoSolicitud | ''>('')
  });

  // Modales
  modalNueva = signal(false);
  modalAsignar = signal(false);
  modalCierre = signal(false);
  modalDetalle = signal(false);
  modalTriage = signal(false);

  solicitudSeleccionada = signal<SolicitudDTO | null>(null);
  modoEdicion = signal(false);

  // Form triage / priorizar
  formTriage = new FormGroup({
    nivel: new FormControl<NivelSolicitud | ''>('', Validators.required),
    impactoAcademico: new FormControl('', Validators.required),
    justificacion: new FormControl('', Validators.required),
    vigencia: new FormControl('', Validators.required)
  });

  // Form nueva solicitud
  formNueva = new FormGroup({
    descripcion: new FormControl('', Validators.required),
    tipoSolicitud: new FormControl<TipoSolicitud | ''>('', Validators.required),
    canalOrigen: new FormControl('', Validators.required),
    estudianteId: new FormControl<number | null>(null, Validators.required)
  });

  // Form asignar responsable
  formAsignar = new FormGroup({
    solicitudId: new FormControl<number | null>(null, Validators.required),
    responsableId: new FormControl<number | null>(null, Validators.required)
  });

  // Form cierre
  formCierre = new FormGroup({
    responsableId: new FormControl<number | null>(null, Validators.required),
    observacion: new FormControl('', Validators.required)
  });

  readonly estados: EstadoSolicitud[] = ['REGISTRADA', 'CLASIFICADA', 'EN_ATENCION', 'ATENDIDA', 'CERRADA'];
  readonly tipos: TipoSolicitud[] = [
    'REGISTRO_ASIGNATURAS', 'HOMOLOGACION', 'CANCELACION_ASIGNATURAS',
    'SOLICITUD_CUPOS', 'CONSULTA_ACADEMICA'
  ];
  readonly niveles: NivelSolicitud[] = ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'];
  readonly canales = ['CSU', 'Correo', 'SAC', 'Telefónico', 'Presencial'];

  constructor(
    private solicitudService: SolicitudService,
    private responsableService: ResponsableService
  ) {}

  ngOnInit() {
    this.cargarSolicitudes();
    this.cargarResponsables();
  }

 cargarSolicitudes() {
  this.loading.set(true);
  this.solicitudService.getAll().subscribe({
    next: data => { this.solicitudes.set(data); this.loading.set(false); },
    error: () => { this.error.set('Error al cargar solicitudes.'); this.loading.set(false); }
  });
}

  cargarResponsables() {
    this.responsableService.getAll().subscribe({
      next: data => this.responsables.set(data)
    });
  }

  buscar() {

    this.loading.set(true);
    this.error.set('');

    const filtros = this.filtros.value;

    const responsableSeleccionado = this.responsables()
      .find(r => r.id === filtros.responsableId);

    const responsable = responsableSeleccionado?.nombreCompleto;

    this.solicitudService.filtrarSolicitudes(
      responsable || undefined,
      filtros.prioridad || undefined,
      filtros.estado || undefined,
      filtros.tipo || undefined
    ).subscribe({

      next: (data) => {
        this.solicitudes.set(data);
        this.loading.set(false);
      },

      error: (err) => {
        console.error(err);

        this.error.set('Error al filtrar solicitudes.');

        this.loading.set(false);
      }

    });
  }

  limpiar() {
    this.filtros.reset();
    this.cargarSolicitudes();
  }

  // CRUD
  abrirNueva() {
    this.modoEdicion.set(false);
    this.formNueva.reset();
    this.solicitudSeleccionada.set(null);
    this.modalNueva.set(true);
  }

  abrirEditar(s: SolicitudDTO) {
    this.modoEdicion.set(true);
    this.solicitudSeleccionada.set(s);
    this.formNueva.patchValue({
      descripcion: s.descripcion,
      tipoSolicitud: s.tipoSolicitud,
      canalOrigen: '',
      estudianteId: s.estudiante?.id ?? null
    });
    this.modalNueva.set(true);
  }

  abrirTriage(s: SolicitudDTO) {
    this.solicitudSeleccionada.set(s);
    this.formTriage.reset();
    if (s.prioridad) {
      this.formTriage.patchValue({
        nivel: s.prioridad.nivel,
        impactoAcademico: s.prioridad.impactoAcademico,
        justificacion: s.prioridad.justificacion,
        vigencia: s.prioridad.vigencia ?? ''
      });
    }
    this.modalTriage.set(true);
  }

  guardarSolicitud() {
    if (this.formNueva.invalid) return;
    const val = this.formNueva.value as CrearSolicitudDTO;

    if ( !( this.modoEdicion() && this.solicitudSeleccionada() )) {
      this.solicitudService.crear(val).subscribe({
        next: () => { this.modalNueva.set(false); this.cargarSolicitudes(); },
        error: () => this.error.set('Error al crear solicitud.')
      });
    }
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar esta solicitud?')) return;
    this.solicitudService.eliminar(id).subscribe({
      next: () => this.cargarSolicitudes(),
      error: () => this.error.set('Error al eliminar.')
    });
  }

  // Asignar responsable
  abrirAsignar(s?: SolicitudDTO) {
    this.formAsignar.reset();
    if (s) this.formAsignar.patchValue({ solicitudId: s.id });
    this.modalAsignar.set(true);
  }

  guardarAsignacion() {
    if (this.formAsignar.invalid) return;
    const { solicitudId, responsableId } = this.formAsignar.value;
    this.solicitudService.asignarResponsable(solicitudId!, responsableId!).subscribe({
      next: () => { this.modalAsignar.set(false); this.cargarSolicitudes(); },
      error: () => this.error.set('Error al asignar responsable.')
    });
  }

  // Cierre
  abrirCierre(s: SolicitudDTO) {
    this.solicitudSeleccionada.set(s);
    this.formCierre.reset();
    this.modalCierre.set(true);
  }

  guardarCierre() {
    if (this.formCierre.invalid || !this.solicitudSeleccionada()) return;
    const dto: CierreDTO = {
      responsableId: this.formCierre.value.responsableId!,
      observacion: this.formCierre.value.observacion!,
      fecha: new Date().toISOString()
    };
    this.solicitudService.cerrar(this.solicitudSeleccionada()!.id, dto).subscribe({
      next: () => { this.modalCierre.set(false); this.cargarSolicitudes(); },
      error: () => this.error.set('Error al cerrar solicitud.')
    });
  }

  guardarTriage() {
    if (this.formTriage.invalid || !this.solicitudSeleccionada()) return;
    const dto: PrioridadDTO = {
      nivel: this.formTriage.value.nivel as NivelSolicitud,
      impactoAcademico: this.formTriage.value.impactoAcademico!,
      justificacion: this.formTriage.value.justificacion!,
      vigencia: this.formTriage.value.vigencia!
    };
    this.solicitudService.priorizar(this.solicitudSeleccionada()!.id, dto).subscribe({
      next: () => { this.modalTriage.set(false); this.cargarSolicitudes(); },
      error: (e) => {
        console.log(e);
        this.error.set('Error al asignar prioridad.')
      }
    });
  }

  // Ver detalle
  verDetalle(s: SolicitudDTO) {
    this.solicitudSeleccionada.set(s);
    this.modalDetalle.set(true);
  }

  // Helpers UI
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
    if (!nivel) return 'bg-gray-100 text-gray-400';
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
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }
}