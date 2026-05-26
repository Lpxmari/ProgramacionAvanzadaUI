import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  HistorialDTO
} from '../shared/models/solicitud.model';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  private apiUrl =
    'https://proyectoavanzada-production.up.railway.app/api/historiales';

  constructor(
    private http: HttpClient
  ) {}

  obtenerHistorialEstudiante(
    estudianteId: number,
    solicitudId: number
  ): Observable<HistorialDTO[]> {

    return this.http.get<HistorialDTO[]>(
      `${this.apiUrl}/estudiante/${estudianteId}/solicitud/${solicitudId}`
    );

  }

}