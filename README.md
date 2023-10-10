# cors-proxy
simple node proxy server
*live api:* https://cors-proxy-6r45.onrender.com

## HOW TO USE
### Install Packages
```
npm install
```
### start local server
```
npm start
```

### Local Proxy Call Example
```
curl -X GET "http://localhost:3000/?url=<YOUR_API_ENDPOINT>"
```

### Live Proxy Call Example
```
curl -X GET "https://cors-proxy-6r45.onrender.com/?url=https://maps.googleapis.com/maps/api/place/autocomplete/json?input=<search_text>&key=<api_key>&location=<latitude>,<longitude>&radius=1000"

```


