// server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import handler from './api/tiktok.js';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/tiktok', handler); // ✅ đảm bảo đúng đường dẫn

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});
