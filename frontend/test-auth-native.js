const http = require('http');

const username = 'testuser_' + Math.floor(Math.random() * 10000);
const postData = JSON.stringify({
    username: username,
    email: 'test_' + Math.floor(Math.random() * 10000) + '@example.com',
    password: 'password123'
});

const options = {
    hostname: '127.0.0.1',
    port: 8080,
    path: '/api/auth/public/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

console.log('Testing Registration with:', username);

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    let body = '';
    res.on('data', (chunk) => {
        body += chunk;
    });
    res.on('end', () => {
        console.log('BODY:', body);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
