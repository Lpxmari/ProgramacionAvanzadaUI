import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export type EstadoSolicitud = 'REGISTRADA' | 'CLASIFICADA' | 'EN_ATENCION' | 'ATENDIDA' | 'CERRADA';
export type TipoSolicitud =
  | 'REGISTRO_ASIGNATURAS'
  | 'HOMOLOGACION'
  | 'CANCELACION_ASIGNATURAS'
  | 'SOLICITUD_CUPOS'
  | 'CONSULTA_ACADEMICA';
export type NivelSolicitud = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export interface EstudianteDTO {
  id: number;
  nombreCompleto: string;
  correo: string;
  programa: string;
}

export interface ResponsableDTO {
  id: number;
  nombreCompleto: string;
  cargo: string;
  activo: boolean;
}

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

@Injectable({ providedIn: 'root' })
export class SolicitudService {
  private readonly API = 'http://localhost:8080/api/solicitudes';

  constructor(private http: HttpClient) {}

  getAll(params?: {
    estado?: EstadoSolicitud;
    tipo?: TipoSolicitud;
    nivel?: NivelSolicitud;
    responsableId?: number;
  }): Observable<SolicitudDTO[]> {
    let httpParams = new HttpParams();
    if (params?.estado) httpParams = httpParams.set('estado', params.estado);
    if (params?.tipo) httpParams = httpParams.set('tipo', params.tipo);
    if (params?.nivel) httpParams = httpParams.set('nivel', params.nivel);
    if (params?.responsableId) httpParams = httpParams.set('responsableId', params.responsableId);
    return this.http.get<SolicitudDTO[]>(this.API, { params: httpParams });
  }

  getById(id: number): Observable<SolicitudDTO> {
    return this.http.get<SolicitudDTO>(`${this.API}/${id}`);
  }

  crear(dto: CrearSolicitudDTO): Observable<SolicitudDTO> {
    return this.http.post<SolicitudDTO>(this.API, dto);
  }

  priorizar(id: number, dto: PrioridadDTO): Observable<string> {
    return this.http.put(`${this.API}/${id}/priorizar`, dto, { responseType: 'text' });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  asignarResponsable(solicitudId: number, responsableId: number): Observable<string> {
    return this.http.put(
      `${this.API}/${solicitudId}/responsable?responsableId=${responsableId}`,
      {},
      { responseType: 'text' }
    );
  }

  filtrarSolicitudes(
    responsable?: string,
    nivel?: string,
    estado?: string,
    tipoSolicitud?: string
  ): Observable<SolicitudDTO[]> {

    let params: string[] = [];

    if (responsable) {
      params.push(`responsable=${encodeURIComponent(responsable)}`);
    }

    if (nivel) {
      params.push(`nivel=${nivel}`);
    }

    if (estado) {
      params.push(`estado=${estado}`);
    }

    if (tipoSolicitud) {
      params.push(`tipoSolicitud=${tipoSolicitud}`);
    }

    const query = params.length ? `?${params.join('&')}` : '';

    return this.http.get<SolicitudDTO[]>(
      `${this.API}/filtrar${query}`
    );
  }

  getHistorial(id: number): Observable<HistorialDTO[]> {
    return this.http.get<HistorialDTO[]>(`${this.API}/${id}/historial`);
  }

  cerrar(
    idSolicitud: number,
    dto: CierreDTO
  ): Observable<string> {

    return this.http.put(
      `${this.API}/${idSolicitud}/cerrar`,
      dto,
      { responseType: 'text' }
    );

  }

  atender(
    idSolicitud: number,
    observaciones?: string
  ): Observable<string> {

    let url = `${this.API}/${idSolicitud}/atender`;

    if (observaciones && observaciones.trim() !== '') {
      url += `?observaciones=${encodeURIComponent(observaciones)}`;
    }

    return this.http.put(
      url,
      {},
      { responseType: 'text' }
    );

  }

  listarPorResponsable(
    idResponsable: number
  ): Observable<SolicitudDTO[]> {

    return this.http.get<SolicitudDTO[]>(
      `${this.API}/responsable/${idResponsable}`
    );

  }

}