const axios = require('axios');

const API_BASE_URL = 'https://pk1wr06fr1.execute-api.af-south-1.amazonaws.com/dev';

async function test() {
    let jeremyToken = '';
    let ownerId = '';
    try {
        const loginRes = await axios.post(`${API_BASE_URL}/api/v1/Auth/login`, {
            emailOrPhone: "jeremyvictor788@gmail.com",
            password: "Saladin123!@#"
        });
        jeremyToken = loginRes.data.data.token;
        ownerId = loginRes.data.data.id;
        console.log('Logged in successfully');
    } catch (err) {
        console.error('Login failed');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('Title', 'Test Title');
        formData.append('Description', 'Test Description');
        formData.append('PropertyType', '1');
        formData.append('Price', '10000000');
        formData.append('Availability', '1');
        formData.append('PropertyLeaseType', '1');
        formData.append('Features', '0');
        formData.append('ContactPersonName', 'Jeremy');
        formData.append('ContactPersonEmail', 'jeremyvictor788@gmail.com');
        formData.append('ContactPersonPhoneNumber', '08000000000');
        formData.append('OwnerId', ownerId);
        formData.append('PropertyAddress.Place', 'Alirat');
        formData.append('PropertyAddress.City', 'Ikeja');
        formData.append('PropertyAddress.State', 'Lagos');
        formData.append('PropertyAddress.Country', 'Nigeria');
        formData.append('PropertyAddress.PostalCode', '100001');
        formData.append('PropertyAddress.PropertyId', '00000000-0000-0000-0000-000000000000');

        const fallbackRes = await axios.get('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=200', { responseType: 'arraybuffer' });
        const blob = new Blob([fallbackRes.data], { type: 'image/jpeg' });
        formData.append('Files', blob, 'test.jpg');

        const res = await axios.post(`${API_BASE_URL}/api/v1/Property`, formData, {
            headers: { 'Authorization': `Bearer ${jeremyToken}` }
        });
        console.log('Success:', res.data);
    } catch (err) {
        console.error('Create Property Failed:', err.response?.data || err.message);
    }
}

test();
