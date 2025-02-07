import { Component, EventEmitter, Output } from '@angular/core';
import $ from 'jquery';
import { CotizadorService } from '../../../core/services/cotizador.service';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-svg',
  standalone: true,
  imports: [
    CurrencyPipe
  ],
  templateUrl: './svg.component.html',
  styleUrl: './svg.component.css'
})
export class SvgComponent {
  public arrayLotes: any;
  lote : any;
  precioContado: any;

  constructor(
    private _serContizador : CotizadorService
  ) { }

  ngAfterViewInit() : void {
    this.arrayLotes = JSON.parse(localStorage.getItem('lotes_etapa')+"");
    this.loadSvg(this.arrayLotes);
  }

  loadSvg(lotes : any) {
    let nodos = $("#Capa_1").find("text");
    nodos.each((index : number, value : any) => {
      let poligono = $(value).prev();
      let objLote =lotes.find((x : any) => x.iLote == $(value).html());

      if(objLote) {
        switch(objLote.iStatus) {
          //Disponible
          case 1: 
            $(value).addClass('disponible');
            $(poligono).addClass('p-disponible');
            $(poligono).addClass('lote-'+objLote.iLote);
            break;
          case 2:
            $(value).addClass('no-disponible');
            $(poligono).addClass('p-apartado');
            break;
          case 3: 
            $(value).addClass('mo-disponible');
            $(poligono).addClass('p-vendido');
            break;
        }
      }
    });
  }

  openModal(event : any) {
    let iLote= this.recuerarLote(event);
    this._serContizador.$openModal.next(iLote);
  }

  mostrarDetalle(event : any) {  
    let iLote= this.recuerarLote(event);
    if(iLote != null && iLote != undefined) {
      this.lote = this.arrayLotes.find((x: any) => iLote == x.iLote);
      if(this.lote && this.lote.iStatus == 1){
        $(".details").css({
          'top': $(".lote-"+this.lote.iLote).position().top-75,
          'left': $(".lote-"+this.lote.iLote).position().left
        });
        this.precioContado = this.lote.iPrecioM2Contado * this.lote.iSuperficie;
        $(".details").show();
      }else{
        $(".details").hide();
      }
    }else {
      $(".details").hide();
    }    
  }

  esconderDetalle(event : any){
    let iLote= this.recuerarLote(event);
    if(iLote != null && iLote != undefined){
      this.lote = this.arrayLotes.find((x: any) => iLote == x.iLote);
      if(this.lote && this.lote.iStatus != 1){
        $(".details").hide();
      }
    }else{
      $(".details").hide();
    }
  }

  recuerarLote(event : any) {
    if(event && event.target.localName != "image" && event.target.nextSibling != null) { 
      let arrayString= (event.target.nextSibling.outerHTML).split('>');
      let lote="";
      arrayString.forEach((element:string) => {
        element = element.replaceAll("</text", "");
        parseInt(element) ? lote= element : null;
      });
      return lote;
    }
    return null;
  }
}
