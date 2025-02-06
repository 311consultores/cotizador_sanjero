import { Component } from '@angular/core';

@Component({
  selector: 'app-svg-etapa-cinco',
  standalone: true,
  imports: [],
  templateUrl: './svg-etapa-cinco.component.html',
  styleUrl: './svg-etapa-cinco.component.css'
})
export class SvgEtapaCincoComponent {
  public arrayLotes: any;

  ngAfterViewInit() : void {
    this.arrayLotes = JSON.parse(localStorage.getItem('lotes_etapa')+"");
    console.log(this.arrayLotes);
    // this.loadSvg(this.arrayLotes);
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
}
