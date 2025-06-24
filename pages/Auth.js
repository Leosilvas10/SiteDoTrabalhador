import fetch from 'isomorphic-unfetch';

export default async (ctx, access) => {
    if (!ctx.req || !ctx.req.headers) {
        return null; // Alterado para null
    }

    // ... código existente ...

    try {
        // ... código existente ...
        
        if (!res || res.err) {
            if (ctx.res) {
                ctx.res.writeHead(302, { 'Location': '/?signin=true' });
                ctx.res.end();
            }
            return null; // Alterado para null
        }
        
        // ... código existente ...
        
    } catch (error) {
        console.error("Auth error:", error);
        return null; // Alterado para null
    }
};
