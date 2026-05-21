const axios = require('axios');

const API_BASE_URL = 'https://pk1wr06fr1.execute-api.af-south-1.amazonaws.com/dev';

async function test() {
    let jeremyToken = '';
    try {
        const loginRes = await axios.post(`${API_BASE_URL}/api/v1/Auth/login`, {
            emailOrPhone: "jeremyvictor788@gmail.com",
            password: "Saladin123!@#"
        });
        jeremyToken = loginRes.data.data.token;
        console.log('Jeremy logged in successfully.');
    } catch (err) {
        console.error('Jeremy login failed:', err.message);
        return;
    }

    try {
        const res200 = await axios.get(`${API_BASE_URL}/api/v1/Inspection/owner?PageNumber=1&PageSize=200`, {
            headers: { 'Authorization': `Bearer ${jeremyToken}` }
        });
        console.log('PageSize 200 Success, items count:', res200.data?.data?.items?.length);
    } catch (err) {
        console.error('PageSize 200 Failed:', err.message, err.response?.data);
    }

    try {
        const res100 = await axios.get(`${API_BASE_URL}/api/v1/Inspection/owner?PageNumber=1&PageSize=100`, {
            headers: { 'Authorization': `Bearer ${jeremyToken}` }
        });
        console.log('PageSize 100 Success, items count:', res100.data?.data?.items?.length);
    } catch (err) {
        console.error('PageSize 100 Failed:', err.message, err.response?.data);
    }
}

test();
