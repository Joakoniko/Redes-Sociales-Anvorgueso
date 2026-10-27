// Configuración central del proyecto. Todo lo que un rol pueda querer ajustar vive acá.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const DIRS = {
  idea: path.join(ROOT, 'content', 'idea'),
  guion: path.join(ROOT, 'content', 'guion'),
  render: path.join(ROOT, 'content', 'render'),
  listo: path.join(ROOT, 'content', 'listo'),
  publicado: path.join(ROOT, 'content', 'publicado'),
  personajes: path.join(ROOT, 'personajes'),
  assets: path.join(ROOT, 'assets'),
  voces: path.join(ROOT, 'assets', 'voces', 'piper'),
  cache: path.join(ROOT, '.cache'),
};

// Formato de salida: vertical 9:16 para TikTok, Reels, Shorts y Facebook.
export const VIDEO = {
  ancho: 1080,
  alto: 1920,
  fps: 30,
  aire: 0.4, // segundos de silencio que se suman después de cada frase
  crf: 20,
  preset: 'medium',
  audioBitrate: '160k',
  audioHz: 48000,
  duracionMaxima: 60,
  pesoMaximoMB: 50,
};

// Zona segura: nada importante fuera de este rectángulo (la interfaz de las apps tapa los bordes).
export const ZONA_SEGURA = { arriba: 220, abajo: 300, lados: 100 };

// Marca de agua obligatoria.
export const MARCA = {
  texto: '@anvorgueso.cat',
  x: 48,
  y: 150,
  tam: 44,
  alpha: 0.85,
  sombra: 0.55,
};

export const PERSONAJE_BASE = { ancho: 860 }; // tamaño del personaje en pantalla a escala 1

export const FONDOS = {
  rosa: '#FFF1F8',
  verde: '#EAF8E6',
  crema: '#FFF4E2',
  celeste: '#EAF4FB',
  papel: '#F6F4FA',
  lila: '#F1ECFA',
  noche: '#1E1B2E',
};

export const TEXTO = {
  tam: 78,
  maxCaracteres: 20,
  color: '#FFFFFF',
  borde: '#1A1A1E',
  colorSobreClaro: '#1A1A1E',
  bordeSobreClaro: '#FFFFFF',
};

// Subtítulos de la voz: aparecen de a grupos de palabras y la palabra que suena va resaltada.
export const SUBTITULOS = {
  activos: true,
  tam: 64,
  palabrasPorGrupo: 3,
  color: '#FFFFFF',
  resaltado: '#FFE63C',
  borde: '#1A1A1E',
  y: 1440, // borde superior del bloque, por encima de la zona que tapa la interfaz
};

// Entrada de cada escena: el personaje "aparece" con un pequeño rebote de escala.
export const TRANSICION = { pop: 0.18 };

export const FUENTE = {
  archivo: path.join(ROOT, 'assets', 'fonts', 'DejaVuSans-Bold.ttf'),
  familia: 'DejaVu Sans',
};

// Python para los TTS: ANV_PYTHON, o el entorno virtual .venv del repo si existe, o el del sistema.
const PYTHON_VENV = process.platform === 'win32'
  ? path.join(ROOT, '.venv', 'Scripts', 'python.exe')
  : path.join(ROOT, '.venv', 'bin', 'python');
export const PYTHON_ES_VENV = !process.env.ANV_PYTHON && fs.existsSync(PYTHON_VENV);
export const PYTHON = process.env.ANV_PYTHON || (fs.existsSync(PYTHON_VENV) ? PYTHON_VENV : (process.platform === 'win32' ? 'python' : 'python3'));

// Voz Piper de respaldo (español, liviana, publicada en GitHub por el proyecto Piper).
export const PIPER_RESPALDO = {
  nombre: 'es-carlfm-x-low',
  url: 'https://github.com/rhasspy/piper/releases/download/v0.0.2/voice-es-carlfm-x-low.tar.gz',
};

export const PLATAFORMAS = {
  tiktok: { nombre: 'TikTok', maxSeg: 60, donde: 'App de TikTok o TikTok Studio (web). Se puede programar hasta 10 días.' },
  instagram: { nombre: 'Instagram Reels', maxSeg: 90, donde: 'Meta Business Suite (programa Instagram y Facebook juntos).' },
  shorts: { nombre: 'YouTube Shorts', maxSeg: 60, donde: 'YouTube Studio. Poner #Shorts en el título.' },
  facebook: { nombre: 'Facebook Reels', maxSeg: 90, donde: 'Meta Business Suite, junto con Instagram.' },
};

export const HORARIOS_SUGERIDOS = ['12:00 a 14:00 (hora de Buenos Aires)', '20:00 a 23:00 (hora de Buenos Aires)'];
