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

  // Criamos o nosso formulário reativo
  contactForm = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', Validators.required],
    tipo: ['Elogio', Validators.required], // Valor padrão
    mensagem: ['', [Validators.required, Validators.minLength(10)]]
  });

  formSubmetido = false;

  // Função chamada no submit do formulário
  onSubmit() {
    this.formSubmetido = true;

    // Verifica se o formulário é válido antes de prosseguir
    if (this.contactForm.invalid) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    // Lógica para "enviar" os dados (aqui, apenas mostramos no console e um alerta)
    console.log('Dados do formulário:', this.contactForm.value);

    const nomeUsuario = this.contactForm.value.nome;
    alert(`Obrigado, ${nomeUsuario}! Sua mensagem foi enviada com sucesso.`);
    
    // Limpa o formulário e reseta o estado
    this.contactForm.reset();
    this.formSubmetido = false;
    // Restaura o valor padrão do select
    this.contactForm.patchValue({ tipo: 'Elogio' });
  }

  // Getters para facilitar o acesso aos controles no template
  get nome() { return this.contactForm.get('nome'); }
  get email() { return this.contactForm.get('email'); }
  get telefone() { return this.contactForm.get('telefone'); }
  get tipo() { return this.contactForm.get('tipo'); }
  get mensagem() { return this.contactForm.get('mensagem'); }
}