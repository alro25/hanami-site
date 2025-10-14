import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent {
  // Dados da nossa história
  ourStory = {
    title: 'Nossa História',
    description: `A HANAMI nasceu da paixão pela beleza autêntica e pela celebração da diversidade. 
    Inspirada pela tradição japonesa de apreciar a efêmera beleza das flores de cerejeira, nossa marca 
    busca capturar a essência única de cada pessoa, realçando sua beleza natural com produtos de alta 
    qualidade e desempenho excepcional.`,
    hanamiMeaning: {
      title: 'O Significado de HANAMI',
      description: `HANAMI (花見) é uma palavra japonesa que significa "observar as flores", 
      derivada de "hana" (flor) e "mi" (ver). É uma tradição milenar onde as pessoas se reúnem 
      sob as cerejeiras em flor para contemplar sua beleza passageira, simbolizando a natureza 
      efêmera da vida e a importância de apreciar cada momento.`,
      philosophy: `Na HANAMI, adotamos esta filosofia: acreditamos que cada pessoa possui uma beleza 
      única e passageira que merece ser celebrada. Nossos produtos são criados para realçar essa 
      beleza natural, assim como as flores de cerejeira que florescem brevemente, mas deixam 
      uma impressão duradoura.`
    },
    image: '/img/about-history.jpg'
  };

  // Nossa missão
  ourMission = [
    {
      image: '/img/icons/mission-icon.png',
      title: 'Missão',
      description: 'Oferecer produtos de beleza inovadores e de alta performance que celebrem a individualidade e empoderem cada pessoa a expressar sua beleza única, inspirados na filosofia Hanami de apreciar a beleza efêmera.'
    },
    {
      image: '/img/icons/vision-icon.png',
      title: 'Visão',
      description: 'Ser a marca de beleza mais amada e confiável do Brasil, reconhecida pela qualidade, inovação e compromisso com a autoestima de nossos consumidores, celebrando a diversidade como as diferentes flores de cerejeira.'
    },
    {
      image: '/img/icons/values-icon.png',
      title: 'Valores',
      description: 'Autenticidade, Inovação, Qualidade, Diversidade, Sustentabilidade e Respeito ao consumidor - valores que refletem a essência da tradição Hanami.'
    }
  ];

  // Nossos diferenciais
  differentiators = [
    {
      image: '/img/icons/technology-icon.png',
      title: 'Tecnologia e Inovação',
      description: 'Investimos em pesquisa e desenvolvimento para criar fórmulas exclusivas que atendem às necessidades da pele brasileira, combinando sabedoria ancestral com tecnologia moderna.'
    },
    {
      image: '/img/icons/quality-icon.png',
      title: 'Compromisso com a Qualidade',
      description: 'Todos os nossos produtos passam por rigorosos testes de qualidade e segurança antes de chegarem até você, seguindo o princípio japonês de excelência em cada detalhe.'
    },
    {
      image: '/img/icons/sustainability-icon.png',
      title: 'Sustentabilidade',
      description: 'Trabalhamos constantemente para reduzir nosso impacto ambiental através de embalagens sustentáveis e processos responsáveis, honrando a natureza que inspira nossa marca.'
    },
    {
      image: '/img/icons/diversity-icon.png',
      title: 'Diversidade e Inclusão',
      description: 'Criamos produtos para todos os tons de pele e tipos de beleza, celebrando a diversidade que nos torna únicos - assim como as variedades de cerejeiras no Hanami.'
    }
  ];

  // Timeline da marca
  timeline = [
    {
      year: '2018',
      title: 'Fundação',
      description: 'HANAMI é fundada com o lançamento da primeira linha de batons, inspirada nas cores das flores de cerejeira.'
    },
    {
      year: '2019',
      title: 'Expansão',
      description: 'Lançamento das linhas de produtos para olhos e rosto, incorporando a filosofia Hanami em cada formulação.'
    },
    {
      year: '2020',
      title: 'Reconhecimento',
      description: 'Premiada como marca revelação no Beauty Awards Brasil pelo conceito único baseado na tradição japonesa.'
    },
    {
      year: '2022',
      title: 'Nacionalização',
      description: 'Inauguração de nossa fábrica própria no Brasil, integrando tecnologia japonesa com ingredientes locais.'
    },
    {
      year: '2023',
      title: 'Sustentabilidade',
      description: 'Lançamento do programa de embalagens sustentáveis e parcerias com comunidades de cultivo responsável.'
    },
    {
      year: '2024',
      title: 'Inovação',
      description: 'Expansão internacional e lançamento de tecnologia exclusiva inspirada nos princípios do Hanami.'
    }
  ];

  // Compromissos
  commitments = [
    {
      image: '/img/icons/cruelty-free-icon.png',
      title: 'Cruelty Free',
      description: 'Nenhum de nossos produtos é testado em animais, honrando o respeito por todas as formas de vida.'
    },
    {
      image: '/img/icons/recycling-icon.png',
      title: 'Embalagens Sustentáveis',
      description: '70% das nossas embalagens são feitas com materiais reciclados, refletindo nosso cuidado com a natureza.'
    },
    {
      image: '/img/icons/natural-icon.png',
      title: 'Ingredientes Naturais',
      description: 'Priorizamos ingredientes de origem natural em nossas fórmulas, inspirados na pureza da natureza.'
    },
    {
      image: '/img/icons/factory-icon.png',
      title: 'Produção Responsável',
      description: 'Nossa fábrica opera com energia renovável e processos sustentáveis, seguindo princípios de harmonia ambiental.'
    }
  ];

  // Inspiração Hanami
  hanamiInspiration = {
    title: 'A Inspiração Hanami',
    items: [
      {
        image: '/img/icons/cherry-blossom-icon.png',
        title: 'Beleza Efêmera',
        description: 'Assim como as flores de cerejeira, acreditamos que a verdadeira beleza está em sua natureza passageira e única.'
      },
      {
        image: '/img/icons/harmony-icon.png',
        title: 'Harmonia',
        description: 'Buscamos o equilíbrio perfeito entre tradição e inovação, natureza e tecnologia.'
      },
      {
        image: '/img/icons/celebration-icon.png',
        title: 'Celebração',
        description: 'Cada produto é uma celebração da individualidade e da beleza que existe em cada pessoa.'
      }
    ]
  };
}