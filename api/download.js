export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).send("Thiếu URL");

  try {
    res.writeHead(302, {
      Location: url,
      'Content-Disposition': 'attachment; filename="video.mp4"'
    });
    res.end();
  } catch (err) {
    console.error("Lỗi tải:", err.message);
    res.status(500).send("Không tải được video.");
  }
}




