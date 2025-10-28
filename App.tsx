import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateProfessionalImage } from './services/geminiService';
import { Theme, Profession, professions } from './types';
import { 
    SettingsIcon, SunIcon, MoonIcon, 
    DownloadIcon, ProfessionIcon, WarningIcon, 
    ChevronLeftIcon, ChevronRightIcon, CameraIcon,
    GalleryIcon, CloseIcon
} from './components/IconComponents';

// --- TRANSLations ---
const translations: { [key: string]: { [key: string]: string } } = {
  en: {
    title: "Future Me AI", settings: "Settings", theme: "Theme", language: "Language", light: "Light", dark: "Dark", camera: "Camera", noCameras: "No cameras found", close: "Close", heresYourFuture: "Here's Your Future!", download: "Download", chooseProfession: "Choose Your Future Profession", generatingFuture: "Generating your future... This may take a moment.", cameraError: "Camera access is required. Please grant permission in your browser settings.", cameraAccessError: "Could not access the selected camera. Please check permissions or select another camera in settings.", cameraNotReadyError: "Camera is not ready. Please wait a moment and try again.", captureError: "Failed to capture image from camera feed.", unknownError: "An unknown error occurred.", footerEntertainment: "Future Me AI is for entertainment purposes only. Image generation is handled by AI.", footerCopyright: "© 2024. All Rights Reserved.", apiKeyMissing: "API Key Not Configured. Please set up your API_KEY to enable image generation.", liveCamera: "Live Camera", viewGallery: "View Gallery", downloadAll: "Download All", galleryTitle: "Your Future Gallery",
    Policeman: 'Policeman', Firefighter: 'Firefighter', Military: 'Military', Scientist: 'Scientist', Businessman: 'Businessman', Programmer: 'Programmer', Painter: 'Painter', 'Rock Star': 'Rock Star', Musician: 'Musician', Astronaut: 'Astronaut', Dancer: 'Dancer', 'Ballet Dancer': 'Ballet Dancer', Singer: 'Singer', Diver: 'Diver', Builder: 'Builder', Doctor: 'Doctor', Nurse: 'Nurse', Engineer: 'Engineer', 'Supermarket Cashier': 'Supermarket Cashier', 'Fashion Designer': 'Fashion Designer', Farmer: 'Farmer',
    Reporter: 'Reporter', Weatherman: 'Weatherman', 'Basketball Player': 'Basketball Player', 'Soccer Player': 'Soccer Player', 'Football Player': 'Football Player', Teacher: 'Teacher', Runner: 'Runner', Driver: 'Driver', Photographer: 'Photographer',
    DJ: 'DJ', 'Fast Food Worker': 'Fast Food Worker', 'Toy Seller': 'Toy Seller', Pilot: 'Pilot', Postman: 'Postman',
  },
  es: {
    title: "Mi Yo Futuro IA", settings: "Ajustes", theme: "Tema", language: "Idioma", light: "Claro", dark: "Oscuro", camera: "Cámara", noCameras: "No se encontraron cámaras", close: "Cerrar", heresYourFuture: "¡Aquí está tu futuro!", download: "Descargar", chooseProfession: "Elige tu futura profesión", generatingFuture: "Generando tu futuro... Esto puede tomar un momento.", cameraError: "Se requiere acceso a la cámara. Por favor, otorga permiso en la configuración de tu navegador.", cameraAccessError: "No se pudo acceder a la cámara seleccionada. Por favor, verifica los permisos o selecciona otra cámara.", cameraNotReadyError: "La cámara no está lista. Por favor, espera un momento y vuelve a intentarlo.", captureError: "Error al capturar la imagen de la cámara.", unknownError: "Ocurrió un error desconocido.", footerEntertainment: "Mi Yo Futuro IA es solo para fines de entretenimiento. La generación de imágenes es manejada por IA.", footerCopyright: "© 2024. Todos los derechos reservados.", apiKeyMissing: "Clave de API no configurada. Por favor, configura tu API_KEY para habilitar la generación de imágenes.", liveCamera: "Cámara en Vivo", viewGallery: "Ver Galería", downloadAll: "Descargar Todo", galleryTitle: "Tu Galería del Futuro",
    Policeman: 'Policía', Firefighter: 'Bombero', Military: 'Militar', Scientist: 'Científico', Businessman: 'Empresario', Programmer: 'Programador', Painter: 'Pintor', 'Rock Star': 'Estrella de Rock', Musician: 'Músico', Astronaut: 'Astronauta', Dancer: 'Bailarín', 'Ballet Dancer': 'Bailarín de Ballet', Singer: 'Cantante', Diver: 'Buzo', Builder: 'Constructor', Doctor: 'Médico', Nurse: 'Enfermero', Engineer: 'Ingeniero', 'Supermarket Cashier': 'Cajero de Supermercado', 'Fashion Designer': 'Diseñador de Moda', Farmer: 'Granjero',
    Reporter: 'Reportero', Weatherman: 'Meteorólogo', 'Basketball Player': 'Jugador de Baloncesto', 'Soccer Player': 'Futbolista', 'Football Player': 'Jugador de Fútbol Americano', Teacher: 'Profesor', Runner: 'Corredor', Driver: 'Conductor', Photographer: 'Fotógrafo',
    DJ: 'DJ', 'Fast Food Worker': 'Trabajador de Comida Rápida', 'Toy Seller': 'Vendedor de Juguetes', Pilot: 'Piloto', Postman: 'Cartero',
  },
  fr: {
    title: "Mon Futur IA", settings: "Paramètres", theme: "Thème", language: "Langue", light: "Clair", dark: "Sombre", camera: "Caméra", noCameras: "Aucune caméra trouvée", close: "Fermer", heresYourFuture: "Voici votre futur !", download: "Télécharger", chooseProfession: "Choisissez votre future profession", generatingFuture: "Génération de votre futur... Cela peut prendre un moment.", cameraError: "L'accès à la caméra est requis. Veuillez accorder la permission dans les paramètres de votre navigateur.", cameraAccessError: "Impossible d'accéder à la caméra seleccionée. Veuillez vérifier les autorisations ou sélectionner une autre caméra.", cameraNotReadyError: "La caméra n'est pas prête. Veuillez patienter un instant et réessayer.", captureError: "Échec de la capture d'image depuis la caméra.", unknownError: "Une erreur inconnue est survenue.", footerEntertainment: "Mon Futur IA est à des fins de divertissement uniquement. La génération d'images est gérée par l'IA.", footerCopyright: "© 2024. Tous droits réservés.", apiKeyMissing: "Clé API non configurée. Veuillez configurer votre API_KEY pour activer la génération d'images.", liveCamera: "Caméra en Direct", viewGallery: "Voir la galerie", downloadAll: "Tout télécharger", galleryTitle: "Votre galerie du futur",
    Policeman: 'Policier', Firefighter: 'Pompier', Military: 'Militaire', Scientist: 'Scientifique', Businessman: 'Homme d\'affaires', Programmer: 'Programmeur', Painter: 'Peintre', 'Rock Star': 'Rock Star', Musician: 'Musicien', Astronaut: 'Astronaute', Dancer: 'Danseur', 'Ballet Dancer': 'Danseur de Ballet', Singer: 'Chanteur', Diver: 'Plongeur', Builder: 'Constructeur', Doctor: 'Médecin', Nurse: 'Infirmier', Engineer: 'Ingénieur', 'Supermarket Cashier': 'Caissier de Supermarché', 'Fashion Designer': 'Créateur de Mode', Farmer: 'Agriculteur',
    Reporter: 'Reporter', Weatherman: 'Présentateur Météo', 'Basketball Player': 'Joueur de Basket', 'Soccer Player': 'Footballeur', 'Football Player': 'Joueur de Football Américain', Teacher: 'Enseignant', Runner: 'Coureur', Driver: 'Chauffeur', Photographer: 'Photographe',
    DJ: 'DJ', 'Fast Food Worker': 'Employé de Restauration Rapide', 'Toy Seller': 'Vendeur de Jouets', Pilot: 'Pilote', Postman: 'Facteur',
  },
  de: {
    title: "Zukunfts-Ich KI", settings: "Einstellungen", theme: "Thema", language: "Sprache", light: "Hell", dark: "Dunkel", camera: "Kamera", noCameras: "Keine Kameras gefunden", close: "Schließen", heresYourFuture: "Hier ist deine Zukunft!", download: "Herunterladen", chooseProfession: "Wähle deinen zukünftigen Beruf", generatingFuture: "Deine Zukunft wird generiert... Dies kann einen Moment dauern.", cameraError: "Kamerazugriff erforderlich. Bitte erteilen Sie die Erlaubnis in Ihren Browsereinstellungen.", cameraAccessError: "Zugriff auf die ausgewählte Kamera nicht möglich. Bitte Berechtigungen prüfen oder eine andere Kamera auswählen.", cameraNotReadyError: "Kamera ist nicht bereit. Bitte warte einen Moment und versuche es erneut.", captureError: "Fehler beim Erfassen des Bildes von der Kamera.", unknownError: "Ein unbekannter Fehler ist aufgetreten.", footerEntertainment: "Zukunfts-Ich KI dient nur zu Unterhaltungszwecken. Die Bilderzeugung wird von KI übernommen.", footerCopyright: "© 2024. Alle Rechte vorbehalten.", apiKeyMissing: "API-Schlüssel nicht konfiguriert. Bitte richten Sie Ihren API_KEY ein, um die Bilderzeugung zu aktivieren.", liveCamera: "Live-Kamera", viewGallery: "Galerie ansehen", downloadAll: "Alle herunterladen", galleryTitle: "Deine Zukunfts-Galerie",
    Policeman: 'Polizist', Firefighter: 'Feuerwehrmann', Military: 'Militär', Scientist: 'Wissenschaftler', Businessman: 'Geschäftsmann', Programmer: 'Programmierer', Painter: 'Maler', 'Rock Star': 'Rockstar', Musician: 'Musiker', Astronaut: 'Astronaut', Dancer: 'Tänzer', 'Ballet Dancer': 'Balletttänzer', Singer: 'Sänger', Diver: 'Taucher', Builder: 'Bauarbeiter', Doctor: 'Arzt', Nurse: 'Krankenschwester', Engineer: 'Ingenieur', 'Supermarket Cashier': 'Supermarktkassierer', 'Fashion Designer': 'Modedesigner', Farmer: 'Bauer',
    Reporter: 'Reporter', Weatherman: 'Wettermoderator', 'Basketball Player': 'Basketballspieler', 'Soccer Player': 'Fußballspieler', 'Football Player': 'Footballspieler', Teacher: 'Lehrer', Runner: 'Läufer', Driver: 'Fahrer', Photographer: 'Fotograf',
    DJ: 'DJ', 'Fast Food Worker': 'Fast-Food-Mitarbeiter', 'Toy Seller': 'Spielzeugverkäufer', Pilot: 'Pilot', Postman: 'Briefträger',
  },
  ru: {
    title: "Я в будущем ИИ", settings: "Настройки", theme: "Тема", language: "Язык", light: "Светлая", dark: "Темная", camera: "Камера", noCameras: "Камеры не найдены", close: "Закрыть", heresYourFuture: "Вот ваше будущее!", download: "Скачать", chooseProfession: "Выберите свою будущую профессию", generatingFuture: "Создание вашего будущего... Это может занять некоторое время.", cameraError: "Требуется доступ к камере. Пожалуйста, предоставьте разрешение в настройках вашего браузера.", cameraAccessError: "Не удалось получить доступ к выбранной камере. Проверьте разрешения или выберите другую камеру.", cameraNotReadyError: "Камера не готова. Подождите немного и попробуйте снова.", captureError: "Не удалось захватить изображение с камеры.", unknownError: "Произошла неизвестная ошибка.", footerEntertainment: "Я в будущем ИИ предназначено только для развлекательных целей. Генерация изображений осуществляется ИИ.", footerCopyright: "© 2024. Все права защищены.", apiKeyMissing: "API-ключ не настроен. Пожалуйста, настройте свой API_KEY, чтобы включить генерацию изображений.", liveCamera: "Прямая трансляция", viewGallery: "Посмотреть галерею", downloadAll: "Скачать все", galleryTitle: "Ваша галерея будущего",
    Policeman: 'Полицейский', Firefighter: 'Пожарный', Military: 'Военный', Scientist: 'Ученый', Businessman: 'Бизнесмен', Programmer: 'Программист', Painter: 'Художник', 'Rock Star': 'Рок-звезда', Musician: 'Музыкант', Astronaut: 'Астронавт', Dancer: 'Танцор', 'Ballet Dancer': 'Артист балета', Singer: 'Певец', Diver: 'Водолаз', Builder: 'Строитель', Doctor: 'Врач', Nurse: 'Медсестра', Engineer: 'Инженер', 'Supermarket Cashier': 'Кассир', 'Fashion Designer': 'Модельер', Farmer: 'Фермер',
    Reporter: 'Репортер', Weatherman: 'Ведущий прогноза погоды', 'Basketball Player': 'Баскетболист', 'Soccer Player': 'Футболист', 'Football Player': 'Игрок в американский футбол', Teacher: 'Учитель', Runner: 'Бегун', Driver: 'Водитель', Photographer: 'Фотограф',
    DJ: 'Диджей', 'Fast Food Worker': 'Работник Фаст-Фуда', 'Toy Seller': 'Продавец Игрушек', Pilot: 'Пилот', Postman: 'Почтальон',
  },
  he: {
    title: "העתיד שלי AI", settings: "הגדרות", theme: "ערכת נושא", language: "שפה", light: "בהיר", dark: "כהה", camera: "מצלמה", noCameras: "לא נמצאו מצלמות", close: "סגור", heresYourFuture: "הנה העתיד שלך!", download: "הורדה", chooseProfession: "בחר את המקצוע העתידי שלך", generatingFuture: "יוצר את העתיד שלך... זה עשוי לקחת רגע.", cameraError: "נדרשת גישה למצלמה. אנא הענק הרשאה בהגדרות הדפדפן שלך.", cameraAccessError: "לא ניתן לגשת למצלמה שנבחרה. אנא בדוק הרשאות או בחר מצלמה אחרת.", cameraNotReadyError: "המצלמה אינה מוכנה. אנא המתן רגע ונסה שוב.", captureError: "נכשל בלכידת תמונה מהמצלמה.", unknownError: "אירעה שגיאה לא ידועה.", footerEntertainment: "העתיד שלי AI מיועד למטרות בידור בלבד. יצירת התמונות מתבצעת על ידי AI.", footerCopyright: "© 2024. כל הזכויות שמורות.", apiKeyMissing: "מפתח API לא הוגדר. אנא הגדר את מפתח ה-API שלך כדי לאפשר יצירת תמונות.", liveCamera: "מצלמה חיה", viewGallery: "הצג גלריה", downloadAll: "הורד הכל", galleryTitle: "גלריית העתיד שלך",
    Policeman: 'שוטר', Firefighter: 'כבאי', Military: 'חייל', Scientist: 'מדען', Businessman: 'איש עסקים', Programmer: 'מתכנת', Painter: 'צייר', 'Rock Star': 'כוכב רוק', Musician: 'מוזיקאי', Astronaut: 'אסטרונאוט', Dancer: 'רקדן', 'Ballet Dancer': 'רקדן בלט', Singer: 'זמר', Diver: 'צוללן', Builder: 'בנאי', Doctor: 'רופא', Nurse: 'אח/אחות', Engineer: 'מהנדס', 'Supermarket Cashier': 'קופאי', 'Fashion Designer': 'מעצב אופנה', Farmer: 'חקלאי',
    Reporter: 'כתב', Weatherman: 'חזאי', 'Basketball Player': 'כדורסלן', 'Soccer Player': 'כדורגלן', 'Football Player': 'שחקן פוטבול', Teacher: 'מורה', Runner: 'רץ', Driver: 'נהג', Photographer: 'צלם',
    DJ: 'די ג\'יי', 'Fast Food Worker': 'עובד מזון מהיר', 'Toy Seller': 'מוכר צעצועים', Pilot: 'טייס', Postman: 'דוור',
  },
  zh: {
    title: "未来我 AI", settings: "设置", theme: "主题", language: "语言", light: "浅色", dark: "深色", camera: "相机", noCameras: "未找到相机", close: "关闭", heresYourFuture: "这是你的未来！", download: "下载", chooseProfession: "选择你未来的职业", generatingFuture: "正在生成您的未来... 这可能需要一些时间。", cameraError: "需要相机访问权限。请在您的浏览器设置中授予权限。", cameraAccessError: "无法访问所选相机。请检查权限或选择其他相机。", cameraNotReadyError: "相机尚未准备好。请稍候再试。", captureError: "从相机捕获图像失败。", unknownError: "发生未知错误。", footerEntertainment: "未来我 AI 仅供娱乐。图像由 AI 生成。", footerCopyright: "© 2024. 保留所有权利。", apiKeyMissing: "未配置 API 密钥。请设置您的 API_KEY 以启用图像生成。", liveCamera: "实时相机", viewGallery: "查看图库", downloadAll: "全部下载", galleryTitle: "你的未来图库",
    Policeman: '警察', Firefighter: '消防员', Military: '军人', Scientist: '科学家', Businessman: '商人', Programmer: '程序员', Painter: '画家', 'Rock Star': '摇滚明星', Musician: '音乐家', Astronaut: '宇航员', Dancer: '舞者', 'Ballet Dancer': '芭蕾舞者', Singer: '歌手', Diver: '潜水员', Builder: '建筑工人', Doctor: '医生', Nurse: '护士', Engineer: '工程师', 'Supermarket Cashier': '超市收银员', 'Fashion Designer': '时装设计师', Farmer: '农民',
    Reporter: '记者', Weatherman: '天气预报员', 'Basketball Player': '篮球运动员', 'Soccer Player': '足球运动员', 'Football Player': '橄榄球运动员', Teacher: '老师', Runner: '跑步者', Driver: '司机', Photographer: '摄影师',
    DJ: 'DJ', 'Fast Food Worker': '快餐店员', 'Toy Seller': '玩具销售员', Pilot: '飞行员', Postman: '邮递员',
  }
};


// --- SUB-COMPONENTS ---

const Spinner = () => (
    <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const Header = ({ onSettingsClick, title }: { onSettingsClick: () => void; title: string; }) => (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-30 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">{title}</h1>
                <button
                    onClick={onSettingsClick}
                    className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Open settings"
                >
                    <SettingsIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    </header>
);

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    theme: Theme;
    onThemeChange: (theme: Theme) => void;
    cameras: MediaDeviceInfo[];
    selectedCameraId: string | undefined;
    onCameraChange: (deviceId: string) => void;
    language: string;
    onLanguageChange: (lang: string) => void;
    t: (key: string) => string;
}

const SettingsModal = ({ isOpen, onClose, theme, onThemeChange, cameras, selectedCameraId, onCameraChange, language, onLanguageChange, t }: SettingsModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-sm m-4 animate-slide-in-up" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">{t('settings')}</h2>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('theme')}</label>
                    <div className="flex items-center space-x-2 bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
                        <button onClick={() => onThemeChange(Theme.Light)} className={`w-full flex items-center justify-center p-2 rounded-md transition-colors ${theme === Theme.Light ? 'bg-white dark:bg-slate-600 shadow' : 'hover:bg-white/50 dark:hover:bg-slate-600/50'}`}>
                            <SunIcon className="w-5 h-5 mr-2 text-yellow-500" /> {t('light')}
                        </button>
                        <button onClick={() => onThemeChange(Theme.Dark)} className={`w-full flex items-center justify-center p-2 rounded-md transition-colors ${theme === Theme.Dark ? 'bg-white dark:bg-slate-600 shadow' : 'hover:bg-white/50 dark:hover:bg-slate-600/50'}`}>
                            <MoonIcon className="w-5 h-5 mr-2 text-indigo-400" /> {t('dark')}
                        </button>
                    </div>
                </div>
                
                <div className="mb-6">
                    <label htmlFor="language-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('language')}</label>
                    <select
                        id="language-select"
                        value={language}
                        onChange={(e) => onLanguageChange(e.target.value)}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="ru">Русский</option>
                        <option value="he">עברית</option>
                        <option value="zh">中文</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="camera-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('camera')}</label>
                    <select
                        id="camera-select"
                        value={selectedCameraId || ''}
                        onChange={(e) => onCameraChange(e.target.value)}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                        disabled={cameras.length === 0}
                    >
                        {cameras.length > 0 ? (
                            cameras.map((camera) => (
                                <option key={camera.deviceId} value={camera.deviceId}>
                                    {camera.label || `Camera ${camera.deviceId.substring(0, 6)}`}
                                </option>
                            ))
                        ) : (
                            <option>{t('noCameras')}</option>
                        )}
                    </select>
                </div>
                
                <button onClick={onClose} className="w-full mt-6 bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-transform transform hover:scale-105">
                    {t('close')}
                </button>
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---

type HistoryItem = {
    image: string;
    profession: Profession;
};

interface GalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: HistoryItem[];
    onImageSelect: (index: number) => void;
    onDownloadAll: () => void;
    t: (key: string) => string;
}

const GalleryModal = ({ isOpen, onClose, history, onImageSelect, onDownloadAll, t }: GalleryModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
            <div 
                className="bg-slate-100 dark:bg-slate-900 rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] m-4 flex flex-col" 
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white">{t('galleryTitle')}</h2>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onDownloadAll}
                            className="flex items-center justify-center bg-green-500 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-green-600 transition-all transform hover:scale-105"
                        >
                            <DownloadIcon className="w-5 h-5 mr-2" />
                            {t('downloadAll')}
                        </button>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>
                </header>
                <div className="p-4 overflow-y-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {history.map((item, index) => (
                            <div key={index} className="relative group cursor-pointer" onClick={() => onImageSelect(index)}>
                                <img src={`data:image/jpeg;base64,${item.image}`} alt={t(item.profession)} className="w-full h-full object-cover rounded-lg shadow-md" />
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                    <p className="text-white font-bold text-center">{t(item.profession)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

function App() {
    const [theme, setTheme] = useState<Theme>(Theme.Dark);
    const [language, setLanguage] = useState<string>('en');
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
    const [selectedCameraId, setSelectedCameraId] = useState<string | undefined>();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isApiKeyConfigured, setIsApiKeyConfigured] = useState<boolean>(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);

    const videoRef = useRef<HTMLVideoElement>(null);

    const t = useCallback((key: string) => {
        return translations[language]?.[key] || translations['en'][key];
    }, [language]);

    useEffect(() => {
        setIsApiKeyConfigured(!!process.env.API_KEY);
    }, []);

    useEffect(() => {
        if (theme === Theme.Dark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        const getCameras = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true });
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                setCameras(videoDevices);
                if (videoDevices.length > 0) {
                    setSelectedCameraId(prevId => prevId || videoDevices[0].deviceId);
                }
            } catch (err) {
                console.error("Could not enumerate devices:", err);
                setCameraError(t('cameraError'));
            }
        };
        getCameras();
    }, [t]);
    
    useEffect(() => {
        let stream: MediaStream | null = null;
        
        const startCamera = async () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (!selectedCameraId) return;
            try {
                const constraints: MediaStreamConstraints = {
                    video: { 
                        deviceId: { exact: selectedCameraId },
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        facingMode: "user"
                    },
                };
                stream = await navigator.mediaDevices.getUserMedia(constraints);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setCameraError(null);
            } catch (err) {
                console.error("Error accessing camera:", err);
                setCameraError(t('cameraAccessError'));
            }
        };

        startCamera();

        return () => {
            stream?.getTracks().forEach(track => track.stop());
        };
    }, [selectedCameraId, t]);

    const handleGenerate = useCallback(async (profession: Profession) => {
        if (!videoRef.current || videoRef.current.readyState < 2) {
             setError(t('cameraNotReadyError'));
             return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext('2d');
        if (!context) {
            setError(t('captureError'));
            return;
        }
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

        setIsLoading(true);
        setError(null);
        try {
            const base64Data = dataUrl.split(',')[1];
            const result = await generateProfessionalImage(base64Data, profession);
            const newHistoryItem = { image: result, profession };
            setHistory(prev => {
                const newHistory = [...prev, newHistoryItem];
                setCurrentHistoryIndex(newHistory.length - 1);
                return newHistory;
            });
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(t('unknownError'));
            }
        } finally {
            setIsLoading(false);
        }
    }, [t]);

    const handleGoToLive = () => setCurrentHistoryIndex(null);
    const handlePrev = () => {
        if (currentHistoryIndex !== null && currentHistoryIndex > 0) {
            setCurrentHistoryIndex(currentHistoryIndex - 1);
        }
    };
    const handleNext = () => {
        if (currentHistoryIndex !== null && currentHistoryIndex < history.length - 1) {
            setCurrentHistoryIndex(currentHistoryIndex + 1);
        }
    };

    const handleImageSelectFromGallery = (index: number) => {
        setCurrentHistoryIndex(index);
        setIsGalleryOpen(false);
    };

    const handleDownloadAll = useCallback(() => {
        history.forEach((item, index) => {
            const link = document.createElement('a');
            link.href = `data:image/jpeg;base64,${item.image}`;
            link.download = `${t(item.profession).toLowerCase().replace(/\s/g, '-')}-${index + 1}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }, [history, t]);

    const currentImage = currentHistoryIndex !== null ? history[currentHistoryIndex] : null;

    return (
        <div className={`min-h-screen font-sans text-slate-800 dark:text-slate-200`}>
            <Header onSettingsClick={() => setIsSettingsOpen(true)} title={t('title')} />
            
            <main className="container mx-auto p-4 md:p-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* --- LEFT COLUMN: CAMERA / RESULT --- */}
                    <div className="w-full lg:w-1/2 lg:sticky lg:top-24">
                        <div className="relative w-full max-w-2xl bg-slate-200 dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden aspect-video">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className={`w-full h-full object-cover transition-opacity duration-300 ${currentHistoryIndex !== null ? 'opacity-0' : 'opacity-100'}`}
                            />
                            {currentImage && (
                                <div className="absolute inset-0 animate-fade-in">
                                    <img src={`data:image/jpeg;base64,${currentImage.image}`} alt={t(currentImage.profession)} className="w-full h-full object-cover" />
                                    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
                                        <h3 className="text-xl font-bold text-white text-center shadow-lg">{t(currentImage.profession)}</h3>
                                    </div>
                                    {currentHistoryIndex > 0 && (
                                        <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 rounded-full text-white hover:bg-black/60 transition-transform transform hover:scale-110" aria-label="Previous image">
                                            <ChevronLeftIcon className="w-6 h-6" />
                                        </button>
                                    )}
                                    {currentHistoryIndex < history.length - 1 && (
                                        <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 rounded-full text-white hover:bg-black/60 transition-transform transform hover:scale-110" aria-label="Next image">
                                            <ChevronRightIcon className="w-6 h-6" />
                                        </button>
                                    )}
                                </div>
                            )}
                             {cameraError && currentHistoryIndex === null && (
                                <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4">
                                    <p className="text-red-400 text-center">{cameraError}</p>
                                </div>
                            )}
                             {isLoading && (
                                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg animate-fade-in">
                                    <Spinner />
                                    <p className="text-white mt-4 font-semibold text-center px-4">{t('generatingFuture')}</p>
                                </div>
                            )}
                        </div>
                        <div className="flex mt-6 justify-center gap-4 animate-fade-in">
                            {currentImage && (
                                <>
                                    <a
                                        href={`data:image/jpeg;base64,${currentImage.image}`}
                                        download={`${t(currentImage.profession).toLowerCase().replace(/\s/g, '-')}.jpg`}
                                        className="flex items-center justify-center bg-green-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-green-600 transition-all transform hover:scale-105"
                                    >
                                        <DownloadIcon className="w-6 h-6 mr-3" />
                                        {t('download')}
                                    </a>
                                    <button
                                        onClick={handleGoToLive}
                                        className="flex items-center justify-center bg-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-blue-600 transition-all transform hover:scale-105"
                                    >
                                        <CameraIcon className="w-6 h-6 mr-3" />
                                        {t('liveCamera')}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: PROFESSIONS --- */}
                    <div className="w-full lg:w-1/2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">{currentImage ? t('heresYourFuture') : t('chooseProfession')}</h2>
                            {history.length > 0 && (
                                <button
                                    onClick={() => setIsGalleryOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                                    aria-label="View gallery"
                                >
                                    <GalleryIcon className="w-5 h-5" />
                                    <span>{t('viewGallery')}</span>
                                </button>
                            )}
                        </div>
                        {error && <p className="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 p-3 rounded-lg mb-4">{error}</p>}
                        
                        {!isApiKeyConfigured && (
                            <div className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 p-3 rounded-lg mb-4 flex items-center" role="alert">
                                <WarningIcon className="w-6 h-6 mr-3 flex-shrink-0" />
                                <span>{t('apiKeyMissing')}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {professions.map((prof) => (
                                <button
                                    key={prof}
                                    onClick={() => handleGenerate(prof)}
                                    disabled={isLoading || !!cameraError || !isApiKeyConfigured}
                                    className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl hover:scale-105 border-2 border-transparent hover:border-brand-primary dark:hover:border-brand-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:border-transparent"
                                >
                                    <ProfessionIcon profession={prof} />
                                    <span className="text-sm font-semibold text-center text-slate-700 dark:text-slate-300">{t(prof)}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                theme={theme}
                onThemeChange={setTheme}
                cameras={cameras}
                selectedCameraId={selectedCameraId}
                onCameraChange={setSelectedCameraId}
                language={language}
                onLanguageChange={setLanguage}
                t={t}
            />
            
            <GalleryModal
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                history={history}
                onImageSelect={handleImageSelectFromGallery}
                onDownloadAll={handleDownloadAll}
                t={t}
            />

            <footer className="text-center p-4 text-xs text-slate-500 dark:text-slate-400">
                <p>{t('footerEntertainment')}</p>
                <p>{t('footerCopyright')}</p>
            </footer>
        </div>
    );
}

export default App;