import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Medico } from 'src/app/models/medico.model';

import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit , OnDestroy{

  public medicos: Medico[] = [];
  public cargando:boolean = true;
  private imgSubs: Subscription;

  constructor(private medicosService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService) { }

  ngOnDestroy(): void {
   this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(delay(10))
    .subscribe(
      img => this.cargarMedicos()
    );
  }



  cargarMedicos(){
    this.cargando = true;
    this.medicosService.cargarMedicos()
        .subscribe( resp => {    
          
          this.cargando = false;
          this.medicos = resp;
        });
      
  }  

  buscar( termino: string){

    if(termino.length === 0)
    {
      return this.cargarMedicos();   
    }

    this.busquedaService.buscar('medicos', termino)
        .subscribe( resp => {         
          this.medicos = resp
        });

  }

  abrirModal(medico: Medico){
      this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
    }

  eliminarMedico(medico : Medico){
     Swal.fire({
       title:'¿Borrar médico?',
       text: `Estas a punto de borrar a ${medico.nombre}.`,
       icon:'question',
       showCancelButton:true,
       confirmButtonText:'Sí, borrarlo'
     }).then((result) => {
       if(result.value){
        this.medicosService.eliminarMedico(medico._id)
        .subscribe( resp => {
          this.cargarMedicos();
          Swal.fire(
            'Médico borrado',
            `${medico.nombre } fue eliminado correctamente`,
            'success'
          );
        });
       }
        
     });
    }

}
