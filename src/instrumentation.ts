import "./console"

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        //await import('./console.js')
    }

    if (process.env.NEXT_RUNTIME === 'edge') {

    }
}
