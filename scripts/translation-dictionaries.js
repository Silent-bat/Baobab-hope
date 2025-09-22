// Dictionnaires de traduction de base pour chaque langue
const translationDictionaries = {
  // Langues africaines
  sw: {
    // Swahili
    name: 'Kiswahili',
    common: {
      'loading': 'Inapakia...',
      'error': 'Kosa lilitokea',
      'backTop': 'Rudi Juu',
      'share': 'Shiriki',
      'search': 'Tafuta',
      'menu': 'Menyu',
      'close': 'Funga',
      'open': 'Fungua',
      'learnMore': 'Jifunze Zaidi',
      'getStarted': 'Anza',
      'joinUs': 'Jiunge Nasi',
      'contactUs': 'Wasiliana Nasi',
      'followUs': 'Tufuate',
      'subscribe': 'Jisajili',
      'thankYou': 'Asante',
      'apply': 'Maombi',
      'submit': 'Wasilisha',
      'cancel': 'Ghairi',
      'save': 'Hifadhi',
      'download': 'Pakua',
      'required': 'Inahitajika',
      'yes': 'Ndio',
      'no': 'Hapana',
      'countries': 'Nchi'
    }
  },

  am: {
    // Amharic
    name: 'አማርኛ',
    common: {
      'loading': 'በመጫን ላይ...',
      'error': 'ስህተት ተከስቷል',
      'backTop': 'ወደ ላይ ተመለስ',
      'share': 'አጋራ',
      'search': 'ፈልግ',
      'menu': 'ምናሌ',
      'close': 'ዝጋ',
      'open': 'ክፈት',
      'learnMore': 'ተጨማሪ ይወቁ',
      'getStarted': 'ጀምር',
      'joinUs': 'ከእኛ ጋር ይቀላቀሉ',
      'contactUs': 'ያግኙን',
      'followUs': 'ተከተሉን',
      'subscribe': 'ይመዝገቡ',
      'thankYou': 'አመሰግናለሁ',
      'apply': 'ያመልክቱ',
      'submit': 'ያስገቡ',
      'cancel': 'ይቅር',
      'save': 'አስቀምጥ',
      'download': 'አውርድ',
      'required': 'ያስፈልጋል',
      'yes': 'አዎ',
      'no': 'አይ',
      'countries': 'ሀገራት'
    }
  },

  ha: {
    // Hausa
    name: 'هَوُسَ',
    common: {
      'loading': 'Ana lodawa...',
      'error': 'Kuskure ya faru',
      'backTop': 'Koma Sama',
      'share': 'Raba',
      'search': 'Nema',
      'menu': 'Menu',
      'close': 'Rufe',
      'open': 'Buɗe',
      'learnMore': 'Ƙara Koyo',
      'getStarted': 'Fara',
      'joinUs': 'Haɗa Mana',
      'contactUs': 'Tuntube Mu',
      'followUs': 'Bi Mu',
      'subscribe': 'Yi rijista',
      'thankYou': 'Na gode',
      'apply': 'Nema',
      'submit': 'Aika',
      'cancel': 'Soke',
      'save': 'Ajiye',
      'download': 'Saukewa',
      'required': 'Ana bukata',
      'yes': 'Ee',
      'no': 'A\'a',
      'countries': 'Kasashe'
    }
  },

  yo: {
    // Yoruba
    name: 'Yorùbá',
    common: {
      'loading': 'N gbe...',
      'error': 'Aṣiṣe kan wa',
      'backTop': 'Pada si Oke',
      'share': 'Pin',
      'search': 'Wa',
      'menu': 'Akojọ aṣyn',
      'close': 'Ti',
      'open': 'Ṣi',
      'learnMore': 'Kọ Ẹkọ Diẹ sii',
      'getStarted': 'Bẹrẹ',
      'joinUs': 'Darapọ mọ Wa',
      'contactUs': 'Kan si Wa',
      'followUs': 'Tẹle Wa',
      'subscribe': 'Forukọsilẹ',
      'thankYou': 'O ṣeun',
      'apply': 'Waye',
      'submit': 'Fi silẹ',
      'cancel': 'Fagilee',
      'save': 'Fi pamo',
      'download': 'Gba wọle',
      'required': 'Ti a beere',
      'yes': 'Bẹẹni',
      'no': 'Bẹẹkọ',
      'countries': 'Awọn orilẹ-ede'
    }
  },

  ig: {
    // Igbo
    name: 'Igbo',
    common: {
      'loading': 'Na-ebuga...',
      'error': 'Ndehie mere',
      'backTop': 'Lagachi n\'elu',
      'share': 'Kesaa',
      'search': 'Chọọ',
      'menu': 'Nchọkọta',
      'close': 'Mechie',
      'open': 'Mepee',
      'learnMore': 'Mụtakwuo',
      'getStarted': 'Malite',
      'joinUs': 'Sonyeere Anyị',
      'contactUs': 'Kpọtụrụ Anyị',
      'followUs': 'Soro Anyị',
      'subscribe': 'Debanye aha',
      'thankYou': 'Daalụ',
      'apply': 'Tinye akwụkwọ',
      'submit': 'Nyefee',
      'cancel': 'Kagbuo',
      'save': 'Chekwaa',
      'download': 'Budata',
      'required': 'Achọrọ',
      'yes': 'Ee',
      'no': 'Mba',
      'countries': 'Mba'
    }
  },

  zu: {
    // Zulu
    name: 'isiZulu',
    common: {
      'loading': 'Iyalayisha...',
      'error': 'Iphutha lenzekile',
      'backTop': 'Buyela Phezulu',
      'share': 'Yabelana',
      'search': 'Sesha',
      'menu': 'Imenyu',
      'close': 'Vala',
      'open': 'Vula',
      'learnMore': 'Funda Okwengeziwe',
      'getStarted': 'Qala',
      'joinUs': 'Joyina Thina',
      'contactUs': 'Xhumana Nathi',
      'followUs': 'Silandele',
      'subscribe': 'Bhalisela',
      'thankYou': 'Ngiyabonga',
      'apply': 'Faka Isicelo',
      'submit': 'Thumela',
      'cancel': 'Khansela',
      'save': 'Gcina',
      'download': 'Landa',
      'required': 'Kuyadingeka',
      'yes': 'Yebo',
      'no': 'Cha',
      'countries': 'Amazwe'
    }
  },

  xh: {
    // Xhosa
    name: 'isiXhosa',
    common: {
      'loading': 'Iyafaka...',
      'error': 'Impazamo yenzekile',
      'backTop': 'Buyela Phezulu',
      'share': 'Yabelana',
      'search': 'Khangela',
      'menu': 'Imenyu',
      'close': 'Vala',
      'open': 'Vula',
      'learnMore': 'Funda Okungakumbi',
      'getStarted': 'Qala',
      'joinUs': 'Joyina Thina',
      'contactUs': 'Qhagamshelana Nathi',
      'followUs': 'Silandele',
      'subscribe': 'Bhalisa',
      'thankYou': 'Enkosi',
      'apply': 'Faka Isicelo',
      'submit': 'Thumela',
      'cancel': 'Rhoxisa',
      'save': 'Gcina',
      'download': 'Khuphela',
      'required': 'Kuyafuneka',
      'yes': 'Ewe',
      'no': 'Hayi',
      'countries': 'Amazwe'
    }
  },

  af: {
    // Afrikaans
    name: 'Afrikaans',
    common: {
      'loading': 'Laai tans...',
      'error': 'n Fout het voorgekom',
      'backTop': 'Terug na Bo',
      'share': 'Deel',
      'search': 'Soek',
      'menu': 'Spyskaart',
      'close': 'Sluit',
      'open': 'Maak oop',
      'learnMore': 'Leer Meer',
      'getStarted': 'Begin',
      'joinUs': 'Sluit by Ons aan',
      'contactUs': 'Kontak Ons',
      'followUs': 'Volg Ons',
      'subscribe': 'Teken in',
      'thankYou': 'Dankie',
      'apply': 'Aansoek doen',
      'submit': 'Dien in',
      'cancel': 'Kanselleer',
      'save': 'Stoor',
      'download': 'Laai af',
      'required': 'Vereis',
      'yes': 'Ja',
      'no': 'Nee',
      'countries': 'Lande'
    }
  },

  // Langues asiatiques
  th: {
    // Thai
    name: 'ไทย',
    common: {
      'loading': 'กำลังโหลด...',
      'error': 'เกิดข้อผิดพลาด',
      'backTop': 'กลับไปด้านบน',
      'share': 'แชร์',
      'search': 'ค้นหา',
      'menu': 'เมนู',
      'close': 'ปิด',
      'open': 'เปิด',
      'learnMore': 'เรียนรู้เพิ่มเติม',
      'getStarted': 'เริ่มต้น',
      'joinUs': 'เข้าร่วมกับเรา',
      'contactUs': 'ติดต่อเรา',
      'followUs': 'ติดตามเรา',
      'subscribe': 'สมัครสมาชิก',
      'thankYou': 'ขอบคุณ',
      'apply': 'สมัคร',
      'submit': 'ส่ง',
      'cancel': 'ยกเลิก',
      'save': 'บันทึก',
      'download': 'ดาวน์โหลด',
      'required': 'จำเป็น',
      'yes': 'ใช่',
      'no': 'ไม่',
      'countries': 'ประเทศ'
    }
  },

  vi: {
    // Vietnamese
    name: 'Tiếng Việt',
    common: {
      'loading': 'Đang tải...',
      'error': 'Đã xảy ra lỗi',
      'backTop': 'Về đầu trang',
      'share': 'Chia sẻ',
      'search': 'Tìm kiếm',
      'menu': 'Menu',
      'close': 'Đóng',
      'open': 'Mở',
      'learnMore': 'Tìm hiểu thêm',
      'getStarted': 'Bắt đầu',
      'joinUs': 'Tham gia cùng chúng tôi',
      'contactUs': 'Liên hệ với chúng tôi',
      'followUs': 'Theo dõi chúng tôi',
      'subscribe': 'Đăng ký',
      'thankYou': 'Cảm ơn',
      'apply': 'Ứng tuyển',
      'submit': 'Gửi',
      'cancel': 'Hủy',
      'save': 'Lưu',
      'download': 'Tải xuống',
      'required': 'Bắt buộc',
      'yes': 'Có',
      'no': 'Không',
      'countries': 'Quốc gia'
    }
  },

  tl: {
    // Tagalog
    name: 'Tagalog',
    common: {
      'loading': 'Naglo-load...',
      'error': 'May naganap na error',
      'backTop': 'Bumalik sa Itaas',
      'share': 'Ibahagi',
      'search': 'Maghanap',
      'menu': 'Menu',
      'close': 'Isara',
      'open': 'Buksan',
      'learnMore': 'Matuto Pa',
      'getStarted': 'Magsimula',
      'joinUs': 'Sumali sa Amin',
      'contactUs': 'Makipag-ugnayan sa Amin',
      'followUs': 'Sundan Kami',
      'subscribe': 'Mag-subscribe',
      'thankYou': 'Salamat',
      'apply': 'Mag-apply',
      'submit': 'Isumite',
      'cancel': 'Kanselahin',
      'save': 'I-save',
      'download': 'I-download',
      'required': 'Kailangan',
      'yes': 'Oo',
      'no': 'Hindi',
      'countries': 'Mga Bansa'
    }
  },

  ms: {
    // Malay
    name: 'Bahasa Melayu',
    common: {
      'loading': 'Sedang memuatkan...',
      'error': 'Ralat berlaku',
      'backTop': 'Kembali ke Atas',
      'share': 'Kongsi',
      'search': 'Cari',
      'menu': 'Menu',
      'close': 'Tutup',
      'open': 'Buka',
      'learnMore': 'Ketahui Lebih Lanjut',
      'getStarted': 'Mulakan',
      'joinUs': 'Sertai Kami',
      'contactUs': 'Hubungi Kami',
      'followUs': 'Ikuti Kami',
      'subscribe': 'Langgan',
      'thankYou': 'Terima Kasih',
      'apply': 'Mohon',
      'submit': 'Hantar',
      'cancel': 'Batal',
      'save': 'Simpan',
      'download': 'Muat Turun',
      'required': 'Diperlukan',
      'yes': 'Ya',
      'no': 'Tidak',
      'countries': 'Negara'
    }
  },

  id: {
    // Indonesian
    name: 'Bahasa Indonesia',
    common: {
      'loading': 'Memuat...',
      'error': 'Terjadi kesalahan',
      'backTop': 'Kembali ke Atas',
      'share': 'Bagikan',
      'search': 'Cari',
      'menu': 'Menu',
      'close': 'Tutup',
      'open': 'Buka',
      'learnMore': 'Pelajari Lebih Lanjut',
      'getStarted': 'Mulai',
      'joinUs': 'Bergabunglah dengan Kami',
      'contactUs': 'Hubungi Kami',
      'followUs': 'Ikuti Kami',
      'subscribe': 'Berlangganan',
      'thankYou': 'Terima Kasih',
      'apply': 'Ajukan',
      'submit': 'Kirim',
      'cancel': 'Batal',
      'save': 'Simpan',
      'download': 'Unduh',
      'required': 'Wajib',
      'yes': 'Ya',
      'no': 'Tidak',
      'countries': 'Negara'
    }
  },

  // Langues européennes
  cs: {
    // Czech
    name: 'Čeština',
    common: {
      'loading': 'Načítání...',
      'error': 'Došlo k chybě',
      'backTop': 'Zpět nahoru',
      'share': 'Sdílet',
      'search': 'Hledat',
      'menu': 'Nabídka',
      'close': 'Zavřít',
      'open': 'Otevřít',
      'learnMore': 'Dozvědět se více',
      'getStarted': 'Začít',
      'joinUs': 'Připojte se k nám',
      'contactUs': 'Kontaktujte nás',
      'followUs': 'Sledujte nás',
      'subscribe': 'Odebírat',
      'thankYou': 'Děkujeme',
      'apply': 'Přihlásit se',
      'submit': 'Odeslat',
      'cancel': 'Zrušit',
      'save': 'Uložit',
      'download': 'Stáhnout',
      'required': 'Povinné',
      'yes': 'Ano',
      'no': 'Ne',
      'countries': 'Země'
    }
  },

  sk: {
    // Slovak
    name: 'Slovenčina',
    common: {
      'loading': 'Načítava sa...',
      'error': 'Došlo k chybe',
      'backTop': 'Späť hore',
      'share': 'Zdieľať',
      'search': 'Hľadať',
      'menu': 'Ponuka',
      'close': 'Zavrieť',
      'open': 'Otvoriť',
      'learnMore': 'Dozvedieť sa viac',
      'getStarted': 'Začať',
      'joinUs': 'Pripojte sa k nám',
      'contactUs': 'Kontaktujte nás',
      'followUs': 'Sledujte nás',
      'subscribe': 'Odoberať',
      'thankYou': 'Ďakujeme',
      'apply': 'Prihlásiť sa',
      'submit': 'Odoslať',
      'cancel': 'Zrušiť',
      'save': 'Uložiť',
      'download': 'Stiahnúť',
      'required': 'Povinné',
      'yes': 'Áno',
      'no': 'Nie',
      'countries': 'Krajiny'
    }
  },

  hu: {
    // Hungarian
    name: 'Magyar',
    common: {
      'loading': 'Betöltés...',
      'error': 'Hiba történt',
      'backTop': 'Vissza a tetejére',
      'share': 'Megosztás',
      'search': 'Keresés',
      'menu': 'Menü',
      'close': 'Bezárás',
      'open': 'Megnyitás',
      'learnMore': 'Tudjon meg többet',
      'getStarted': 'Kezdés',
      'joinUs': 'Csatlakozzon hozzánk',
      'contactUs': 'Lépjen kapcsolatba velünk',
      'followUs': 'Kövessen minket',
      'subscribe': 'Feliratkozás',
      'thankYou': 'Köszönjük',
      'apply': 'Jelentkezés',
      'submit': 'Beküldés',
      'cancel': 'Mégse',
      'save': 'Mentés',
      'download': 'Letöltés',
      'required': 'Kötelező',
      'yes': 'Igen',
      'no': 'Nem',
      'countries': 'Országok'
    }
  },

  fi: {
    // Finnish
    name: 'Suomi',
    common: {
      'loading': 'Ladataan...',
      'error': 'Virhe tapahtui',
      'backTop': 'Takaisin ylös',
      'share': 'Jaa',
      'search': 'Hae',
      'menu': 'Valikko',
      'close': 'Sulje',
      'open': 'Avaa',
      'learnMore': 'Lue lisää',
      'getStarted': 'Aloita',
      'joinUs': 'Liity meihin',
      'contactUs': 'Ota yhteyttä',
      'followUs': 'Seuraa meitä',
      'subscribe': 'Tilaa',
      'thankYou': 'Kiitos',
      'apply': 'Hae',
      'submit': 'Lähetä',
      'cancel': 'Peruuta',
      'save': 'Tallenna',
      'download': 'Lataa',
      'required': 'Vaaditaan',
      'yes': 'Kyllä',
      'no': 'Ei',
      'countries': 'Maat'
    }
  },

  et: {
    // Estonian
    name: 'Eesti',
    common: {
      'loading': 'Laadimine...',
      'error': 'Tekkis viga',
      'backTop': 'Tagasi üles',
      'share': 'Jaga',
      'search': 'Otsi',
      'menu': 'Menüü',
      'close': 'Sulge',
      'open': 'Ava',
      'learnMore': 'Loe rohkem',
      'getStarted': 'Alusta',
      'joinUs': 'Liitu meiega',
      'contactUs': 'Võta meiega ühendust',
      'followUs': 'Jälgi meid',
      'subscribe': 'Telli',
      'thankYou': 'Aitäh',
      'apply': 'Kandideeri',
      'submit': 'Saada',
      'cancel': 'Tühista',
      'save': 'Salvesta',
      'download': 'Laadi alla',
      'required': 'Nõutav',
      'yes': 'Jah',
      'no': 'Ei',
      'countries': 'Riigid'
    }
  },

  lv: {
    // Latvian
    name: 'Latviešu',
    common: {
      'loading': 'Ielādē...',
      'error': 'Radās kļūda',
      'backTop': 'Atpakaļ uz augšu',
      'share': 'Dalīties',
      'search': 'Meklēt',
      'menu': 'Izvēlne',
      'close': 'Aizvērt',
      'open': 'Atvērt',
      'learnMore': 'Uzzināt vairāk',
      'getStarted': 'Sākt',
      'joinUs': 'Pievienojieties mums',
      'contactUs': 'Sazinieties ar mums',
      'followUs': 'Sekojiet mums',
      'subscribe': 'Abonēt',
      'thankYou': 'Paldies',
      'apply': 'Pieteikties',
      'submit': 'Iesniegt',
      'cancel': 'Atcelt',
      'save': 'Saglabāt',
      'download': 'Lejupielādēt',
      'required': 'Nepieciešams',
      'yes': 'Jā',
      'no': 'Nē',
      'countries': 'Valstis'
    }
  },

  lt: {
    // Lithuanian
    name: 'Lietuvių',
    common: {
      'loading': 'Kraunama...',
      'error': 'Įvyko klaida',
      'backTop': 'Grįžti į viršų',
      'share': 'Dalintis',
      'search': 'Ieškoti',
      'menu': 'Meniu',
      'close': 'Uždaryti',
      'open': 'Atidaryti',
      'learnMore': 'Sužinoti daugiau',
      'getStarted': 'Pradėti',
      'joinUs': 'Prisijungti prie mūsų',
      'contactUs': 'Susisiekti su mumis',
      'followUs': 'Sekti mus',
      'subscribe': 'Prenumeruoti',
      'thankYou': 'Ačiū',
      'apply': 'Kreiptis',
      'submit': 'Pateikti',
      'cancel': 'Atšaukti',
      'save': 'Išsaugoti',
      'download': 'Atsisiųsti',
      'required': 'Privaloma',
      'yes': 'Taip',
      'no': 'Ne',
      'countries': 'Šalys'
    }
  }
};

module.exports = { translationDictionaries };