import { spawn } from 'node:child_process';

// Corre un programa externo y devuelve { out, err }. Falla con un error legible.
export function correr(cmd, args, { input, timeoutMs = 0, cwd } = {}) {
  return new Promise((resolve, reject) => {
    let p;
    try {
      p = spawn(cmd, args, { cwd, stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });
    } catch (e) {
      return reject(e);
    }
    let out = '';
    let err = '';
    p.stdout.on('data', (d) => { out += d; });
    p.stderr.on('data', (d) => { err += d; });
    let timer = null;
    if (timeoutMs) {
      timer = setTimeout(() => {
        p.kill('SIGKILL');
        reject(new Error(`${cmd} superó los ${Math.round(timeoutMs / 1000)} s y se canceló`));
      }, timeoutMs);
    }
    p.on('error', (e) => {
      if (timer) clearTimeout(timer);
      if (e.code === 'ENOENT') e = new Error(`No encuentro el programa "${cmd}". ¿Está instalado y en el PATH?`);
      reject(e);
    });
    p.on('close', (code) => {
      if (timer) clearTimeout(timer);
      if (code === 0) return resolve({ out, err });
      const e = new Error(`${cmd} ${args.slice(0, 2).join(' ')} terminó con código ${code}\n${err.trim().slice(-1500)}`);
      Object.assign(e, { code, out, err });
      reject(e);
    });
    if (input != null) p.stdin.write(input);
    p.stdin.end();
  });
}
