import { Component } from '@angular/core';
import { CotizadorService } from '../../../core/services/cotizador.service';
import { CurrencyPipe } from '@angular/common';
import { ModalCotizadorComponent } from '../../modal-cotizador/modal-cotizador.component';

@Component({
  selector: 'app-svg-etapa-cinco',
  standalone: true,
  imports: [
    CurrencyPipe,
    ModalCotizadorComponent
  ],
  templateUrl: './svg-etapa-cinco.component.html',
  styleUrl: './svg-etapa-cinco.component.css'
})
export class SvgEtapaCincoComponent {
  public etapa : any;
  public arrayLotes: any;
  public lote: any;
  public precioContado: any;
  public isModalOpen = false;

  constructor(
    private _serContizador : CotizadorService
  ) { }

  ngOnInit() : void {
    this.cargaInicial();
  }

  cargaInicial() {
    this._serContizador.obtenerEtapasPorId(2)
    .subscribe({
      next: (response) => {
        this.etapa = response.data[0];
      }
    });
    this._serContizador.obtenerLotesPorEtapa(2)
    .subscribe({
      next: (response : any) => {
        this.arrayLotes = response.data;
        this.loadSvg(response.data);
      }
    });
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
            $(value).addClass('no-disponible');
            $(poligono).addClass('p-vendido');
            break;
        }
      }
    });
  }

  openModal(event : any) {
    let iLote= this.recuperarLoteClick(event);
    this.lote = this.arrayLotes.find((x: any) => iLote == x.iLote);
    if(this.lote && this.lote.iStatus == 1){
      this.isModalOpen = true;
      $(".details").hide();
    }
  }

  mostrarDetalle(event : any) {
    let iLote= this.recuperarLoteOver(event);
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
    $(".details").hide();
  }

  recuperarLoteClick(event : any) {
    let arrayString
    try {
      arrayString= (event.target.nextElementSibling.outerHTML).split('>');
    }catch(error) {
      arrayString= (event.target.outerHTML).split('>')
    }
    let lote="";
    arrayString.forEach((element:string) => {
      element = element.replaceAll("</text", "");
      parseInt(element) ? lote= element : null;
    });
    return lote;

  }

  recuperarLoteOver(event : any) {
    if(event.target.localName != "svg" && event.target.localName != "image") {
        let arrayString
        try {
          arrayString= (event.target.nextElementSibling.outerHTML).split('>');
        }catch(error) {
          arrayString= (event.target.outerHTML).split('>')
        }
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
