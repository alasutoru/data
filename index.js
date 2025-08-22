const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// 請替換成你在 Supabase 專案中找到的資訊
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(express.json());

// 處理 CORS 問題，讓不同網域的網站可以發送請求
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// 你的主要 API 端點
app.post('/api/track', async (req, res) => {
  try {
    const { page } = req.body;

    if (!page) {
      return res.status(400).json({ error: 'Page URL is missing.' });
    }

    const { data, error } = await supabase
      .from('page_views')
      .insert({ page_url: page });

    if (error) {
      console.error('Error inserting data:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(201).json({ message: 'Page view recorded.' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Vercel 需要知道你的入口檔案，這行確保 Vercel 能正確找到並執行你的應用程式
module.exports = app;