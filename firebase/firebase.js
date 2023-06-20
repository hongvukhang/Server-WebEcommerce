const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: "storage-images-89cf3",
    private_key_id: "cc575eccadca423f23c666a4c9a0ccd0a952c841",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCbeZR+5PMvJ+/L\nwc3Hn1qzRDifTZ544ysHCPuo7of+pfQk155GIB89A41lXf+0/Fudf0Sj5o3bP7ZL\nNbgNH1IJoC8I/ldYm4bldvDr/6TTYN93kq1nzTloh5ypIzNafNy3AQaBc27RsyPp\n0tULjAQkA7vXLa27lgrHsKcL97K1f6JoleaZ6mR9qwwHLTdpvguY4dCfdRcn8bqu\nk3TmC3LPV307IsSTFctvRcoMkoumprw6Ct8d1NpZCt3YiTCT1Sl4sv2HMEkoTFGb\nDgg59xPXUPnyOUfHFaKRW49ZpkDiEDUt5vX8QZHuXLSDUnf8WKWDPjd7InhnsNa6\nkhQHkBS/AgMBAAECggEAA/WLUfAhPua/tsXQLxxjr6+a5fGDYVKy+zkk+Ex5c6uh\ndvkHuJ5h8lEFULQxnLzwn63bGjJwIPkF5now7voWGYQgDoCgNb3NNcMDXcvEuW8r\n7xxdrO1jbYwr/yuu/ZHOADhJkfdIgJTEJpFiPbGCMbIQHnB/SuB/ok3ahoM6vA8R\ndGnsP0ALKnFK3nRCVDc3Mp2FYugxBQhbzDkMnmsutXBNjbwe+jxpikg8Mx5o6sjD\nCvxevo7Ae3mU3xyOdRmQ5w6zSyqZZzfqRFwb5ZVqYgY5KI2g4UB11QAqn/EcnIde\nYayYnVEBrADelC6sqav6xtOPSECGGxI1LsgSXHx6eQKBgQDUzrkBKzUiRZxPuOSV\nzN9VB0gM/1GdWAcQh7PlJS50mI/P/yPD5wkxc6oVZbrQR1quNJzCKjekXpn6Wn+8\nHetyzg38BE0JVXH5khPLMCz+2+p34YejWzQahho+RKbTL4nDViiOuj3Aj8TwoAZR\nBosVLGs4uMt7dAT1dttn6PicZQKBgQC7B+kEnBOQpnrlU0kmI0PuRuyfE3vRfteG\nPav/JrlH6OTY3Yngkuvl63rOJEhkFcHS8kPbm79lSTg7lo4Jwi3N61VKqSXdUMgc\nwAqD9C95Gw1XaEIz+iGAGgeb36oxfAQ55Tzky/mfd1f38gZfiLSKQ/IFUcUDpntY\nDvSCS1ngUwKBgQCM4VXEmlAQoji65lIdgYWQCsP+JsBnA7GZldzYI+c/NQhv0B5j\nQH3riQDeLXyhCbvUe+wS9lPjsuUIwgSyCrSmShcj8cz2EuTjLXuBFiGTjw8H0fwz\nfttde82/zz8Jq/ztngo3gsACzKq6CZZk6YoFuGQ7Jss+rS3jOo5Bmg+LqQKBgDeQ\nXAvAipd4vh4PJjYsV+wcKgQAd9J/SmxZOhXtXTId4I8FEgcj3u1Jjgxb/x2s0Q5o\nZvyBQtVGcWxSiBQiGhWJCqfJpLQhYbIY44bcLpZeERKcqL5kWzuBgC0wv5E/9Ml2\nbybR6nETtZC12GrdZDWHhglKh6tT9GTu3HkxBZx9AoGAfrwNHcBeG3u3842JHKCo\nANwUAJngJN2WlAqxn3y0e5cukMU/BwKERu1sJI7RBUnCNzJVAII8QQknJm1qSrUu\nmTVmsekYm33BTLPtFsfYlS2lUaqXpRm1Plp6FVdClIOwr5uCPx7fR/Ua25t3iBJW\nS+RhZ8mFhW88IkzaobkwiiY=\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-xb3so@storage-images-89cf3.iam.gserviceaccount.com",
    client_id: "107959508333690990806",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xb3so%40storage-images-89cf3.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  }),
  storageBucket: "gs://storage-images-89cf3.appspot.com",
});

const bucket = admin.storage().bucket();

module.exports = { bucket };

/////////////////////////////////////////////////////////////////////////
