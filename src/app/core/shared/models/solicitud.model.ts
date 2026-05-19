import { EstudianteDTO, ResponsableDTO } from "./usuario.model";

export type EstadoSolicitud = 'REGISTRADA' | 'CLASIFICADA' | 'EN_ATENCION' | 'ATENDIDA' | 'CERRADA';
export type TipoSolicitud =
  | 'REGISTRO_ASIGNATURAS'
  | 'HOMOLOGACION'
  | 'CANCELACION_ASIGNATURAS'
  | 'SOLICITUD_CUPOS'
  | 'CONSULTA_ACADEMICA';
export type NivelSolicitud = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export interface PrioridadDTO {
  nivel: NivelSolicitud;
  impactoAcademico: string;
  justificacion: string;
  vigencia: string;
}

export interface SolicitudDTO {
  id: number;
  descripcion: string;
  fechaHoraRegistro: string;
  fechaCierre: string | null;
  estado: EstadoSolicitud;
  tipoSolicitud: TipoSolicitud;
  estudiante: EstudianteDTO;
  responsableAsignado: ResponsableDTO | null;
  prioridad: PrioridadDTO | null;
}

export interface CrearSolicitudDTO {
  descripcion: string;
  tipoSolicitud: TipoSolicitud;
  canalOrigen: string;
  estudianteId: number;
}

export interface CierreDTO {
  responsableId: number;
  observacion: string;
  fecha: string;
}

export interface HistorialDTO {
  idHistorial: number;
  fechaHora: string;
  estadoAnterior: EstadoSolicitud;
  estadoNuevo: EstadoSolicitud;
  observaciones: string;
  responsableAccion: ResponsableDTO;
}

export interface RespuestaIA {
  token: string;
}