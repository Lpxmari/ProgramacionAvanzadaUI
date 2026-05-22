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
    'http://localhost:8080/api/historiales';

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