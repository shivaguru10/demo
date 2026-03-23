export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
    const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
        return res.status(500).json({ error: 'Missing Upstash configuration' });
    }

    const key = 'creativepluz_views';

    try {
        if (req.method === 'POST') {
            // Increment view count
            const response = await fetch(`${UPSTASH_URL}/incr/${key}`, {
                headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
            });
            const data = await response.json();
            return res.status(200).json({ views: data.result });
        } else {
            // GET - just fetch current count
            const response = await fetch(`${UPSTASH_URL}/get/${key}`, {
                headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
            });
            const data = await response.json();
            return res.status(200).json({ views: data.result || 0 });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Failed to update views' });
    }
}
