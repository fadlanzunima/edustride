import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
 
// Can be imported from a shared config
export const locales = ['id', 'en'];
export const defaultLocale = 'id';
 
export default getRequestConfig(async ({requestLocale}) => {
  // Validate that the incoming `locale` parameter is valid
  let locale = await requestLocale;
  
  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale;
  }
 
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
