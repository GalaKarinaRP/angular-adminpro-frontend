import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UsuarioService } from 'src/app/services/usuario.service';
import { FileUploadService } from 'src/app/services/file-upload.service';


import { Usuario } from 'src/app/models/usuario.model';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm:FormGroup;
  public usuario:Usuario;
  public imagenSubir:File;
  public imgTemp: string | ArrayBuffer;

  constructor( private fb:FormBuilder, 
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService) {

      this.usuario = usuarioService.usuario;

     }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre:[this.usuario.nombre, Validators.required],
      email: [this.usuario.email,[ Validators.required, Validators.email]]
    });
  }

  actualizarPerfil(){
    console.log(this.perfilForm.value);
    this.usuarioService.actualizarUsuario(this.perfilForm.value)
    .subscribe( () => {      
      const { nombre, email } = this.perfilForm.value;
      this.usuario.nombre = nombre;
      this.usuario.email = email;    
      
      Swal.fire('Guardado','Cambios guardados,','success');
    }, (err) => {
      Swal.fire('Error', err.error.msg , 'error');
      console.log(err.error.msg);
      
    });
  }

  cambiarImagen( file: File){  

   this.imagenSubir = file;

   if(!file){ 
     return this.imgTemp = null;
    }    

   const reader = new FileReader(); 
   
   reader.readAsDataURL(file); 

   reader.onloadend = () => {
     this.imgTemp = reader.result;
     console.log(reader.result);
   }
    
   
    
  }

  subirImagen(){
    this.fileUploadService.actualizarFoto(this.imagenSubir, 'usuarios',this.usuario.uid )
    .then( img  => {
      console.log(img);
      this.usuario.img = img;
      Swal.fire('Guardado','Imagen de usuario actualizada,','success');    
    }).catch( err => {
      Swal.fire('Guardado','No se pudo subir la imagen,','success');
      console.log(err);
      
    });
  }

}
