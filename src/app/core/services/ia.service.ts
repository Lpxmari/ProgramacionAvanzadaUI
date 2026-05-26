import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespuestaIA } from '../shared/models/solicitud.model';

@Injectable({ providedIn: 'root' })
export class IAService {
  private readonly API = 'https://proyectoavanzada-production.up.railway.app/api/ai';

  constructor(private http: HttpClient) {}

  resumir(
    idSolicitud: number
  ): Observable<RespuestaIA> {

    return this.http.get<RespuestaIA>(
      `${this.API}/${idSolicitud}/resumir`
    );

  }

}