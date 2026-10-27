import { correr } from './proc.js';

export async function ffmpeg(args, opts = {}) {
  return correr('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { timeoutMs: 10 * 60 * 1000, ...opts });
}

export async function ffprobe(archivo) {
  const { out } = await correr('ffprobe', ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', archivo]);
  return JSON.parse(out);
}

export async function duracion(archivo) {
  const info = await ffprobe(archivo);
  return Number(info.format.duration);
}

export async function resumenVideo(archivo) {
  const info = await ffprobe(archivo);
  const v = info.streams.find((s) => s.codec_type === 'video') || {};
  const a = info.streams.find((s) => s.codec_type === 'audio');
  const [num, den] = String(v.r_frame_rate || '0/1').split('/').map(Number);
  return {
    duracion: Number(info.format.duration),
    bytes: Number(info.format.size),
    ancho: v.width,
    alto: v.height,
    fps: den ? Math.round((num / den) * 100) / 100 : null,
    codecVideo: v.codec_name,
    codecAudio: a ? a.codec_name : null,
    audioHz: a ? Number(a.sample_rate) : null,
  };
}

// Escapa una ruta para usarla dentro de un filtro de ffmpeg.
export function escaparRutaFiltro(ruta) {
  return ruta.replace(/\\/g, '/').replace(/:/g, '\\:').replace(/'/g, "\\'");
}

export function escaparTextoFiltro(texto) {
  return texto.replace(/\\/g, '\\\\').replace(/:/g, '\\:').replace(/'/g, "\\'").replace(/%/g, '\\%');
}
