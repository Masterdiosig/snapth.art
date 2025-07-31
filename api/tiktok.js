import axios from 'axios';

const followRedirect = async (shortUrl) => {
  try {
    const response = await axios.get(shortUrl, {
      maxRedirects: 5,
      timeout: 5000,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });
    return response.request?.res?.responseUrl || shortUrl;
  } catch (err) {
    console.warn("⚠️ Lỗi redirect:", err.message);
    return shortUrl;
  }
};

const handler = async (req, res) => {
  const allowedOrigins = ['https://snapth.vercel.app', 'https://snapth.art'];
  const secretToken = process.env.API_SECRET_TOKEN;
  const origin = req.headers.origin || req.headers.referer || '';
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();

  // ✅ CORS
  if (allowedOrigins.some(o => origin.startsWith(o))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    console.warn('⛔ Bị chặn: sai domain:', origin);
    return res.status(403).json({ error: 'Forbidden - Invalid origin' });
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 🔐 Token
  if (!token || token !== secretToken) {
    console.warn('⛔ Bị chặn: sai token:', token);
    return res.status(403).json({ error: 'Forbidden - Invalid token' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url) return res.status(400).json({ code: 1, message: "Thiếu URL" });

  const finalUrl = await followRedirect(url);
  console.log("🔗 Final TikTok URL:", finalUrl);

  try {
    const response = await axios.get('https://tiktok-download-video1.p.rapidapi.com/getVideo', {
      params: { videoUrl: finalUrl },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'tiktok-video-downloader-api.p.rapidapi.com'
      }
    });

    const data = response.data?.data || {};
    const videoHD = data.hdplay;
    const videoSD = data.play;
    const videoWM = data.wmplay;
    const audio = data.music;

    if (!videoHD && !videoSD && !videoWM && !audio) {
      return res.status(200).json({
        code: 2,
        message: "❌ Không lấy được video",
        raw: data
      });
    }

    return res.status(200).json({
      code: 0,
      data: [
        ...(videoSD ? [{ url: videoSD, label: "Tải không watermark" }] : []),
        ...(videoHD ? [{ url: videoHD, label: "Tải HD" }] : []),
        ...(audio ? [{ url: audio, label: "Tải nhạc" }] : [])
      ],
      meta: {
        thumbnail: data.cover,
        description: data.title,
        author: data.author?.nickname || data.author?.unique_id || ''
      }
    });
  } catch (err) {
    console.error("❌ Lỗi gọi API:", err.response?.data || err.message);
    return res.status(500).json({
      code: 500,
      message: "Lỗi server khi gọi RapidAPI",
      error: err.response?.data || err.message
    });
  }
};

export default handler;


