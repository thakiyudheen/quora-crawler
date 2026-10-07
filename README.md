# Quora Crawler API

A fast, headless browser API built with Express and Puppeteer to extract clean, readable text and embedded JSON data from Quora answers.

## Features
- **Headless Chrome (Puppeteer Stealth):** Bypasses basic bot protection.
- **Embedded JSON Extraction:** Instantly pulls the pre-loaded data (`__NEXT_DATA__`) served by Quora without needing to parse the DOM or wait for React hydration.
- **Readable Text Extraction:** Uses Mozilla's Readability and Cheerio to clean and parse the page into standard readable text.
- **Dockerized:** Ready to be deployed anywhere, natively supporting cloud environments like Render.com.

## Getting Started (Local Development)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

The API will start on port `5555` by default (or the `PORT` environment variable).

## API Usage

### `POST /extract`

Extracts data from a given Quora URL. 

**Note on URLs:** To bypass the need for clicking "View more answers", it is highly recommended to append `?topAns=<ANSWER_ID>` to the Quora URL. This forces Quora's backend to serve the complete answer immediately on the initial page load.

**Request:**
```bash
curl -X POST http://localhost:5555/extract \
     -H "Content-Type: application/json" \
     -d '{"url":"https://www.quora.com/If-I-study-a-two-years-master-program-in-Spain-with-an-international-exchange-in-Germany-could-I-get-a-job-in-Germany-when-I-finish-my-master-s-I-am-not-a-European-citizen?topAns=221039247"}'
```

**Response:**
Returns a JSON object containing three extractions:
- `clean_text`: A stripped-down, whitespace-trimmed text representation of the HTML.
- `readable`: The parsed title and article body utilizing Mozilla's Readability.
- `embedded_json`: The raw parsed JSON objects found in `<script id="__NEXT_DATA__">` and `application/ld+json`.

## Deployment (Render.com)

This repository is fully configured to be deployed as a Docker Web Service on Render.

1. Push this repository to GitHub.
2. In Render, create a new **Web Service** and connect the repository.
3. Set the Runtime environment to **Docker**.
4. Important: Use the **Starter ($7/mo)** tier or higher. The Free tier (512MB RAM) does not have enough memory to stably run headless Chrome and will encounter Out-Of-Memory (OOM) crashes.
5. In the Advanced settings, add the Environment Variable: `NODE_ENV=production`.
6. Click Deploy. Render will read the `Dockerfile` and handle the rest!
# quora-crawler
