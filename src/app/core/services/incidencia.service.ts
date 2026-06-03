import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Incidencia } from '../../models/incidencia.model';
import { IncidenciaRequest } from '../../models/incidencia-request.model';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {

  private readonly apiUrl = 'http://localhost:8082/api/incidencias';

  constructor(
    private http: HttpClient,

  ) { }

  listarIncidencias(): Observable<Incidencia[]> {

    return this.http.get<Incidencia[]>(this.apiUrl);
  }
  crearIncidencia(request: IncidenciaRequest): Observable<Incidencia> {
    return this.http.post<Incidencia>(this.apiUrl, request);
  }
}
