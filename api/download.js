export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) return res.status(400).send('Thiếu URL tải');

  try {
    const response = await fetch(decodeURIComponent(url));

    if (!response.ok) {
      return res.status(500).send('Không tải được video.');
    }

    // Thiết lập headers để buộc trình duyệt tải file
    res.setHeader('Content-Disposition', 'attachment; filename="tiktok.mp4"');
    res.setHeader('Content-Type', 'video/mp4');

    // Stream nội dung video từ TikTok về client
    const reader = response.body.getReader();
    const encoder = new TextEncoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  } catch (err) {
    console.error('Lỗi tải video:', err);
    res.status(500).send('Lỗi server.');
  }
}

