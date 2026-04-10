import http from 'http';

function makeRequest(path, method, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',
            port: 8080,
            path: '/api/auth/public' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.setEncoding('utf8');
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, body }));
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
}

async function testAuth() {
    console.log("Starting Auth Integrity Check...");
    const username = 'user_' + Math.floor(Math.random() * 100000);
    const password = 'password123';

    // 1. Register
    try {
        const regData = JSON.stringify({ username, email: username + '@test.com', password });
        console.log(`\nTesting Registration for ${username}...`);
        const regRes = await makeRequest('/register', 'POST', regData);
        console.log(`Registration Status: ${regRes.statusCode}`);
        console.log(`Registration Body: ${regRes.body}`);

        if (regRes.statusCode !== 200) {
            console.error("CRITICAL: Registration Failed");
        } else {
            console.log("SUCCESS: Registration OK");
        }
    } catch (e) {
        console.error("CRITICAL: Backend Unreachable or Error during Registration", e.message);
        return;
    }

    // 2. Login
    try {
        const loginData = JSON.stringify({ username, password });
        console.log(`\nTesting Login for ${username}...`);
        const loginRes = await makeRequest('/login', 'POST', loginData);
        console.log(`Login Status: ${loginRes.statusCode}`);
        console.log(`Login Body: ${loginRes.body}`);

        if (loginRes.statusCode === 200 && loginRes.body.includes("token")) {
            console.log("SUCCESS: Login returned a token.");
        } else {
            console.error("CRITICAL: Login Failed or No Token");
        }
    } catch (e) {
        console.error("CRITICAL: Error during Login", e.message);
    }
}

testAuth();
