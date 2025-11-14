import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage, HeaderComponent, FooterComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  private fb = inject(FormBuilder);

  // Signal para controle de estado do formulário
  formSubmetido = signal(false);

  // Formulário reativo com validações
  contactForm = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required, this.telefoneValidator]],
    tipo: ['Elogio', Validators.required],
    mensagem: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    termos: [false, Validators.requiredTrue],
    newsletter: [false]
  });

  // Computed property para verificar se o formulário pode ser enviado
  podeEnviar = computed(() => {
    return this.contactForm.valid;
  });

  // Validador customizado para telefone
  private telefoneValidator(control: AbstractControl) {
    const value = control.value;
    if (!value) return null;
    
    // Remove caracteres não numéricos
    const apenasNumeros = value.replace(/\D/g, '');
    
    // Verifica se tem entre 10 e 11 dígitos (com DDD)
    if (apenasNumeros.length >= 10 && apenasNumeros.length <= 11) {
      return null;
    }
    
    return { telefoneInvalido: true };
  }

  onSubmit(): void {
    this.formSubmetido.set(true);

    // Marca todos os campos como touched para mostrar erros
    this.marcarCamposComoTouched();

    if (this.contactForm.invalid) {
      this.focarPrimeiroCampoInvalido();
      return;
    }

    // Processa o envio do formulário
    this.processarEnvio();
  }

  private marcarCamposComoTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }

  private focarPrimeiroCampoInvalido(): void {
    const primeiroCampoInvalido = document.querySelector(
      'input.ng-invalid, select.ng-invalid, textarea.ng-invalid'
    ) as HTMLElement;
    
    if (primeiroCampoInvalido) {
      primeiroCampoInvalido.focus();
    }
  }

  private processarEnvio(): void {
    const formData = this.contactForm.value;
    const nomeUsuario = formData.nome?.split(' ')[0] || 'Cliente';
    
    // Simula envio para o servidor
    console.log('Dados do formulário:', formData);
    
    // Feedback para o usuário
    alert(`Obrigado, ${nomeUsuario}! Sua mensagem foi enviada com sucesso.`);
    
    // Reseta o formulário
    this.resetarFormulario();
  }

  private resetarFormulario(): void {
    this.contactForm.reset({
      tipo: 'Elogio',
      termos: false,
      newsletter: false
    });
    this.formSubmetido.set(false);

    // Remove o estado touched de todos os controles
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsUntouched();
    });
  }

  // Getters para os controles do formulário (para uso no template)
  get nome() { return this.contactForm.get('nome'); }
  get email() { return this.contactForm.get('email'); }
  get telefone() { return this.contactForm.get('telefone'); }
  get tipo() { return this.contactForm.get('tipo'); }
  get mensagem() { return this.contactForm.get('mensagem'); }
  get termos() { return this.contactForm.get('termos'); }
  get newsletter() { return this.contactForm.get('newsletter'); }
}