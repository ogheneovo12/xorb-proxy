const express = require("express");
const axios = require("axios");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { URL } = require("url");
const path = require("path");

const app = express();

// Proxy Configurations
const PORT = process.env.PORT || 5500;
const REQUEST_BODY_LIMIT = process.env.REQUEST_BODY_LIMIT || "100kb";
const RATE_LIMIT_WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX || 100; // Limit requests per window
const PROXY_TIMEOUT = process.env.PROXY_TIMEOUT || 10000; // 10 seconds

// Serve webpage from 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Security middleware
app.use(helmet());

// Rate limiting to prevent abuse
app.use(
  rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Middleware for JSON parsing - migrated from body parser
app.use(
  express.json({
    limit: REQUEST_BODY_LIMIT,
  })
);

const getEssentialHeaders = (req) => {
  const allowedHeaders = [
    "content-type",
    "authorization",
    "accept",
    "user-agent",
    "referer",
    "x-requested-with",
  ];

  const essentialHeaders = Object.keys(req.headers)
    .filter((header) => allowedHeaders.includes(header.toLowerCase()))
    .reduce((acc, header) => {
      acc[header] = req.headers[header];
      return acc;
    }, {});

  return essentialHeaders;
};

// Middleware to validate and parse URL
const validateUrl = (req, res, next) => {
  const { url: targetUrl, extraHeaders, ...queryParams } = req.query;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing "url" query parameter.' });
  }

  try {
    const parsedUrl = new URL(targetUrl);

    req.validatedUrl = parsedUrl;
    req.queryParams = queryParams;
    req.extraHeaders = extraHeaders
      ? extraHeaders.split(",").map((header) => header.trim())
      : [];

    next();
  } catch (error) {
    return res.status(400).json({ error: "Invalid URL format." });
  }
};

// CORS configuration
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Handle preflight requests
  }
  next();
});

// Proxy route
app.all("/proxy", validateUrl, async (req, res, next) => {
  try {
    const { validatedUrl, queryParams } = req;

    // Construct query string
    const query = new URLSearchParams(queryParams).toString();
    const fullUrl = `${validatedUrl.origin}${validatedUrl.pathname}${
      query ? "?" + query : ""
    }`;

    // Prepare headers
    let essentialHeaders = getEssentialHeaders(req);

    req.extraHeaders.forEach((headerKey) => {
      if (req.get(headerKey)) {
        essentialHeaders[headerKey] = req.get(headerKey);
      }
    });

    // Forward the request
    const response = await axios({
      method: req.method,
      url: fullUrl,
      data: req.body,
      headers: essentialHeaders,
      timeout: PROXY_TIMEOUT,
      validateStatus: (status) => status >= 200 && status < 600, // Accept all status codes
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    next(error); // Forward error to the centralized error handler
  }
});

// Centralized error handling middleware
app.use((error, req, res, next) => {
  console.error("Error:", error.message);

  if (error.response) {
    // Errors from the proxied server
    res.status(error.response.status).json({
      error: error.response.data || "Error from proxied server.",
      status: error.response.status,
    });
  } else if (error.request) {
    // No response received from the proxied server
    res.status(504).json({ error: "No response from proxied server." });
  } else {
    // Other errors (e.g., validation, timeout)
    res.status(500).json({ error: error.message || "Internal Server Error." });
  }
});

// Handle 404 errors and redirect to the home page
app.use((req, res) => {
  res.redirect('/');
});

// Start server
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});

module.exports = app;
