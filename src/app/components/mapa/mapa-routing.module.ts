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
          path: 'etapa-6',
          component: SvgComponent
        },
        {
          path: 'etapa-5',
          component: SvgEtapaCincoComponent
        }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapaRoutingModule { }
