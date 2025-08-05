export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) return res.status(400).send('Thiếu URL tải');

  try {
    const response = await fetch(decodeURIComponent(url));

    if (!response.ok) {
      return res.status(500).send('Không tải được video.');
    }

    const buffer = await response.arrayBuffer(); // Đọc toàn bộ video

    res.setHeader('Content-Disposition', 'attachment; filename="tiktok.mp4"');
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Length', buffer.byteLength);

    res.status(200).send(Buffer.from(buffer)); // Gửi về trình duyệt
  } catch (err) {
    console.error('Lỗi tải video:', err);
    res.status(500).send('Lỗi server.');
  }
}


