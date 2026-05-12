import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponsableDTO } from './solicitud.service';

@Injectable({ providedIn: 'root' })
export class ResponsableService {
  private readonly API = 'http://localhost:8080/responsables';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ResponsableDTO[]> {
    return this.http.get<ResponsableDTO[]>(this.API);
  }
}