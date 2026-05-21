const axios = require('axios');
const FormData = require('form-data');

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

    const targetOwnerId = '4374b8e7-6801-460c-8bb3-850edd23212b';

    console.log('Attempting to create property for target owner using Jeremy\'s token...');
    const form = new FormData();
    form.append('Title', 'Beautiful Test Property for customer1');
    form.append('Description', 'A beautiful test property description.');
    form.append('PropertyType', '1');
    form.append('Price', '120000');
    form.append('Availability', '1');
    form.append('PropertyLeaseType', '1');
    
    // Set Features to integer string '1'!
    form.append('Features', '1');
    
    form.append('ContactPersonName', 'Test Contact');
    form.append('ContactPersonEmail', 'contact@test.com');
    form.append('ContactPersonPhoneNumber', '08012345678');
    form.append('OwnerId', targetOwnerId); // SPECIFY OTHER OWNER ID!
    form.append('PropertyAddress.Place', 'Alirat street');
    form.append('PropertyAddress.City', 'Ikeja');
    form.append('PropertyAddress.State', 'Lagos');
    form.append('PropertyAddress.Country', 'Nigeria');
    form.append('PropertyAddress.PostalCode', '100001');

    // Add a single fake image file buffer
    form.append('Files', Buffer.alloc(10), {
        filename: 'fake_image.jpg',
        contentType: 'image/jpeg'
    });

    try {
        const res = await axios.post(`${API_BASE_URL}/api/v1/Property`, form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${jeremyToken}`
            }
        });
        console.log('Property Creation SUCCESS! ID:', res.data.data.id, 'Owner ID in response:', res.data.data.ownerId);
    } catch (err) {
        console.error('Property Creation Failed:', err.message, err.response?.data);
    }
}

test();
