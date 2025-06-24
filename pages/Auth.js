import fetch from 'isomorphic-unfetch';

export default async (ctx, access) => {
    // Verifica se o objeto ctx.req existe
    if (!ctx.req || !ctx.req.headers) {
        // Em ambiente de build estático, retorna um objeto vazio
        return {};
    }

    const cookies = {};
    const cookieHeader = ctx.req.headers.cookie || '';

    // Processa os cookies apenas se existirem
    cookieHeader.replace(/\s+/, '').split(';').forEach(element => {
        if (element) {
            const parts = element.split("=");
            if (parts.length >= 2) {
                cookies[parts[0]] = parts[1];
            }
        }
    });

    try {
        const response = await fetch('http://localhost:3000/api/session', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                access_token: cookies['access-token'], 
                refresh_token: cookies['refresh-token'], 
                user: access 
            })
        });

        const res = await response.json();

        if (!res || res.err) {
            // Redireciona apenas se estiver no lado do servidor
            if (ctx.res) {
                ctx.res.writeHead(302, { 'Location': '/?signin=true' });
                ctx.res.end();
            }
            return {};
        } 
        
        if (res['access-token'] && ctx.res) {
            ctx.res.setHeader('Set-Cookie', `access-token=${res['access-token']}; Path=/; HttpOnly; SameSite=Lax`);
        }
        
        return res;
    } catch (error) {
        console.error("Auth error:", error);
        return {};
    }
};
