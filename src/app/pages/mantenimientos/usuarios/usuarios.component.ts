import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';



@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit {

  public totalUsuarios: number = 0;
  public usuarios:Usuario []=[];
  public usuariosTemp:Usuario []=[];

  public desde: number = 0;
  public cargando:boolean = true;

  constructor(private usuarioService:UsuarioService,
              private busquedaService:BusquedasService,
              private modalImagenService: ModalImagenService) { }

  ngOnInit(): void {

    this.cargarUsuarios();
   
  }

  cargarUsuarios(){
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
    .subscribe( ({ total, usuarios}) => {
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
      
    });
  }

  cambiarPagina( valor: number){
     this.desde += valor; // se le va a suma 1

     if(this.desde < 0){
        this.desde = 0;
     }else if(this.desde >= this.totalUsuarios){
      this.desde -= valor; 
     }

     this.cargarUsuarios();
  }


  buscar( termino: string){

    if(termino.length === 0)
    {
      return this.usuarios = this.usuariosTemp;     
    }
    this.busquedaService.buscar('usuarios', termino)
        .subscribe( resp => {         
          this.usuarios = resp
        });

  }


  eliminarUsuario( usuario:Usuario ){

    if(usuario.uid === this.usuarioService.uid ){
      return  Swal.fire(
        'Error!',
        `No puede borrarse a si mismo`,
        'error'
    );;
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Estas a punto de borrar al usuario: ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,    
      confirmButtonText: 'Si, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
       this.usuarioService.eliminarUsuario(usuario)
          .subscribe( resp => {
            this.cargarUsuarios();
            Swal.fire(
              'Eliminado!',
              `${usuario.nombre} fue eliminado correctamente.`,
              'success'
          );
          
            });         
        
        }
    })
  }


  cambiarRole(usuario:Usuario){
   this.usuarioService.modificarUsuario(usuario)
       .subscribe( resp => 
        console.log(resp));

  }

  abrirModal( usuario:Usuario){


  }

}
