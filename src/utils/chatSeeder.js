const axios = require('axios');

const API_BASE_URL = 'https://pk1wr06fr1.execute-api.af-south-1.amazonaws.com/dev';
const ADMIN_API_BASE = 'https://3tgjb2crdf.execute-api.af-south-1.amazonaws.com/admin';

// Unverified users we need to fix
const unverifiedUsers = [
    { email: 'customer1_1778433063718@realestacy.com', password: 'Password123!', label: 'Owner1' },
    { email: 'customer9_428@realestacy.com', password: 'Password123!', label: 'Owner2' },
    { email: 'testuser@gmail.com', password: 'Password123!', label: 'TestUser1' },
    { email: 'testcustomer@gmail.com', password: 'Password123!', label: 'TestCustomer' },
];

async function verifyAndSeed() {
    console.log('--- Step 1: Login as Admin ---');
    let adminToken = '';
    try {
        const adminLogin = await axios.post(`${ADMIN_API_BASE}/admin/api/AdminAuth/login`, {
            email: 'ugoluwa@gmail.com',
            password: 'Father+1'
        });
        adminToken = adminLogin.data.token || adminLogin.data.data?.token;
        console.log('✅ Admin logged in:', adminToken ? 'OK' : 'NO TOKEN');
    } catch (e) {
        console.error('❌ Admin login failed:', e.response?.data || e.message);
        return;
    }

    console.log('\n--- Step 2: Verify unverified user emails via Admin ---');
    for (const user of unverifiedUsers) {
        try {
            const r = await axios.post(`${ADMIN_API_BASE}/admin/api/AdminUser/verify-email`, {
                email: user.email
            }, {
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });
            console.log(`✅ Verified email for ${user.label} (${user.email}):`, r.data?.message || r.data);
        } catch (e) {
            console.error(`❌ Verify failed for ${user.label}:`, e.response?.data || e.message);
        }
    }

    console.log('\n--- Step 3: Login all users ---');
    const allCreds = [
        ...unverifiedUsers,
        { email: 'jeremyvictor788@gmail.com', password: 'Saladin123!@#', label: 'Jeremy' },
    ];

    const loggedIn = [];
    for (const user of allCreds) {
        try {
            const res = await axios.post(`${API_BASE_URL}/api/v1/Auth/login`, {
                emailOrPhone: user.email,
                password: user.password
            });
            if (res.data?.isSuccessful) {
                loggedIn.push({ ...user, token: res.data.data.token, id: res.data.data.id, name: res.data.data.firstName || user.label });
                console.log(`✅ Logged in ${user.label} (${res.data.data.id})`);
            } else {
                console.log(`❌ Login failed for ${user.label}: ${res.data?.message}`);
            }
        } catch (e) {
            console.error(`❌ Login error for ${user.label}:`, e.response?.data || e.message);
        }
    }

    const jeremy = loggedIn.find(u => u.label === 'Jeremy');
    if (!jeremy) { console.error('Jeremy not found!'); return; }

    const others = loggedIn.filter(u => u.label !== 'Jeremy');

    console.log(`\n--- Step 4: Seeding conversations with Jeremy from ${others.length} users ---`);
    for (const sender of others) {
        const msgs = [
            `Hi Jeremy! This is ${sender.name} — I saw your listings and I'm very interested.`,
            `Could we arrange a property tour this week?`,
            `Please let me know your availability. Thanks!`
        ];

        for (const msg of msgs) {
            try {
                await axios.post(`${API_BASE_URL}/api/v1/Chat/send`, {
                    recipientId: jeremy.id,
                    content: msg
                }, { headers: { 'Authorization': `Bearer ${sender.token}` } });
                console.log(`✅ [${sender.name} → Jeremy]: ${msg.substring(0, 50)}...`);
            } catch (e) {
                console.error(`❌ [${sender.name} → Jeremy]:`, e.response?.data || e.message);
            }
        }

        const replies = [
            `Hi ${sender.name}! Thanks for reaching out — happy to help.`,
            `I have some great properties that would suit you perfectly.`,
            `Let's schedule a viewing — are you free this weekend?`
        ];
        for (const reply of replies) {
            try {
                await axios.post(`${API_BASE_URL}/api/v1/Chat/send`, {
                    recipientId: sender.id,
                    content: reply
                }, { headers: { 'Authorization': `Bearer ${jeremy.token}` } });
                console.log(`✅ [Jeremy → ${sender.name}]: ${reply.substring(0, 50)}...`);
            } catch (e) {
                console.error(`❌ [Jeremy → ${sender.name}]:`, e.response?.data || e.message);
            }
        }
    }

    console.log('\n--- Chat Seeding Completed ---');
}

verifyAndSeed().catch(console.error);
