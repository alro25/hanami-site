import { Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage, HeaderComponent, FooterComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  private fb = inject(FormBuilder);

  contactForm = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', Validators.required],
    tipo: ['Elogio', Validators.required],
    mensagem: ['', [Validators.required, Validators.minLength(10)]],
    termos: [false, Validators.requiredTrue],
    newsletter: [false]
  });

  formSubmetido = false;

  onSubmit() {
    this.formSubmetido = true;

    if (this.contactForm.invalid) {
      const primeiroCampoInvalido = document.querySelector('input.ng-invalid, select.ng-invalid, textarea.ng-invalid');
      if (primeiroCampoInvalido) {
        (primeiroCampoInvalido as HTMLElement).focus();
      }
      return;
    }

    console.log('Dados do formulário (LGPD Compliant):', this.contactForm.value);

    const nomeUsuario = this.contactForm.value.nome;
    alert(`Obrigado, ${nomeUsuario}! Sua mensagem foi enviada com sucesso.`);
    
    this.contactForm.reset();
    this.formSubmetido = false;
    this.contactForm.patchValue({ tipo: 'Elogio', termos: false, newsletter: false });
  }

  get nome() { return this.contactForm.get('nome'); }
  get email() { return this.contactForm.get('email'); }
  get telefone() { return this.contactForm.get('telefone'); }
  get tipo() { return this.contactForm.get('tipo'); }
  get mensagem() { return this.contactForm.get('mensagem'); }
  get termos() { return this.contactForm.get('termos'); }
}