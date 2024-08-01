## steps to configure
    1a. Generate the CA (Certificate Authority) key and certificate - (root certificate with self signed in locally)
    1b. Generate the server key and certificate, 
    1c. Generate the client key and certificate (if needed for client authentication)
    2. Configure MongoDB to use TLS
    3. Update your Docker Compose file
    4. Configure your application to connect using TLS 
    
    
### 1. commands to generate the certificate

``` console
# Generate CA key and certificate
openssl genrsa -out ca.key 4096
openssl req -x509 -new -nodes -key ca.key -sha256 -days 1024 -out ca.crt -subj "/C=IN/ST=Tamil Nadu/L=Chennai/O=M2P/OU=Engineering/CN=M2P CA"

# Generate server key and CSR
openssl genrsa -out server.key 4096
openssl req -new -key server.key -out server.csr -subj "/C=IN/ST=Tamil Nadu/L=Chennai/O=M2P/OU=Engineering/CN=mongodb"

# Generate server certificate with Subject Alternative Name (SAN)
echo "subjectAltName=DNS:mongodb,DNS:localhost,IP:127.0.0.1" > san.cnf
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 365 -sha256 -extfile san.cnf

# Combine server key and certificate into a PEM file
cat server.key server.crt > server.pem

# Generate client key and CSR
openssl genrsa -out client.key 4096
openssl req -new -key client.key -out client.csr -subj "/C=IN/ST=Tamil Nadu/L=Chennai/O=M2P/OU=Engineering/CN=nodejs-client"

# Generate client certificate
openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out client.crt -days 365 -sha256

# Combine client key and certificate into a PEM file
cat client.key client.crt > client.pem

```

### 2. Configure mongoDb to use TLS
This can be handled either by editing mongoDB config file manually **or** configure in docker-compose file if you are starting mongoDB server using docker instance.


### 3. Update your Docker Compose file
Just update your docker file with correct certificate/pem file path.\
- In this repo we are storing all of our cert, private keys, csr files iniside ssl folder on root level.
- we'll enable mongodb TLS in command part. here we will be add file path of our server.pem and ca.crt file
- **Notice** we are mounting our **host filepath(./ssl)** to container shared volume **/etc/ssl** with read only access(**ro**)
- Do the same for node part, here in mongodb url string we'll add file path of our client.pem and ca.crt file

### 4. Configure your application to connect using TLS 
This steps is not needed if you have configured TLS configuration in MONGO_URI or else you have to update your code by manually setting
```js
const url = process.env.MONGO_URI;
const client = new MongoClient(url, {
  tls: true,
  tlsCAFile: '/etc/ssl/ca.crt',
  tlsCertificateKeyFile: '/etc/ssl/client.pem',
//   tlsAllowInvalidHostnames: false,
//   tlsAllowInvalidCertificates: false
});
```
