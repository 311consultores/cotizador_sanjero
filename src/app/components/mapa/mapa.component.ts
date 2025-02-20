import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { CotizadorService } from '../../core/services/cotizador.service';
import { NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgIf,
    CurrencyPipe
  ],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent {

  activePath: string = '';
  arrayEtapas: any;

  constructor(
    private _servCotizador: CotizadorService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.activePath = this.router.url === '/' ? '/etapa-5' : this.router.url;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activePath = event.url === '/' ? '/etapa-5' : event.url;
      }
    });
    this.cargaInicial();
  }

   cargaInicial() {
    this._servCotizador.obtenerEtapas()
    .subscribe((resp: any) => {
      if(resp.ok){
        this.arrayEtapas = resp.data;
      }
    });
  }  
}
