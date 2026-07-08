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

  // Cambio funcional: endpoint para que USER vea solo sus propias incidencias.
  listarMisIncidencias(): Observable<Incidencia[]> {
    return this.http.get<Incidencia[]>(`${this.apiUrl}/mis`);
  }

  crearIncidencia(request: IncidenciaRequest): Observable<Incidencia> {
    return this.http.post<Incidencia>(this.apiUrl, request);
  }

  obtenerIncidenciaPorId(id: number): Observable<Incidencia> {
    return this.http.get<Incidencia>(`${this.apiUrl}/${id}`);
  }

  // Cambio funcional: endpoint para que USER abra solo el detalle de una incidencia propia.
  obtenerMiIncidenciaPorId(id: number): Observable<Incidencia> {
    return this.http.get<Incidencia>(`${this.apiUrl}/mis/${id}`);
  }
}
