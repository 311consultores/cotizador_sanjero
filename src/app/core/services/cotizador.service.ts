import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CotizadorService {


  constructor(private http: HttpClient) {   }

  public SERVER_API = environment.API_URL;
  public iIdProyecto= environment.iIdProyecto;
  public $arrayLotes = new BehaviorSubject<any>(null);
  public $openModal = new BehaviorSubject<any>(null);

  obtenerEtapas(){
    let url = this.SERVER_API+"getEtapas/"+this.iIdProyecto;
    return this.http.get( url )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        return throwError(err);
      }));
  }

  obtenerEtapasPorId(iIdEtapa : any){
    let json = {
      iIdProyecto : this.iIdProyecto,
      iIdEtapa : iIdEtapa
    };
    let url = this.SERVER_API+"getEtapasById";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        return throwError(err);
      }));
  }

  obtenerLotesPorEtapa(iIdEtapa : number) {
    let url = this.SERVER_API+"cotizador/obtenerLotesEtapa/"+iIdEtapa;
    return this.http.get( url )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        return throwError(err);
      }));
  }

  obtenerPlazosPorLote(iIdLote : number) {
    let url = this.SERVER_API+"cotizador/obtenerPlazosPorLote/"+iIdLote;
    return this.http.get( url )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        return throwError(err);
      }));
  }

  obtenerPlazosPorEtapa(iIdEtapa : number) {
    let url = this.SERVER_API+"cotizador/obtenerPlazosPorEtapa/"+iIdEtapa;
    return this.http.get( url )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        return throwError(err);
      }));
  }

  guardarCotizacion(json : any){
    let url = this.SERVER_API+"cotizador/guardarCotizacion";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        return throwError(err);
      }));
  }

}