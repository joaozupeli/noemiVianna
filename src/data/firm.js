/**
 * ============================================================
 * DADOS DO ESCRITÓRIO — Advocacia Noemi Vianna
 * ============================================================
 * Escritório personalizado para prospecção em Colombo-PR
 */

export const firm = {
  name: 'Advocacia Noemi Vianna',
  shortName: 'Noemi Vianna',
  tagline: 'Experiência e dedicação ao seu lado',
  subtitle:
    'Advocacia com atendimento humanizado em Direito Previdenciário e Trabalhista. Mais de 39 anos defendendo os direitos de trabalhadores e segurados na região de Colombo e Curitiba.',

  whatsapp: {
    phone: '5541991753824',
    defaultMessage:
      'Olá! Gostaria de agendar uma consulta com a Dra. Noemi Vianna.',
  },

  contact: {
    phone: '(41) 3606-2565',
    email: null,
    address: {
      street: 'Rua Nicolau Schleder do Carmo, 358, Bloco B, Sala 02',
      neighborhood: 'Jardim Guaraituba',
      city: 'Colombo',
      state: 'PR',
      zip: '83410-165',
      mapEmbedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.5!2d-49.22!3d-25.37!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDIyJzEyLjAiUyA0OcKwMTMnMTIuMCJX!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr&q=Rua+Nicolau+Schleder+do+Carmo,+358,+Colombo,+PR',
    },
    hours: [
      { days: 'Segunda a Sexta', time: '09:00 – 17:30' },
      { days: 'Sábado', time: 'Fechado' },
      { days: 'Domingo', time: 'Fechado' },
    ],
  },

  legal: {
    oab: 'OAB/PR (consultar)',
    cnpj: null,
    disclaimer:
      'Este site tem caráter informativo e não constitui consultoria jurídica. Os resultados mencionados não garantem o mesmo desfecho em casos semelhantes.',
  },

  social: {
    linkedin: null,
    instagram: null,
  },

  stats: [
    { id: 'years', label: 'Anos de experiência', value: 39, suffix: '+' },
    { id: 'areas', label: 'Áreas de atuação', value: 4, suffix: '' },
    { id: 'dedication', label: 'Dedicação ao cliente', value: 100, suffix: '%' },
    { id: 'region', label: 'Foco em Colombo e região', value: 1, suffix: '' },
  ],

  about: {
    history:
      'Com mais de 39 anos de atuação na advocacia, a Dra. Noemi Terezinha Vianna construiu sua trajetória profissional com foco no atendimento humanizado e na defesa intransigente dos direitos de trabalhadores e segurados do INSS. Localizado em Colombo, na região metropolitana de Curitiba, o escritório atende com proximidade e comprometimento.',
    mission:
      'Oferecer orientação jurídica acessível e de qualidade, com atendimento personalizado que respeita a história e as necessidades de cada cliente.',
  },

  values: [
    {
      id: 'experience',
      title: 'Experiência',
      text: 'Mais de três décadas de prática jurídica em Direito Previdenciário e Trabalhista.',
      icon: 'award',
    },
    {
      id: 'proximity',
      title: 'Proximidade',
      text: 'Atendimento pessoal e acompanhamento dedicado em cada etapa do seu caso.',
      icon: 'eye',
    },
    {
      id: 'ethics',
      title: 'Ética',
      text: 'Conduta profissional pautada pela honestidade e transparência com os clientes.',
      icon: 'scale',
    },
    {
      id: 'commitment',
      title: 'Compromisso',
      text: 'Dedicação integral à defesa dos seus direitos, com clareza sobre prazos e expectativas.',
      icon: 'shield',
    },
  ],

  practiceAreas: [
    {
      id: 'previdenciario',
      title: 'Direito Previdenciário',
      short:
        'Aposentadorias, benefícios por incapacidade, pensões e revisões junto ao INSS.',
      full: 'Atuação completa em questões previdenciárias: aposentadoria por idade, tempo de contribuição e especial; auxílio-doença e aposentadoria por invalidez; pensão por morte; BPC/LOAS; revisão de benefícios e recursos administrativos e judiciais.',
      icon: 'civil',
    },
    {
      id: 'trabalhista',
      title: 'Direito Trabalhista',
      short: 'Defesa dos direitos do trabalhador em rescisões, verbas e processos.',
      full: 'Assessoria e representação em questões trabalhistas: rescisões, cálculo de verbas rescisórias, horas extras, assédio moral, reconhecimento de vínculo, ações na Justiça do Trabalho e acordos.',
      icon: 'labor',
    },
    {
      id: 'civil',
      title: 'Direito Civil',
      short: 'Contratos, cobranças e questões patrimoniais do dia a dia.',
      full: 'Orientação em contratos, cobranças, responsabilidade civil e outras demandas cíveis que afetam o cotidiano das pessoas.',
      icon: 'civil',
    },
    {
      id: 'familia',
      title: 'Direito de Família',
      short: 'Divórcios, pensão alimentícia, guarda e inventários.',
      full: 'Atendimento em questões familiares: divórcio consensual e litigioso, pensão alimentícia, guarda de filhos, união estável e inventários.',
      icon: 'family',
    },
  ],

  team: [
    {
      id: '1',
      name: 'Dra. Noemi Terezinha Vianna',
      role: 'Advogada',
      category: 'socio',
      oab: 'OAB/PR (consultar)',
      photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600&h=750&fit=crop&q=80',
      photoAlt: 'Foto representativa de advogada profissional',
      bio: 'Advogada com mais de 39 anos de experiência, especializada em Direito Previdenciário e Trabalhista. Atende em Colombo e região metropolitana de Curitiba com dedicação e proximidade.',
      formation: 'Direito',
      expertise: ['Direito Previdenciário', 'Direito Trabalhista', 'Direito Civil'],
      achievements: [
        'Mais de 39 anos de atuação na advocacia',
        'Especialização em causas previdenciárias e trabalhistas',
      ],
      showWhatsApp: true,
    },
  ],

  testimonials: [
    {
      id: 't1',
      quote:
        'Fui muito bem atendida desde o primeiro contato. A Dra. explicou tudo com paciência e consegui minha aposentadoria.',
      author: 'Cliente — Aposentadoria por tempo de contribuição',
      result: 'Benefício concedido',
    },
    {
      id: 't2',
      quote:
        'Depois de anos tentando sozinho no INSS, procurei a Dra. Noemi e em poucos meses tive meu auxílio-doença aprovado.',
      author: 'Cliente — Auxílio-doença',
      result: 'Recurso deferido',
    },
    {
      id: 't3',
      quote:
        'Atendimento sério e transparente. Me senti segura durante todo o processo trabalhista.',
      author: 'Cliente — Direito Trabalhista',
      result: 'Acordo favorável',
    },
  ],
}

export const teamFilters = [
  { id: 'todos', label: 'Todos' },
  { id: 'socio', label: 'Advogados' },
]

export const interestAreas = [
  'Direito Previdenciário',
  'Direito Trabalhista',
  'Direito Civil',
  'Direito de Família',
  'Outro / Não sei informar',
]
