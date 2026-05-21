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
    } catch (err) {
        return;
    }

    try {
        const res200 = await axios.get(`${API_BASE_URL}/api/v1/Inspection/owner?PageNumber=1&PageSize=200`, {
            headers: { 'Authorization': `Bearer ${jeremyToken}` }
        });
        const items = res200.data?.data?.items || [];
        console.log(`Total items: ${items.length}`);
        let pending = 0, confirmed = 0, completed = 0, cancelled = 0;
        for (const i of items) {
            if (i.status === 0 || i.status === '0' || i.status === 'Pending') pending++;
            else if (i.status === 1 || i.status === '1' || i.status === 'Confirmed') confirmed++;
            else if (i.status === 3 || i.status === '3' || i.status === 'Completed') completed++;
            else cancelled++;
        }
        console.log(`Pending: ${pending}, Confirmed: ${confirmed}, Completed: ${completed}, Cancelled: ${cancelled}`);
    } catch (err) {
        console.error('Failed:', err.message);
    }
}

test();
