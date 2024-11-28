# Xorb Proxy 🌐🔒

## 🚀 Quick Overview

Xorb Proxy is a robust, secure, and flexible CORS (Cross-Origin Resource Sharing) proxy server that enables seamless API requests across different domains. Designed for developers who need to overcome cross-origin limitations, Xorb Proxy provides a simple, configurable solution for proxying HTTP requests.

![Xorb Proxy Banner](https://xorb-proxy.xorbious.com/xorb-proxy-banner.svg)

## ✨ Features

- **Universal CORS Bypass**: Forward requests for any API endpoint
- **Multi-Method Support**: GET, POST, PUT, DELETE, OPTIONS
- **Security First**: 
  - Rate limiting
  - URL validation
  - Configurable origin restrictions
- **Lightweight & Fast**: Minimal overhead, built with Express.js
- **Easy Integration**: Simple query-based usage
- **Error Handling**: Comprehensive error responses

## 🔧 Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/ogheneovo12/xorb-proxy.git

# Navigate to project directory
cd xorb-proxy

# Install dependencies
npm install
```

## 🚦 Configuration

Configure your proxy using environment variables:

```bash
# .env file
PORT=5000
REQUEST_BODY_LIMIT=100kb
RATE_LIMIT_WINDOW=15 # minutes
RATE_LIMIT_MAX=100
```

## 🌍 Usage Examples

### JavaScript Fetch
```javascript
fetch('https://xorb-proxy.xorbious.com/proxy?url=https://api.example.com/users', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Axios
```javascript
axios.get('https://xorb-proxy.xorbious.com/proxy', {
    params: {
        url: 'https://api.example.com/data',
        extraParam: 'value'
    }
})
.then(response => console.log(response.data))
.catch(error => console.error('Error:', error));
```

## 🛡️ Security

- Rate limited to prevent abuse
- URL validation
- Helmet.js for HTTP header security

## 💻 Run Locally

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🔍 Limitations

- Maximum request body: 100KB
- Rate limit: 100 requests per 15 minutes
- HTTPS URLs recommended

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Oghene Ovo - [@ogheneovo12](https://x.com/xorbious)

Project Link: [https://github.com/ogheneovo12/xorb-proxy](https://github.com/ogheneovo12/xorb-proxy)

## 🙌 Acknowledgements

- [Express.js](https://expressjs.com/)
- [Axios](https://axios-http.com/)
- [Helmet.js](https://helmetjs.github.io/)

---

**Made with ❤️ by Xorbious*