import { Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './contato.component.html',
  styleUrl: './contato.component.css'
})
export class ContatoComponent {
  private fb = inject(FormBuilder);

  contactForm = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', Validators.required],
    tipo: ['Elogio', Validators.required],
    mensagem: ['', [Validators.required, Validators.minLength(10)]],
    // --- CAMPOS DA LGPD ADICIONADOS AQUI ---
    termos: [false, Validators.requiredTrue], // 'false' é o valor inicial, 'requiredTrue' exige que seja marcado
    newsletter: [false] // Opcional
  });

  formSubmetido = false;

  onSubmit() {
    this.formSubmetido = true;

    if (this.contactForm.invalid) {
      // Opcional: focar no primeiro campo inválido para melhor acessibilidade
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
    // Restaura valores padrão após o reset
    this.contactForm.patchValue({ tipo: 'Elogio', termos: false, newsletter: false });
  }

  // Getters para facilitar o acesso no template
  get nome() { return this.contactForm.get('nome'); }
  get email() { return this.contactForm.get('email'); }
  get telefone() { return this.contactForm.get('telefone'); }
  get tipo() { return this.contactForm.get('tipo'); }
  get mensagem() { return this.contactForm.get('mensagem'); }
  // --- GETTER PARA O CHECKBOX DE TERMOS ---
  get termos() { return this.contactForm.get('termos'); }
}