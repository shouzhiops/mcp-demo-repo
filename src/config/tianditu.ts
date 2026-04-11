const envKey = import.meta.env.VITE_TIANDITU_KEY;

export const TIANDITU_KEY = typeof envKey === 'string' ? envKey.trim() : '';

export const hasTiandituKey = TIANDITU_KEY.length > 0;

