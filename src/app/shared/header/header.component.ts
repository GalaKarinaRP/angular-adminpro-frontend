import { Component } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  public usuario:Usuario;

  constructor( private usuarioService: UsuarioService,
               private router : Router ) {
    this.usuario = usuarioService.usuario;
   }

  logout() {
    this.usuarioService.logout();
  }

  buscar( termino: string ){

    if(termino.trim().length === 0){
      return;
    }
    this.router.navigateByUrl(`/dashboard/buscar/${termino}`);
    
  }


}
