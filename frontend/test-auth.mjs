import axios from 'axios';

async function testRegistration() {
    const baseUrl = 'http://localhost:8080/api/auth/public';
    const username = 'testuser_' + Math.floor(Math.random() * 10000);
    const email = 'test_' + Math.floor(Math.random() * 10000) + '@example.com';
    const password = 'password123';

    console.log('Testing Registration...');
    try {
        const response = await axios.post(`${baseUrl}/register`, {
            username,
            email,
            password
        });
        console.log('Registration Successful:', response.data);
    } catch (error) {
        console.error('Registration Failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
    }
}

testRegistration();
