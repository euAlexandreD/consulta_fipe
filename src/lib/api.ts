const BRASIL_API_URL = import.meta.env.VITE_BRASIL_API_URL ?? 'https://brasilapi.com.br'

export async function apiFetch(path: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers);
    headers.set('Accept', 'application/json')

    if(options.body && !(options.body instanceof FormData)){
        headers.set('Content-Type', 'application/json')
    }

    return fetch(`${BRASIL_API_URL}${path}`, {...options, headers})
}