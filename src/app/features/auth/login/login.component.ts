import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 loginForm: FormGroup;
 mensajeError: string = '';

 constructor(private fb:FormBuilder,
  private authService: AuthService,
  private router: Router
 ) {
  this.loginForm = this.fb.group({
    email: ['',[Validators.required, Validators.email]],
    password: ['',[Validators.required]]
  });
 }

login(): void {

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.authService.login(this.loginForm.value).subscribe({
    next: (response) => {

      this.authService.guardarSesion(response);
      this.router.navigate(['/incidencias']);
    },
    error: (error) => {

      this.mensajeError = 'Email o contraseña incorrectos';
    }
  });
}

}
