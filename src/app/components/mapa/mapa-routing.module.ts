import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapaComponent } from './mapa.component';
import { SvgComponent } from './svg/svg.component';
import { SvgEtapaCincoComponent } from './svg-etapa-cinco/svg-etapa-cinco.component';

const routes: Routes = [
  {
    path: '',
    component: MapaComponent,
    children: [
      {
        path: '',
        component: SvgEtapaCincoComponent, // ✅ Carga cuando la ruta es ''
        pathMatch: 'full'
      },
      {
        path: 'etapa-5',
        component: SvgEtapaCincoComponent // ✅ También carga cuando la ruta es 'etapa-5'
      },
      {
        path: 'etapa-6',
        component: SvgComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapaRoutingModule { }
