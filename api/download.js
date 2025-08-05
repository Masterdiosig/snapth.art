export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) return res.status(400).send('Thiếu URL tải');

  try {
    const decodedUrl = decodeURIComponent(url);

    const response = await fetch(decodedUrl);

    if (!response.ok) {
      return res.status(500).send('Không tải được video.');
    }

    // Thiết lập headers để buộc tải file về
    res.setHeader('Content-Disposition', 'attachment; filename="tiktok.mp4"');
    res.setHeader('Content-Type', 'video/mp4');

    // Stream nội dung video về client
    const reader = response.body.getReader();

    const stream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.close();
      }
    });

    const streamRes = new Response(stream);
    streamRes.body.pipeTo(res);
  } catch (err) {
    console.error('Lỗi khi tải video:', err);
    res.status(500).send('Lỗi server khi tải video.');
  }
}



