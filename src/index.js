const express = require('express');
const { extractQuoraHtml } = require('./services/scraper');
const { cleanHtml, readableText, embeddedJson } = require('./services/extractor');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5555;

app.post('/extract', async (req, res) => {
  const { url } = req.body;

  if (!url || !url.startsWith('https://')) {
    return res.status(400).json({ status: 'error', message: 'Valid Quora URL is required in the JSON body.' });
  }

  try {
    console.log(`Received extraction request for: ${url}`);
    const htmlContent = await extractQuoraHtml(url);
    const clean_text = cleanHtml(htmlContent);
    const readable = readableText(htmlContent, url);
    const embedded_json = embeddedJson(htmlContent);

    res.json({
      status: 'success',
      url,
      clean_text,
      readable,
      embedded_json
    });
  } catch (error) {
    console.error(`Failed to extract HTML for ${url}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to extract HTML',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'quora-crawler-api' });
});

app.listen(PORT, () => {
  console.log(`Quora Crawler API listening on port ${PORT}`);
});
