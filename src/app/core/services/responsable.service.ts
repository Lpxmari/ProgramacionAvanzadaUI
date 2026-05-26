import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponsableDTO } from '../shared/models/usuario.model';

@Injectable({ providedIn: 'root' })
export class ResponsableService {
  private readonly API = 'https://proyectoavanzada-production.up.railway.app/api/responsables';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ResponsableDTO[]> {
    return this.http.get<ResponsableDTO[]>(this.API);
  }

  atenderSolicitud(
  solicitudId: number,
  observaciones: string
) {

  return this.http.put(
  `https://proyectoavanzada-production.up.railway.app/api/solicitudes/${solicitudId}/atender`,
  {}, // body
  {
    responseType: 'text',
    params: {
      observaciones
    }
  }
);

}
}