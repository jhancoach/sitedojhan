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
      administration: 'Administração'
    },
    home: {
      welcome: 'Bem-vindo ao site do Jhan',
      verse: 'Tudo o que fizerem, façam de todo o coração, como para o Senhor, não para os homens, sabendo que receberão do Senhor a recompensa da herança, pois é a Cristo, o Senhor, a quem vocês servem.',
      verseRef: 'Colossenses 3:23-24',
      accessPlatform: 'Acessar Plataforma'
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
      administration: 'Administration'
    },
    home: {
      welcome: "Welcome to Jhan's Website",
      verse: 'Whatever you do, work at it with all your heart, as working for the Lord, not for human masters, since you know that you will receive an inheritance from the Lord as a reward. It is the Lord Christ you are serving.',
      verseRef: 'Colossians 3:23-24',
      accessPlatform: 'Access Platform'
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
      administration: 'Administración'
    },
    home: {
      welcome: 'Bienvenido al sitio de Jhan',
      verse: 'Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres, sabiendo que del Señor recibiréis la recompensa de la herencia, porque a Cristo el Señor servís.',
      verseRef: 'Colosenses 3:23-24',
      accessPlatform: 'Acceder a la Plataforma'
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
      administration: 'การบริหาร'
    },
    home: {
      welcome: 'ยินดีต้อนรับสู่เว็บไซต์ของ Jhan',
      verse: 'สิ่งใดก็ตามที่ท่านทำ จงทำด้วยสุดใจ ราวกับว่าทำเพื่อองค์พระผู้เป็นเจ้า มิใช่เพื่อมนุษย์ เพราะท่านรู้ว่าท่านจะได้รับมรดกจากพระเจ้าเป็นรางวัล ท่านรับใช้พระเยซูคริสต์องค์พระผู้เป็นเจ้า',
      verseRef: 'โคโลสี 3:23-24',
      accessPlatform: 'เข้าสู่แพลตฟอร์ม'
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
      administration: 'Administrasi'
    },
    home: {
      welcome: 'Selamat Datang di Situs Jhan',
      verse: 'Apa pun yang kamu lakukan, lakukanlah dengan segenap hatimu, seperti untuk Tuhan dan bukan untuk manusia, karena kamu tahu bahwa kamu akan menerima warisan dari Tuhan sebagai upah. Kristus Tuhanlah yang kamu layani.',
      verseRef: 'Kolose 3:23-24',
      accessPlatform: 'Akses Platform'
    }
  }
};