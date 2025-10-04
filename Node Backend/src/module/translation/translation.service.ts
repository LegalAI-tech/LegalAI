import prisma from '../../config/database.js';
import pythonBackend from '../../services/python-backend.service.js';
import cacheService from '../../services/cache.service.js';

class TranslationService {
  async translate(
    userId: string,
    text: string,
    sourceLang: string,
    targetLang: string
  ) {
    // Check cache first
    const cached = await cacheService.getTranslation(text, sourceLang, targetLang);
    
    if (cached) {
      return {
        sourceText: text,
        translatedText: cached,
        sourceLang,
        targetLang,
        cached: true,
      };
    }

    // Call Python backend
    const result = await pythonBackend.translate(text, sourceLang, targetLang);

    const translatedText = result.translated_text || result.translation || result.text;

    // Save to database
    await prisma.translation.create({
      data: {
        userId,
        sourceText: text,
        translatedText,
        sourceLang,
        targetLang,
        metadata: result.metadata || {},
      },
    });

    // Cache the translation
    await cacheService.cacheTranslation(text, sourceLang, targetLang, translatedText);

    return {
      sourceText: text,
      translatedText,
      sourceLang,
      targetLang,
      cached: false,
    };
  }

  async detectLanguage(text: string) {
    const result = await pythonBackend.detectLanguage(text);
    return result;
  }

  async getUserTranslations(userId: string) {
    const translations = await prisma.translation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return translations;
  }
}

export default new TranslationService();