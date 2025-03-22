import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// Import translations
const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        menu: 'Menu',
        reserve: 'Reserve',
        contact: 'Contact',
        signIn: 'Sign In',
        myAccount: 'My Account',
        myOrders: 'My Orders',
        logout: 'Logout'
      }
    }
  },
  si: {
    translation: {
      nav: {
        home: 'මුල් පිටුව',
        menu: 'මෙනු',
        reserve: 'වෙන්කරවා ගන්න',
        contact: 'සම්බන්ධ වන්න',
        signIn: 'පිවිසෙන්න',
        myAccount: 'මගේ ගිණුම',
        myOrders: 'මගේ ඇණවුම්',
        logout: 'පිටවීම'
      }
    }
  },
  ta: {
    translation: {
      nav: {
        home: 'முகப்பு',
        menu: 'மெனு',
        reserve: 'முன்பதிவு',
        contact: 'தொடர்பு',
        signIn: 'உள்நுழைக',
        myAccount: 'எனது கணக்கு',
        myOrders: 'எனது ஆர்டர்கள்',
        logout: 'வெளியேறு'
      }
    }
  }
};
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already safes from XSS
    }
  });
export default i18n;    