const axios = require('axios');

const API_BASE_URL = 'https://pk1wr06fr1.execute-api.af-south-1.amazonaws.com/dev';
const ADMIN_API_BASE = 'https://3tgjb2crdf.execute-api.af-south-1.amazonaws.com/admin';

async function test() {
    console.log('Logging in ugoluwa@gmail.com on CLIENT auth...');
    try {
        const loginRes = await axios.post(`${API_BASE_URL}/api/v1/Auth/login`, {
            emailOrPhone: "ugoluwa@gmail.com",
            password: "Father+1"
        });
        console.log('Login Response Status:', loginRes.status);
        console.log('Login Response Data:', JSON.stringify(loginRes.data));
    } catch (err) {
        console.error('Login Exception:', err.message, err.response?.data);
    }
}

test();
