import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'pt' | 'en' | 'es' | 'th' | 'id';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    return (stored as Language) || 'pt';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations: Record<Language, any> = {
  pt: {
    nav: {
      home: 'Início',
      about: 'Sobre',
      downloads: 'Downloads',
      game: 'Jogo',
      community: 'Comunidade',
      admin: 'Admin',
      logout: 'Sair',
      maps: 'Mapas',
      aerialViews: 'Visões Aéreas',
      safes: 'Safes',
      characters: 'Personagens',
      pets: 'Pets',
      composition: 'Monte Sua Composição',
      picksBans: 'Picks e Bans',
      statistics: 'Estatísticas dos Jogadores',
      feedback: 'Dúvidas e Sugestões',
      freeAgent: 'Free Agent',
      adminStorage: 'Admin Storage',
      administration: 'Administração',
      loadouts: 'Carregamentos 3.0'
    },
    home: {
      welcome: 'Bem-vindo ao site do Jhan',
      verse: 'Tudo o que fizerem, façam de todo o coração, como para o Senhor, não para os homens, sabendo que receberão do Senhor a recompensa da herança, pois é a Cristo, o Senhor, a quem vocês servem.',
      verseRef: 'Colossenses 3:23-24',
      accessPlatform: 'Acessar Plataforma',
      latestVideos: 'Últimos Vídeos do YouTube'
    },
    loadouts: {
      title: 'Carregamentos 3.0',
      description: 'Clique nas imagens para fazer o download'
    },
    about: {
      title: 'Sobre Jhan Medeiros',
      quote: 'Os dados nos mostram claramente as áreas em que precisamos focar para melhorar.',
      intro: 'Olá meu nome é <strong>Jansey Medeiros</strong> mais conhecido como <strong>Jhan</strong>, sou analista de dados e mapas e atualmente faço parte da <strong>Team Solid</strong> como Analista de Free Fire.',
      education: 'Formação',
      teams: 'Times Que já Trabalhei',
      championships: 'Campeonatos',
      workDescription: 'Descritivo de Trabalho',
      mission: 'Missão',
      vision: 'Visão',
      values: 'Valores',
      missionText: 'Tocar vidas através da minha vida com Cristo',
      visionText: 'Inspirar as pessoas a serem suas melhores versões não apenas no jogo mas como na vida.',
      valuesText: 'Agir com transparência, honestidade, fazer sempre o que é certo.'
    },
    maps: {
      title: 'Mapas Free Fire',
      description: 'clique nos mapas para fazer o download',
      download: 'Download'
    },
    aerialViews: {
      title: 'Visões Aéreas',
      description: 'Acesse as pastas do Google Drive com visões aéreas dos mapas',
      accessDrive: 'Acessar Drive'
    },
    safes: {
      title: 'Safes',
      description: 'Filtre por mapa e safe para acessar os links',
      selectMap: 'Selecione o mapa',
      allMaps: 'Todos os Mapas',
      selectSafe: 'Selecione a safe',
      allSafes: 'Todas as Safes',
      showing: 'Mostrando',
      safes: 'safes',
      map: 'Mapa',
      safe: 'Safe',
      link: 'Link',
      images: 'imagens',
      noResults: 'Nenhuma safe encontrada com os filtros selecionados'
    },
    characters: {
      title: 'Personagens Free Fire',
      description: 'Clique nas imagens para fazer o download',
      active: 'Ativos',
      passive: 'Passivos',
      download: 'Download'
    },
    pets: {
      title: 'Pets Free Fire',
      description: 'Clique nas imagens para fazer o download',
      download: 'Download'
    },
    composition: {
      title: 'Monte Sua Composição',
      description: 'Clique nos cards para selecionar personagens',
      print: 'Imprimir / Salvar PDF',
      player: 'Jogador',
      playerName: 'Nome do Jogador',
      namePlaceholder: 'Digite o nome...',
      active: 'Ativa',
      passive: 'Pass.',
      pet: 'Pet',
      loadout: 'Carreg.',
      selectActive: 'Selecione Ativa',
      selectPassive: 'Selecione Passiva'
    },
    statistics: {
      title: 'Estatísticas do Time',
      description: 'Preencha os dados estatísticos coletivos e individuais',
      note: 'Ferramenta desenvolvida principalmente para analistas que não possuem computador',
      resetData: 'Resetar Dados',
      printPdf: 'Imprimir / Salvar PDF',
      generateSummary: 'Gerar Resumo',
      eventType: 'Tipo de Evento',
      selectType: 'Selecione o tipo',
      competition: 'Competição',
      training: 'Treino',
      eventName: 'Nome do Evento',
      eventNamePlaceholder: 'Ex: Copa GWL, Treino 10h',
      mapStats: 'Estatísticas por Mapa',
      player: 'Jogador',
      playerName: 'Nome do Jogador',
      photoUrl: 'URL da Foto',
      kills: 'Kills',
      deaths: 'Mortes',
      assists: 'Assistências',
      damage: 'Dano Causado',
      knockdowns: 'Derrubados',
      roomsPlayed: 'Salas Jogadas',
      points: 'Pontos',
      rooms: 'Salas',
      eliminations: 'Abates',
      avgPoints: 'Média de Pontos',
      avgEliminations: 'Média de Abates',
      collectiveStats: 'Estatísticas Coletivas',
      totalPoints: 'Total de Pontos',
      totalEliminations: 'Total de Abates'
    },
    feedback: {
      title: 'Fale Conosco',
      description: 'Tire suas dúvidas, envie sugestões ou deixe seu comentário',
      sendMessage: 'Envie sua mensagem',
      formDescription: 'Preencha o formulário abaixo e retornaremos o mais breve possível',
      fullName: 'Nome Completo',
      email: 'Email',
      messageType: 'Tipo de Mensagem',
      selectType: 'Selecione o tipo',
      doubt: 'Dúvida',
      suggestion: 'Sugestão',
      comment: 'Comentário',
      message: 'Mensagem',
      messagePlaceholder: 'Digite sua mensagem aqui...',
      characters: 'caracteres',
      send: 'Enviar Mensagem',
      sending: 'Enviando...',
      otherContacts: 'Outras formas de contato',
      contactInfo: 'Você também pode entrar em contato através das nossas redes sociais disponíveis no menu.',
      responseTime: 'Tempo de resposta: Geralmente respondemos em até 24-48 horas.',
      tip: 'Dica: Seja o mais detalhado possível em sua mensagem para que possamos ajudá-lo melhor!',
      adminMessages: 'Mensagens Recebidas',
      viewMessages: 'Ver Mensagens',
      noMessages: 'Nenhuma mensagem encontrada',
      createdAt: 'Data',
      name: 'Nome',
      type: 'Tipo'
    },
    footer: {
      about: 'Analista de dados e mapas Free Fire. Atualmente na Team Solid.',
      quickLinks: 'Links Rápidos',
      about_link: 'Sobre',
      freeAgent: 'Free Agent',
      maps: 'Mapas',
      picksBans: 'Picks & Bans',
      socialMedia: 'Redes Sociais',
      rights: 'Todos os direitos reservados.',
      verse: '"Tudo o que fizerem, façam de todo o coração, como para o Senhor"'
    }
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      downloads: 'Downloads',
      game: 'Game',
      community: 'Community',
      admin: 'Admin',
      logout: 'Logout',
      maps: 'Maps',
      aerialViews: 'Aerial Views',
      safes: 'Safes',
      characters: 'Characters',
      pets: 'Pets',
      composition: 'Build Your Composition',
      picksBans: 'Picks & Bans',
      statistics: 'Player Statistics',
      feedback: 'Questions & Suggestions',
      freeAgent: 'Free Agent',
      adminStorage: 'Admin Storage',
      administration: 'Administration',
      loadouts: 'Loadouts 3.0'
    },
    home: {
      welcome: "Welcome to Jhan's Website",
      verse: 'Whatever you do, work at it with all your heart, as working for the Lord, not for human masters, since you know that you will receive an inheritance from the Lord as a reward. It is the Lord Christ you are serving.',
      verseRef: 'Colossians 3:23-24',
      accessPlatform: 'Access Platform',
      latestVideos: 'Latest YouTube Videos'
    },
    loadouts: {
      title: 'Loadouts 3.0',
      description: 'Click on images to download'
    },
    about: {
      title: 'About Jhan Medeiros',
      quote: 'Data clearly shows us the areas we need to focus on to improve.',
      intro: 'Hello, my name is <strong>Jansey Medeiros</strong>, better known as <strong>Jhan</strong>. I am a data and map analyst and currently part of <strong>Team Solid</strong> as a Free Fire Analyst.',
      education: 'Education',
      teams: 'Teams I\'ve Worked With',
      championships: 'Championships',
      workDescription: 'Work Description',
      mission: 'Mission',
      vision: 'Vision',
      values: 'Values',
      missionText: 'To touch lives through my life with Christ',
      visionText: 'To inspire people to be their best versions not only in the game but in life.',
      valuesText: 'Act with transparency, honesty, always do what is right.'
    },
    maps: {
      title: 'Free Fire Maps',
      description: 'click on maps to download',
      download: 'Download'
    },
    aerialViews: {
      title: 'Aerial Views',
      description: 'Access Google Drive folders with aerial views of the maps',
      accessDrive: 'Access Drive'
    },
    safes: {
      title: 'Safes',
      description: 'Filter by map and safe to access links',
      selectMap: 'Select map',
      allMaps: 'All Maps',
      selectSafe: 'Select safe',
      allSafes: 'All Safes',
      showing: 'Showing',
      safes: 'safes',
      map: 'Map',
      safe: 'Safe',
      link: 'Link',
      images: 'images',
      noResults: 'No safes found with the selected filters'
    },
    characters: {
      title: 'Free Fire Characters',
      description: 'Click on images to download',
      active: 'Active',
      passive: 'Passive',
      download: 'Download'
    },
    pets: {
      title: 'Free Fire Pets',
      description: 'Click on images to download',
      download: 'Download'
    },
    composition: {
      title: 'Build Your Composition',
      description: 'Click on cards to select characters',
      print: 'Print / Save PDF',
      player: 'Player',
      playerName: 'Player Name',
      namePlaceholder: 'Enter name...',
      active: 'Active',
      passive: 'Pass.',
      pet: 'Pet',
      loadout: 'Load.',
      selectActive: 'Select Active',
      selectPassive: 'Select Passive'
    },
    statistics: {
      title: 'Team Statistics',
      description: 'Fill in collective and individual statistical data',
      note: 'Tool developed mainly for analysts who do not have a computer',
      resetData: 'Reset Data',
      printPdf: 'Print / Save PDF',
      generateSummary: 'Generate Summary',
      eventType: 'Event Type',
      selectType: 'Select type',
      competition: 'Competition',
      training: 'Training',
      eventName: 'Event Name',
      eventNamePlaceholder: 'Ex: GWL Cup, 10am Training',
      mapStats: 'Statistics by Map',
      player: 'Player',
      playerName: 'Player Name',
      photoUrl: 'Photo URL',
      kills: 'Kills',
      deaths: 'Deaths',
      assists: 'Assists',
      damage: 'Damage Dealt',
      knockdowns: 'Knockdowns',
      roomsPlayed: 'Rooms Played',
      points: 'Points',
      rooms: 'Rooms',
      eliminations: 'Eliminations',
      avgPoints: 'Average Points',
      avgEliminations: 'Average Eliminations',
      collectiveStats: 'Collective Statistics',
      totalPoints: 'Total Points',
      totalEliminations: 'Total Eliminations'
    },
    feedback: {
      title: 'Contact Us',
      description: 'Ask questions, send suggestions or leave your comment',
      sendMessage: 'Send your message',
      formDescription: 'Fill out the form below and we will get back to you as soon as possible',
      fullName: 'Full Name',
      email: 'Email',
      messageType: 'Message Type',
      selectType: 'Select type',
      doubt: 'Question',
      suggestion: 'Suggestion',
      comment: 'Comment',
      message: 'Message',
      messagePlaceholder: 'Type your message here...',
      characters: 'characters',
      send: 'Send Message',
      sending: 'Sending...',
      otherContacts: 'Other ways to contact',
      contactInfo: 'You can also contact us through our social networks available in the menu.',
      responseTime: 'Response time: We usually respond within 24-48 hours.',
      tip: 'Tip: Be as detailed as possible in your message so we can help you better!',
      adminMessages: 'Received Messages',
      viewMessages: 'View Messages',
      noMessages: 'No messages found',
      createdAt: 'Date',
      name: 'Name',
      type: 'Type'
    },
    footer: {
      about: 'Free Fire data and map analyst. Currently at Team Solid.',
      quickLinks: 'Quick Links',
      about_link: 'About',
      freeAgent: 'Free Agent',
      maps: 'Maps',
      picksBans: 'Picks & Bans',
      socialMedia: 'Social Media',
      rights: 'All rights reserved.',
      verse: '"Whatever you do, work at it with all your heart, as working for the Lord"'
    }
  },
  es: {
    nav: {
      home: 'Inicio',
      about: 'Acerca de',
      downloads: 'Descargas',
      game: 'Juego',
      community: 'Comunidad',
      admin: 'Admin',
      logout: 'Salir',
      maps: 'Mapas',
      aerialViews: 'Vistas Aéreas',
      safes: 'Cajas Fuertes',
      characters: 'Personajes',
      pets: 'Mascotas',
      composition: 'Arma tu Composición',
      picksBans: 'Selecciones y Baneos',
      statistics: 'Estadísticas de Jugadores',
      feedback: 'Dudas y Sugerencias',
      freeAgent: 'Agente Libre',
      adminStorage: 'Almacenamiento Admin',
      administration: 'Administración',
      loadouts: 'Equipamientos 3.0'
    },
    home: {
      welcome: 'Bienvenido al sitio de Jhan',
      verse: 'Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres, sabiendo que del Señor recibiréis la recompensa de la herencia, porque a Cristo el Señor servís.',
      verseRef: 'Colosenses 3:23-24',
      accessPlatform: 'Acceder a la Plataforma',
      latestVideos: 'Últimos Videos de YouTube'
    },
    loadouts: {
      title: 'Equipamientos 3.0',
      description: 'Haz clic en las imágenes para descargar'
    },
    about: {
      title: 'Sobre Jhan Medeiros',
      quote: 'Los datos nos muestran claramente las áreas en las que necesitamos enfocarnos para mejorar.',
      intro: 'Hola, mi nombre es <strong>Jansey Medeiros</strong>, más conocido como <strong>Jhan</strong>. Soy analista de datos y mapas y actualmente formo parte de <strong>Team Solid</strong> como Analista de Free Fire.',
      education: 'Formación',
      teams: 'Equipos con los que he trabajado',
      championships: 'Campeonatos',
      workDescription: 'Descripción del Trabajo',
      mission: 'Misión',
      vision: 'Visión',
      values: 'Valores',
      missionText: 'Tocar vidas a través de mi vida con Cristo',
      visionText: 'Inspirar a las personas a ser sus mejores versiones no solo en el juego sino en la vida.',
      valuesText: 'Actuar con transparencia, honestidad, hacer siempre lo correcto.'
    },
    maps: {
      title: 'Mapas de Free Fire',
      description: 'haz clic en los mapas para descargar',
      download: 'Descargar'
    },
    aerialViews: {
      title: 'Vistas Aéreas',
      description: 'Accede a las carpetas de Google Drive con vistas aéreas de los mapas',
      accessDrive: 'Acceder al Drive'
    },
    safes: {
      title: 'Cajas Fuertes',
      description: 'Filtra por mapa y caja fuerte para acceder a los enlaces',
      selectMap: 'Selecciona el mapa',
      allMaps: 'Todos los Mapas',
      selectSafe: 'Selecciona la caja fuerte',
      allSafes: 'Todas las Cajas Fuertes',
      showing: 'Mostrando',
      safes: 'cajas fuertes',
      map: 'Mapa',
      safe: 'Caja Fuerte',
      link: 'Enlace',
      images: 'imágenes',
      noResults: 'No se encontraron cajas fuertes con los filtros seleccionados'
    },
    characters: {
      title: 'Personajes de Free Fire',
      description: 'Haz clic en las imágenes para descargar',
      active: 'Activos',
      passive: 'Pasivos',
      download: 'Descargar'
    },
    pets: {
      title: 'Mascotas de Free Fire',
      description: 'Haz clic en las imágenes para descargar',
      download: 'Descargar'
    },
    composition: {
      title: 'Arma tu Composición',
      description: 'Haz clic en las tarjetas para seleccionar personajes',
      print: 'Imprimir / Guardar PDF',
      player: 'Jugador',
      playerName: 'Nombre del Jugador',
      namePlaceholder: 'Ingresa el nombre...',
      active: 'Activa',
      passive: 'Pas.',
      pet: 'Mascota',
      loadout: 'Equip.',
      selectActive: 'Seleccionar Activa',
      selectPassive: 'Seleccionar Pasiva'
    },
    statistics: {
      title: 'Estadísticas del Equipo',
      description: 'Completa los datos estadísticos colectivos e individuales',
      note: 'Herramienta desarrollada principalmente para analistas que no tienen computadora',
      resetData: 'Restablecer Datos',
      printPdf: 'Imprimir / Guardar PDF',
      generateSummary: 'Generar Resumen',
      eventType: 'Tipo de Evento',
      selectType: 'Selecciona el tipo',
      competition: 'Competición',
      training: 'Entrenamiento',
      eventName: 'Nombre del Evento',
      eventNamePlaceholder: 'Ej: Copa GWL, Entrenamiento 10h',
      mapStats: 'Estadísticas por Mapa',
      player: 'Jugador',
      playerName: 'Nombre del Jugador',
      photoUrl: 'URL de la Foto',
      kills: 'Eliminaciones',
      deaths: 'Muertes',
      assists: 'Asistencias',
      damage: 'Daño Causado',
      knockdowns: 'Derribados',
      roomsPlayed: 'Salas Jugadas',
      points: 'Puntos',
      rooms: 'Salas',
      eliminations: 'Eliminaciones',
      avgPoints: 'Promedio de Puntos',
      avgEliminations: 'Promedio de Eliminaciones',
      collectiveStats: 'Estadísticas Colectivas',
      totalPoints: 'Total de Puntos',
      totalEliminations: 'Total de Eliminaciones'
    },
    feedback: {
      title: 'Contáctanos',
      description: 'Haz preguntas, envía sugerencias o deja tu comentario',
      sendMessage: 'Envía tu mensaje',
      formDescription: 'Completa el formulario a continuación y te responderemos lo antes posible',
      fullName: 'Nombre Completo',
      email: 'Email',
      messageType: 'Tipo de Mensaje',
      selectType: 'Selecciona el tipo',
      doubt: 'Pregunta',
      suggestion: 'Sugerencia',
      comment: 'Comentario',
      message: 'Mensaje',
      messagePlaceholder: 'Escribe tu mensaje aquí...',
      characters: 'caracteres',
      send: 'Enviar Mensaje',
      sending: 'Enviando...',
      otherContacts: 'Otras formas de contacto',
      contactInfo: 'También puedes contactarnos a través de nuestras redes sociales disponibles en el menú.',
      responseTime: 'Tiempo de respuesta: Generalmente respondemos en 24-48 horas.',
      tip: '¡Consejo: Sé lo más detallado posible en tu mensaje para que podamos ayudarte mejor!',
      adminMessages: 'Mensajes Recibidos',
      viewMessages: 'Ver Mensajes',
      noMessages: 'No se encontraron mensajes',
      createdAt: 'Fecha',
      name: 'Nombre',
      type: 'Tipo'
    },
    footer: {
      about: 'Analista de datos y mapas de Free Fire. Actualmente en Team Solid.',
      quickLinks: 'Enlaces Rápidos',
      about_link: 'Acerca de',
      freeAgent: 'Agente Libre',
      maps: 'Mapas',
      picksBans: 'Selecciones y Baneos',
      socialMedia: 'Redes Sociales',
      rights: 'Todos los derechos reservados.',
      verse: '"Y todo lo que hagáis, hacedlo de corazón, como para el Señor"'
    }
  },
  th: {
    nav: {
      home: 'หน้าแรก',
      about: 'เกี่ยวกับ',
      downloads: 'ดาวน์โหลด',
      game: 'เกม',
      community: 'ชุมชน',
      admin: 'ผู้ดูแลระบบ',
      logout: 'ออกจากระบบ',
      maps: 'แผนที่',
      aerialViews: 'มุมมองทางอากาศ',
      safes: 'ตู้เซฟ',
      characters: 'ตัวละคร',
      pets: 'สัตว์เลี้ยง',
      composition: 'สร้างองค์ประกอบของคุณ',
      picksBans: 'เลือกและแบน',
      statistics: 'สถิติผู้เล่น',
      feedback: 'คำถามและข้อเสนอแนะ',
      freeAgent: 'ตัวแทนอิสระ',
      adminStorage: 'ที่เก็บข้อมูลผู้ดูแล',
      administration: 'การบริหาร',
      loadouts: 'การโหลด 3.0'
    },
    home: {
      welcome: 'ยินดีต้อนรับสู่เว็บไซต์ของ Jhan',
      verse: 'สิ่งใดก็ตามที่ท่านทำ จงทำด้วยสุดใจ ราวกับว่าทำเพื่อองค์พระผู้เป็นเจ้า มิใช่เพื่อมนุษย์ เพราะท่านรู้ว่าท่านจะได้รับมรดกจากพระเจ้าเป็นรางวัล ท่านรับใช้พระเยซูคริสต์องค์พระผู้เป็นเจ้า',
      verseRef: 'โคโลสี 3:23-24',
      accessPlatform: 'เข้าสู่แพลตฟอร์ม',
      latestVideos: 'วิดีโอล่าสุดจาก YouTube'
    },
    loadouts: {
      title: 'การโหลด 3.0',
      description: 'คลิกที่รูปภาพเพื่อดาวน์โหลด'
    },
    about: {
      title: 'เกี่ยวกับ Jhan Medeiros',
      quote: 'ข้อมูลแสดงให้เราเห็นอย่างชัดเจนในพื้นที่ที่เราต้องเน้นเพื่อปรับปรุง',
      intro: 'สวัสดี ชื่อของฉันคือ <strong>Jansey Medeiros</strong> หรือที่รู้จักกันในนาม <strong>Jhan</strong> ฉันเป็นนักวิเคราะห์ข้อมูลและแผนที่ และปัจจุบันเป็นส่วนหนึ่งของ <strong>Team Solid</strong> ในฐานะนักวิเคราะห์ Free Fire',
      education: 'การศึกษา',
      teams: 'ทีมที่เคยทำงานด้วย',
      championships: 'แชมป์เปี้ยนชิพ',
      workDescription: 'รายละเอียดงาน',
      mission: 'พันธกิจ',
      vision: 'วิสัยทัศน์',
      values: 'ค่านิยม',
      missionText: 'สัมผัสชีวิตผ่านชีวิตของฉันกับพระคริสต์',
      visionText: 'สร้างแรงบันดาลใจให้ผู้คนเป็นเวอร์ชันที่ดีที่สุดของตนเองไม่เพียงในเกมแต่ในชีวิตจริง',
      valuesText: 'ดำเนินการด้วยความโปร่งใส ความซื่อสัตย์ ทำสิ่งที่ถูกต้องเสมอ'
    },
    maps: {
      title: 'แผนที่ Free Fire',
      description: 'คลิกที่แผนที่เพื่อดาวน์โหลด',
      download: 'ดาวน์โหลด'
    },
    aerialViews: {
      title: 'มุมมองทางอากาศ',
      description: 'เข้าถึงโฟลเดอร์ Google Drive ที่มีมุมมองทางอากาศของแผนที่',
      accessDrive: 'เข้าสู่ Drive'
    },
    safes: {
      title: 'ตู้เซฟ',
      description: 'กรองตามแผนที่และตู้เซฟเพื่อเข้าถึงลิงก์',
      selectMap: 'เลือกแผนที่',
      allMaps: 'แผนที่ทั้งหมด',
      selectSafe: 'เลือกตู้เซฟ',
      allSafes: 'ตู้เซฟทั้งหมด',
      showing: 'แสดง',
      safes: 'ตู้เซฟ',
      map: 'แผนที่',
      safe: 'ตู้เซฟ',
      link: 'ลิงก์',
      images: 'รูปภาพ',
      noResults: 'ไม่พบตู้เซฟด้วยตัวกรองที่เลือก'
    },
    characters: {
      title: 'ตัวละคร Free Fire',
      description: 'คลิกที่รูปภาพเพื่อดาวน์โหลด',
      active: 'แอคทีฟ',
      passive: 'แพสซีฟ',
      download: 'ดาวน์โหลด'
    },
    pets: {
      title: 'สัตว์เลี้ยง Free Fire',
      description: 'คลิกที่รูปภาพเพื่อดาวน์โหลด',
      download: 'ดาวน์โหลด'
    },
    composition: {
      title: 'สร้างองค์ประกอบของคุณ',
      description: 'คลิกที่การ์ดเพื่อเลือกตัวละคร',
      print: 'พิมพ์ / บันทึกเป็น PDF',
      player: 'ผู้เล่น',
      playerName: 'ชื่อผู้เล่น',
      namePlaceholder: 'ใส่ชื่อ...',
      active: 'แอคทีฟ',
      passive: 'แพส.',
      pet: 'สัตว์เลี้ยง',
      loadout: 'โหลด',
      selectActive: 'เลือกแอคทีฟ',
      selectPassive: 'เลือกแพสซีฟ'
    },
    statistics: {
      title: 'สถิติทีม',
      description: 'กรอกข้อมูลสถิติรวมและรายบุคคล',
      note: 'เครื่องมือที่พัฒนาขึ้นสำหรับนักวิเคราะห์ที่ไม่มีคอมพิวเตอร์',
      resetData: 'รีเซ็ตข้อมูล',
      printPdf: 'พิมพ์ / บันทึกเป็น PDF',
      generateSummary: 'สร้างสรุป',
      eventType: 'ประเภทกิจกรรม',
      selectType: 'เลือกประเภท',
      competition: 'การแข่งขัน',
      training: 'การฝึกซ้อม',
      eventName: 'ชื่อกิจกรรม',
      eventNamePlaceholder: 'เช่น: GWL Cup, ฝึกซ้อม 10 โมง',
      mapStats: 'สถิติตามแผนที่',
      player: 'ผู้เล่น',
      playerName: 'ชื่อผู้เล่น',
      photoUrl: 'URL รูปภาพ',
      kills: 'คิลล์',
      deaths: 'การตาย',
      assists: 'แอสซิสต์',
      damage: 'ดาเมจที่ทำ',
      knockdowns: 'การล้ม',
      roomsPlayed: 'ห้องที่เล่น',
      points: 'คะแนน',
      rooms: 'ห้อง',
      eliminations: 'การกำจัด',
      avgPoints: 'คะแนนเฉลี่ย',
      avgEliminations: 'การกำจัดเฉลี่ย',
      collectiveStats: 'สถิติรวม',
      totalPoints: 'คะแนนรวม',
      totalEliminations: 'การกำจัดรวม'
    },
    feedback: {
      title: 'ติดต่อเรา',
      description: 'ถามคำถาม ส่งข้อเสนอแนะ หรือแสดงความคิดเห็น',
      sendMessage: 'ส่งข้อความของคุณ',
      formDescription: 'กรอกแบบฟอร์มด้านล่างและเราจะติดต่อกลับโดยเร็วที่สุด',
      fullName: 'ชื่อเต็ม',
      email: 'อีเมล',
      messageType: 'ประเภทข้อความ',
      selectType: 'เลือกประเภท',
      doubt: 'คำถาม',
      suggestion: 'ข้อเสนอแนะ',
      comment: 'ความคิดเห็น',
      message: 'ข้อความ',
      messagePlaceholder: 'พิมพ์ข้อความของคุณที่นี่...',
      characters: 'ตัวอักษร',
      send: 'ส่งข้อความ',
      sending: 'กำลังส่ง...',
      otherContacts: 'วิธีติดต่ออื่นๆ',
      contactInfo: 'คุณยังสามารถติดต่อเราผ่านเครือข่ายสังคมออนไลน์ของเราที่มีในเมนู',
      responseTime: 'เวลาตอบกลับ: โดยปกติเราจะตอบกลับภายใน 24-48 ชั่วโมง',
      tip: 'เคล็ดลับ: ระบุรายละเอียดให้มากที่สุดในข้อความของคุณเพื่อให้เราช่วยคุณได้ดีขึ้น!',
      adminMessages: 'ข้อความที่ได้รับ',
      viewMessages: 'ดูข้อความ',
      noMessages: 'ไม่พบข้อความ',
      createdAt: 'วันที่',
      name: 'ชื่อ',
      type: 'ประเภท'
    },
    footer: {
      about: 'นักวิเคราะห์ข้อมูลและแผนที่ Free Fire ปัจจุบันอยู่ที่ Team Solid',
      quickLinks: 'ลิงก์ด่วน',
      about_link: 'เกี่ยวกับ',
      freeAgent: 'ตัวแทนอิสระ',
      maps: 'แผนที่',
      picksBans: 'เลือกและแบน',
      socialMedia: 'โซเชียลมีเดีย',
      rights: 'สงวนลิขสิทธิ์',
      verse: '"สิ่งใดก็ตามที่ท่านทำ จงทำด้วยสุดใจ ราวกับว่าทำเพื่อองค์พระผู้เป็นเจ้า"'
    }
  },
  id: {
    nav: {
      home: 'Beranda',
      about: 'Tentang',
      downloads: 'Unduhan',
      game: 'Permainan',
      community: 'Komunitas',
      admin: 'Admin',
      logout: 'Keluar',
      maps: 'Peta',
      aerialViews: 'Tampilan Udara',
      safes: 'Brankas',
      characters: 'Karakter',
      pets: 'Hewan Peliharaan',
      composition: 'Buat Komposisi Anda',
      picksBans: 'Pilih & Larangan',
      statistics: 'Statistik Pemain',
      feedback: 'Pertanyaan & Saran',
      freeAgent: 'Agen Bebas',
      adminStorage: 'Penyimpanan Admin',
      administration: 'Administrasi',
      loadouts: 'Loadout 3.0'
    },
    home: {
      welcome: 'Selamat Datang di Situs Jhan',
      verse: 'Apa pun yang kamu lakukan, lakukanlah dengan segenap hatimu, seperti untuk Tuhan dan bukan untuk manusia, karena kamu tahu bahwa kamu akan menerima warisan dari Tuhan sebagai upah. Kristus Tuhanlah yang kamu layani.',
      verseRef: 'Kolose 3:23-24',
      accessPlatform: 'Akses Platform',
      latestVideos: 'Video YouTube Terbaru'
    },
    loadouts: {
      title: 'Loadout 3.0',
      description: 'Klik pada gambar untuk mengunduh'
    },
    about: {
      title: 'Tentang Jhan Medeiros',
      quote: 'Data dengan jelas menunjukkan kepada kita area yang perlu kita fokuskan untuk meningkatkan.',
      intro: 'Halo, nama saya <strong>Jansey Medeiros</strong>, lebih dikenal sebagai <strong>Jhan</strong>. Saya adalah seorang analis data dan peta dan saat ini menjadi bagian dari <strong>Team Solid</strong> sebagai Analis Free Fire.',
      education: 'Pendidikan',
      teams: 'Tim yang Pernah Bekerja',
      championships: 'Kejuaraan',
      workDescription: 'Deskripsi Pekerjaan',
      mission: 'Misi',
      vision: 'Visi',
      values: 'Nilai',
      missionText: 'Menyentuh kehidupan melalui hidup saya dengan Kristus',
      visionText: 'Menginspirasi orang untuk menjadi versi terbaik mereka tidak hanya dalam game tetapi dalam kehidupan.',
      valuesText: 'Bertindak dengan transparansi, kejujuran, selalu melakukan yang benar.'
    },
    maps: {
      title: 'Peta Free Fire',
      description: 'klik pada peta untuk mengunduh',
      download: 'Unduh'
    },
    aerialViews: {
      title: 'Tampilan Udara',
      description: 'Akses folder Google Drive dengan tampilan udara dari peta',
      accessDrive: 'Akses Drive'
    },
    safes: {
      title: 'Brankas',
      description: 'Filter berdasarkan peta dan brankas untuk mengakses tautan',
      selectMap: 'Pilih peta',
      allMaps: 'Semua Peta',
      selectSafe: 'Pilih brankas',
      allSafes: 'Semua Brankas',
      showing: 'Menampilkan',
      safes: 'brankas',
      map: 'Peta',
      safe: 'Brankas',
      link: 'Tautan',
      images: 'gambar',
      noResults: 'Tidak ada brankas yang ditemukan dengan filter yang dipilih'
    },
    characters: {
      title: 'Karakter Free Fire',
      description: 'Klik pada gambar untuk mengunduh',
      active: 'Aktif',
      passive: 'Pasif',
      download: 'Unduh'
    },
    pets: {
      title: 'Hewan Peliharaan Free Fire',
      description: 'Klik pada gambar untuk mengunduh',
      download: 'Unduh'
    },
    composition: {
      title: 'Buat Komposisi Anda',
      description: 'Klik pada kartu untuk memilih karakter',
      print: 'Cetak / Simpan PDF',
      player: 'Pemain',
      playerName: 'Nama Pemain',
      namePlaceholder: 'Masukkan nama...',
      active: 'Aktif',
      passive: 'Pasif',
      pet: 'Peliharaan',
      loadout: 'Load.',
      selectActive: 'Pilih Aktif',
      selectPassive: 'Pilih Pasif'
    },
    statistics: {
      title: 'Statistik Tim',
      description: 'Isi data statistik kolektif dan individu',
      note: 'Alat yang dikembangkan terutama untuk analis yang tidak memiliki komputer',
      resetData: 'Reset Data',
      printPdf: 'Cetak / Simpan PDF',
      generateSummary: 'Buat Ringkasan',
      eventType: 'Jenis Acara',
      selectType: 'Pilih jenis',
      competition: 'Kompetisi',
      training: 'Pelatihan',
      eventName: 'Nama Acara',
      eventNamePlaceholder: 'Contoh: Piala GWL, Pelatihan Jam 10',
      mapStats: 'Statistik per Peta',
      player: 'Pemain',
      playerName: 'Nama Pemain',
      photoUrl: 'URL Foto',
      kills: 'Pembunuhan',
      deaths: 'Kematian',
      assists: 'Assist',
      damage: 'Damage yang Diberikan',
      knockdowns: 'Jatuh',
      roomsPlayed: 'Ruangan Dimainkan',
      points: 'Poin',
      rooms: 'Ruangan',
      eliminations: 'Eliminasi',
      avgPoints: 'Rata-rata Poin',
      avgEliminations: 'Rata-rata Eliminasi',
      collectiveStats: 'Statistik Kolektif',
      totalPoints: 'Total Poin',
      totalEliminations: 'Total Eliminasi'
    },
    feedback: {
      title: 'Hubungi Kami',
      description: 'Ajukan pertanyaan, kirim saran atau tinggalkan komentar Anda',
      sendMessage: 'Kirim pesan Anda',
      formDescription: 'Isi formulir di bawah ini dan kami akan menghubungi Anda sesegera mungkin',
      fullName: 'Nama Lengkap',
      email: 'Email',
      messageType: 'Jenis Pesan',
      selectType: 'Pilih jenis',
      doubt: 'Pertanyaan',
      suggestion: 'Saran',
      comment: 'Komentar',
      message: 'Pesan',
      messagePlaceholder: 'Ketik pesan Anda di sini...',
      characters: 'karakter',
      send: 'Kirim Pesan',
      sending: 'Mengirim...',
      otherContacts: 'Cara kontak lainnya',
      contactInfo: 'Anda juga dapat menghubungi kami melalui jejaring sosial kami yang tersedia di menu.',
      responseTime: 'Waktu respons: Kami biasanya merespons dalam 24-48 jam.',
      tip: 'Tip: Berikan detail sebanyak mungkin dalam pesan Anda sehingga kami dapat membantu Anda dengan lebih baik!',
      adminMessages: 'Pesan yang Diterima',
      viewMessages: 'Lihat Pesan',
      noMessages: 'Tidak ada pesan yang ditemukan',
      createdAt: 'Tanggal',
      name: 'Nama',
      type: 'Jenis'
    },
    footer: {
      about: 'Analis data dan peta Free Fire. Saat ini di Team Solid.',
      quickLinks: 'Tautan Cepat',
      about_link: 'Tentang',
      freeAgent: 'Agen Bebas',
      maps: 'Peta',
      picksBans: 'Pilih & Larangan',
      socialMedia: 'Media Sosial',
      rights: 'Hak cipta dilindungi.',
      verse: '"Apa pun yang kamu lakukan, lakukanlah dengan segenap hatimu, seperti untuk Tuhan"'
    }
  }
};