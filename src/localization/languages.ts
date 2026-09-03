import { LanguageCode, LanguageInfo } from '../types';

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
];

export interface LocaleTranslations {
  siteTitle: string;
  tagline: string;
  headline: string;
  supportingText: string;
  searchPlaceholder: string;
  searchButton: string;
  searchExamplesLabel: string;
  trendingLabel: string;
  bestOverall: string;
  bestValue: string;
  premiumPick: string;
  whyRecommended: string;
  strengths: string;
  drawback: string;
  whoItIsFor: string;
  priceUnverified: string;
  checkPrice: string;
  viewDetails: string;
  visitOfficial: string;
  contact: string;
  book: string;
  sourcesLabel: string;
  comparisonVs: string;
  comparisonFactors: string;
  verdict: string;
  mainCompromise: string;
  noResultsTitle: string;
  noResultsDesc: string;
  marketLabel: string;
  languageLabel: string;
  affiliateNotice: string;
  footerAbout: string;
  footerContact: string;
  footerPrivacy: string;
  footerTerms: string;
  footerAffiliate: string;
  backToHome: string;
}

export const TRANSLATIONS: Record<LanguageCode, LocaleTranslations> = {
  en: {
    siteTitle: 'ProductReviews.review',
    tagline: 'Universal Search & Decision Engine',
    headline: 'Search. Compare. Decide.',
    supportingText:
      'Find the right products, services, brands, software, places and more — based on what actually matters to you.',
    searchPlaceholder: 'What are you looking for?',
    searchButton: 'Search',
    searchExamplesLabel: 'Try searching for:',
    trendingLabel: 'Popular searches:',
    bestOverall: 'Best Overall',
    bestValue: 'Best Value',
    premiumPick: 'Premium Pick',
    whyRecommended: 'Why this is recommended',
    strengths: 'Key Strengths',
    drawback: 'Main Drawback',
    whoItIsFor: 'Best For',
    priceUnverified: 'Price unverified — check live at retailer',
    checkPrice: 'Check Live Price',
    viewDetails: 'View Details',
    visitOfficial: 'Visit Official Website',
    contact: 'Contact Directly',
    book: 'Book Now',
    sourcesLabel: 'Official & Reference Sources',
    comparisonVs: 'VS',
    comparisonFactors: 'Key Decision Factors',
    verdict: 'Decision Verdict',
    mainCompromise: 'Main Compromise',
    noResultsTitle: 'No suitable results found for this search',
    noResultsDesc:
      'To maintain strict data integrity, we never fabricate placeholder products or unverified scores. Please adjust your search terms.',
    marketLabel: 'Market / Country',
    languageLabel: 'Language',
    affiliateNotice:
      'As an Amazon Associate, we may earn from qualifying purchases at no extra cost to you. Recommendations are never influenced by commissions.',
    footerAbout: 'About Us',
    footerContact: 'Contact Us',
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Terms of Use',
    footerAffiliate: 'Affiliate Disclosure',
    backToHome: 'Back to Search',
  },
  hi: {
    siteTitle: 'ProductReviews.review',
    tagline: 'यूनिवर्सल सर्च और निर्णय इंजन',
    headline: 'सर्च करें. तुलना करें. निर्णय लें.',
    supportingText:
      'सही उत्पाद, सेवाएं, ब्रांड्स, सॉफ़्टवेयर और स्थान खोजें — बिना किसी पक्षपात के।',
    searchPlaceholder: 'आप क्या तलाश रहे हैं?',
    searchButton: 'खोजें',
    searchExamplesLabel: 'इनके लिए सर्च करें:',
    trendingLabel: 'लोकप्रिय सर्च:',
    bestOverall: 'सर्वश्रेष्ठ समग्र',
    bestValue: 'उत्तम मूल्य',
    premiumPick: 'प्रीमियम विकल्प',
    whyRecommended: 'यह सिफारिश क्यों की गई है',
    strengths: 'प्रमुख विशेषताएं',
    drawback: 'मुख्य कमी',
    whoItIsFor: 'किसके लिए उपयुक्त',
    priceUnverified: 'कीमत असत्यापित — विक्रेता पर लाइव जांचें',
    checkPrice: 'लाइव कीमत देखें',
    viewDetails: 'विवरण देखें',
    visitOfficial: 'आधिकारिक वेबसाइट पर जाएं',
    contact: 'सीधा संपर्क करें',
    book: 'अभी बुक करें',
    sourcesLabel: 'आधिकारिक और संदर्भ स्रोत',
    comparisonVs: 'बनाम',
    comparisonFactors: 'महत्वपूर्ण निर्णय कारक',
    verdict: 'निर्णय निष्कर्ष',
    mainCompromise: 'मुख्य समझौता',
    noResultsTitle: 'इस खोज के लिए उपयुक्त परिणाम नहीं मिले',
    noResultsDesc:
      'हम कभी भी कृत्रिम डेटा नहीं दिखाते। कृपया अपने सर्च कीवर्ड को समायोजित करें।',
    marketLabel: 'देश / बाज़ार',
    languageLabel: 'भाषा',
    affiliateNotice:
      'Amazon एसोसिएट के रूप में हम योग्य खरीदारी पर कमा सकते हैं। हमारी सिफारिशें पूरी तरह निष्पक्ष हैं।',
    footerAbout: 'हमारे बारे में',
    footerContact: 'संपर्क करें',
    footerPrivacy: 'गोपनीयता नीति',
    footerTerms: 'उपयोग की शर्तें',
    footerAffiliate: 'सहबद्ध प्रकटीकरण',
    backToHome: 'होम पर लौटें',
  },
  es: {
    siteTitle: 'ProductReviews.review',
    tagline: 'Motor Universal de Búsqueda y Decisión',
    headline: 'Busca. Compara. Decide.',
    supportingText:
      'Encuentra los productos, servicios, marcas, software y lugares adecuados, según lo que realmente te importa.',
    searchPlaceholder: '¿Qué estás buscando?',
    searchButton: 'Buscar',
    searchExamplesLabel: 'Prueba buscando:',
    trendingLabel: 'Búsquedas populares:',
    bestOverall: 'Mejor en General',
    bestValue: 'Mejor Relación Calidad-Precio',
    premiumPick: 'Elección Premium',
    whyRecommended: 'Por qué se recomienda',
    strengths: 'Puntos Fuertes',
    drawback: 'Principal Desventaja',
    whoItIsFor: 'Ideal Para',
    priceUnverified: 'Precio sin verificar — consultar en la tienda',
    checkPrice: 'Consultar Precio',
    viewDetails: 'Ver Detalles',
    visitOfficial: 'Visitar Sitio Oficial',
    contact: 'Contactar',
    book: 'Reservar',
    sourcesLabel: 'Fuentes y Referencias',
    comparisonVs: 'VS',
    comparisonFactors: 'Factores Clave de Decisión',
    verdict: 'Veredicto de Decisión',
    mainCompromise: 'Compromiso Principal',
    noResultsTitle: 'No se encontraron resultados adecuados para esta búsqueda',
    noResultsDesc:
      'Mantenemos una estricta integridad de datos y nunca inventamos información.',
    marketLabel: 'Mercado / País',
    languageLabel: 'Idioma',
    affiliateNotice:
      'Como asociados de Amazon, podemos recibir ingresos por compras elegibles sin costo adicional para ti.',
    footerAbout: 'Sobre Nosotros',
    footerContact: 'Contacto',
    footerPrivacy: 'Política de Privacidad',
    footerTerms: 'Términos de Uso',
    footerAffiliate: 'Divulgación de Afiliados',
    backToHome: 'Volver a Buscar',
  },
  it: {
    siteTitle: 'ProductReviews.review',
    tagline: 'Motore Universale di Ricerca e Decisione',
    headline: 'Cerca. Confronta. Decidi.',
    supportingText:
      'Trova i migliori prodotti, servizi, software e luoghi in base a ciò che conta davvero per te.',
    searchPlaceholder: 'Cosa stai cercando?',
    searchButton: 'Cerca',
    searchExamplesLabel: 'Prova a cercare:',
    trendingLabel: 'Ricerche popolari:',
    bestOverall: 'Migliore in Assoluto',
    bestValue: 'Miglior Rapporto Qualità-Prezzo',
    premiumPick: 'Scelta Premium',
    whyRecommended: 'Perché è consigliato',
    strengths: 'Punti di Forza',
    drawback: 'Svantaggio Principale',
    whoItIsFor: 'Ideale Per',
    priceUnverified: 'Prezzo non verificato — controlla dal venditore',
    checkPrice: 'Verifica Prezzo',
    viewDetails: 'Dettagli',
    visitOfficial: 'Sito Ufficiale',
    contact: 'Contatta',
    book: 'Prenota',
    sourcesLabel: 'Fonti e Riferimenti',
    comparisonVs: 'VS',
    comparisonFactors: 'Fattori di Decisione',
    verdict: 'Verdetto',
    mainCompromise: 'Compromesso Principale',
    noResultsTitle: 'Nessun risultato trovato per questa ricerca',
    noResultsDesc: 'Non fabbrichiamo mai dati non attendibili.',
    marketLabel: 'Mercato / Paese',
    languageLabel: 'Lingua',
    affiliateNotice:
      'In qualità di affiliato Amazon, possiamo ricevere un compagno per gli acquisti idonei senza costi aggiuntivi.',
    footerAbout: 'Chi Siamo',
    footerContact: 'Contattaci',
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Termini di Servizio',
    footerAffiliate: 'Divulgazione Affiliazione',
    backToHome: 'Torna alla Ricerca',
  },
  fr: {
    siteTitle: 'ProductReviews.review',
    tagline: 'Moteur Universel de Recherche & Décision',
    headline: 'Cherchez. Comparez. Décidez.',
    supportingText:
      'Trouvez les bons produits, services, marques et logiciels selon ce qui compte vraiment pour vous.',
    searchPlaceholder: 'Que recherchez-vous ?',
    searchButton: 'Rechercher',
    searchExamplesLabel: 'Exemples de recherche :',
    trendingLabel: 'Recherches populaires :',
    bestOverall: 'Meilleur Choix Global',
    bestValue: 'Meilleur Rapport Qualité/Prix',
    premiumPick: 'Choix Haut de Gamme',
    whyRecommended: 'Pourquoi ce choix',
    strengths: 'Points Forts',
    drawback: 'Inconvénient Majeur',
    whoItIsFor: 'Idéal Pour',
    priceUnverified: 'Prix non vérifié — consulter chez le marchand',
    checkPrice: 'Vérifier le Prix',
    viewDetails: 'Détails',
    visitOfficial: 'Site Officiel',
    contact: 'Contacter',
    book: 'Réserver',
    sourcesLabel: 'Sources et Références',
    comparisonVs: 'VS',
    comparisonFactors: 'Critères Décisifs',
    verdict: 'Verdict',
    mainCompromise: 'Compromis Majeur',
    noResultsTitle: 'Aucun résultat adéquat trouvé pour cette recherche',
    noResultsDesc: 'Nous ne fabriquons jamais de faux produits ou faux scores.',
    marketLabel: 'Marché / Pays',
    languageLabel: 'Langue',
    affiliateNotice:
      'En tant que Partenaire Amazon, nous pouvons réaliser un bénéfice sur les achats remplissant les conditions requises.',
    footerAbout: 'À Propos',
    footerContact: 'Contact',
    footerPrivacy: 'Politique de Confidentialité',
    footerTerms: 'Conditions Générales',
    footerAffiliate: 'Déclaration d’Affiliation',
    backToHome: 'Retour à la recherche',
  },
  de: {
    siteTitle: 'ProductReviews.review',
    tagline: 'Universelle Such- und Entscheidungsmaschine',
    headline: 'Suchen. Vergleichen. Entscheiden.',
    supportingText:
      'Finden Sie die passenden Produkte, Dienstleistungen, Software und Orte — basierend auf Ihren echten Prioritäten.',
    searchPlaceholder: 'Wonach suchen Sie?',
    searchButton: 'Suchen',
    searchExamplesLabel: 'Suchbeispiele:',
    trendingLabel: 'Beliebte Suchen:',
    bestOverall: 'Testsieger / Bester Gesamteindruck',
    bestValue: 'Preis-Leistungs-Sieger',
    premiumPick: 'Premium-Empfehlung',
    whyRecommended: 'Warum wir dies empfehlen',
    strengths: 'Vorteile',
    drawback: 'Größter Nachteil',
    whoItIsFor: 'Ideal Für',
    priceUnverified: 'Preis nicht verifiziert — beim Händler prüfen',
    checkPrice: 'Preis Prüfen',
    viewDetails: 'Details',
    visitOfficial: 'Offizielle Website',
    contact: 'Kontaktieren',
    book: 'Buchen',
    sourcesLabel: 'Offizielle Quellen & Referenzen',
    comparisonVs: 'VS',
    comparisonFactors: 'Entscheidungsfaktoren',
    verdict: 'Fazit & Empfehlung',
    mainCompromise: 'Größter Kompromiss',
    noResultsTitle: 'Keine passenden Ergebnisse gefunden',
    noResultsDesc: 'Wir erstellen niemals gefälschte Produktdaten oder synthetische Bewertungen.',
    marketLabel: 'Land / Markt',
    languageLabel: 'Sprache',
    affiliateNotice:
      'Als Amazon-Partner verdienen wir an qualifizierten Verkäufen ohne zusätzliche Kosten für Sie.',
    footerAbout: 'Über Uns',
    footerContact: 'Kontakt',
    footerPrivacy: 'Datenschutzerklärung',
    footerTerms: 'Nutzungsbedingungen',
    footerAffiliate: 'Partnerhinweis',
    backToHome: 'Zurück zur Suche',
  },
};

export function getTranslation(lang: LanguageCode): LocaleTranslations {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
