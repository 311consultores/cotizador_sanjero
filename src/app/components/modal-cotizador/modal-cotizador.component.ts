import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CotizadorService } from '../../core/services/cotizador.service';
import { Lote } from '../../core/models/lote.model';
import { Cotizacion } from '../../core/models/cotizacion.model';
import Swal from 'sweetalert2';
import { CurrencyPipe, NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-modal-cotizador',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CurrencyPipe,
    NgClass,
    NgIf,
  ],
  templateUrl: './modal-cotizador.component.html',
  styleUrl: './modal-cotizador.component.css'
})
export class ModalCotizadorComponent implements OnChanges {

  @Input() lote = new Lote();
  @Input() etapa: any;
  @Input() isModalOpen = false;
  @Output() closeModalEvent = new EventEmitter<boolean>;
  cotizacion= new Cotizacion();
  public form!: FormGroup;
  modal: any;
  iMinEnganche = 0;
  plazoSeleccionado : any;
  precioEnganche=0;
  precioMensualidad=0;
  precioM2=0;
  precioTotal= 0;
  bCotizacion=false;
  submitted = false;
  arrayEtapas: any;
  arrayLotes: any;
  buttonEnv= {
    texto: 'Enviar',
    load: false,
    disabled: false
  };
  @ViewChild('cotizadorModal') _modal: any;

  constructor(
    private modalService: NgbModal, 
    private _formBuilder: FormBuilder,
    private _servCotizador: CotizadorService
  ) {
    this.form = this._formBuilder.group({
      sNombre: ['', [Validators.required]],
      sCorreo: ['', [Validators.required, Validators.email]],
      iTelefono: ['',[Validators.required, Validators.pattern("^[0-9]*$")]],
      sCiudad: ['', [Validators.required]]
    });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isModalOpen']) {
      if (this.isModalOpen) {
        this.abrirModal(); // Iniciar la cámara si el modal se abre
      }
    }
  }

  obtenerPlazosPorEtapa(iIdEtapa : number) {
    this._servCotizador.obtenerPlazosPorEtapa(iIdEtapa)
    .subscribe((resp : any) => {
      if(resp.ok) {
        this.lote.objPlazos = resp.data;
      }
    })
  }

  registrarCotizacion() {
    this.submitted = true;
    // Validar formulario
    if (this.form.invalid) {
      return;
    }
    this.buttonEnv= {
      load: true,
      disabled: true,
      texto: "Enviando..."
    };
    this.cotizacion = this.form.value;
    this.cotizacion.iIdLote = parseInt(this.lote.iIdLote+"");
    this.cotizacion.iIdPlazo=0;
    this.cotizacion.iEnganche=100;
    if(this.plazoSeleccionado != undefined) {
      this.cotizacion.iIdPlazo= this.plazoSeleccionado.iIdPlazo;
      this.cotizacion.iEnganche= this.iMinEnganche;
    }
    this._servCotizador.guardarCotizacion(this.cotizacion)
    .subscribe((resp: any) => {
      if(resp.ok) {
        Swal.fire({
          icon: "success",
          title: resp.data,
          showConfirmButton: false,
          timer: 3500
        });
        this.form.reset();
        this.submitted=false;
        this.buttonEnv= {
          texto: 'Enviar',
          load: false,
          disabled: false
        };
      }else {
        this.buttonEnv= {
          texto: 'Enviar',
          load: false,
          disabled: false
        };
        Swal.fire({
          icon: "error",
          title: resp.data,
          showConfirmButton: false,
          timer: 3500
        });
      }      
    });
  }

  seleccionarPlazo(iIdPlazo : any) {
      if(iIdPlazo != "-1") {
        this.plazoSeleccionado = this.lote.objPlazos.find((x : any) => x.iIdPlazo == iIdPlazo);
        this.calcularCotizacion(this.plazoSeleccionado);
        this.calcularMensualidad();
        this.bCotizacion=true;
        return;
      }
      this.precioM2 = this.lote.iPrecioM2Contado;
      this.precioTotal = this.lote.iSuperficie * this.lote.iPrecioM2Contado;
      this.bCotizacion=false;
  }

  calcularCotizacion(plazo : any) {
    let precioM2Interes = this.lote.iPrecioM2Contado + (this.lote.iPrecioM2Contado * (plazo.iInteres / 100));
    this.precioM2 = precioM2Interes;
    this.precioTotal= this.lote.iSuperficie * precioM2Interes;
  }

  calcularMensualidad() {
    if(this.iMinEnganche < 20) {
      this.iMinEnganche = this.etapa.iMinEnganche;
      this.calcularMensualidad();
      return;
    }
    this.iMinEnganche = Math.floor(this.iMinEnganche);
    this.precioEnganche = this.precioTotal * (this.iMinEnganche/100);
    this.precioMensualidad = (this.precioTotal - this.precioEnganche) / this.plazoSeleccionado.iNoPlazo;
  }

  abrirModal() { 
    this.precioM2 = this.lote.iPrecioM2Contado;
    this.precioTotal = this.lote.iSuperficie * this.lote.iPrecioM2Contado;
    this.obtenerPlazosPorEtapa(this.etapa.iIdEtapa);
    this.openModal();    
  }

  openModal() {
    this.modal = this.modalService.open(this._modal, {centered: true, backdrop: false, fullscreen: true });
  }

  closeModal() {
    this.closeModalEvent.emit(false);
    this.modal.close();
  }

  validarEntero(event: KeyboardEvent) {
    if (event.key === '.' || event.key === ',') {
      event.preventDefault();
    }
  }

  get f() {
    return this.form.controls;
  }
  
}
