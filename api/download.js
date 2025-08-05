// pages/api/download.js hoặc api/download/index.js
export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('Thiếu URL tải');
  }

  try {
    const response = await fetch(decodeURIComponent(url));

    if (!response.ok) {
      return res.status(500).send('Không tải được video.');
    }

    // Forward headers để trình duyệt hiểu là file tải
    res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
    res.setHeader('Content-Type', 'video/mp4');

    // Stream video về client
    response.body.pipe(res);
  } catch (error) {
    console.error('Lỗi tải video:', error);
    res.status(500).send('Lỗi tải video.');
  }
}
