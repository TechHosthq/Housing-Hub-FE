import axios from 'axios';

const API_BASE_URL = 'https://pk1wr06fr1.execute-api.af-south-1.amazonaws.com/dev';

const owners = [
    { email: 'customer1_1778433063718@realestacy.com', password: 'Password123!' },
    { email: 'customer9_428@realestacy.com', password: 'Password123!' },
    { email: 'jeremyvictor788@gmail.com', password: 'Saladin123!@#' }
];

const testUsers = [
    { email: 'testuser@gmail.com', password: 'Password123!' },
    { email: 'testcustomer@gmail.com', password: 'Password123!' },
    { email: 'saladinjake@gmail.com', password: 'Password123!' }
];

async function seedMessages() {
    console.log('--- Starting Chat Seeder ---');
    const ownerData = [];
    const testUserData = [];

    // 1. Authenticate all Owners
    for (const owner of owners) {
        try {
            const res = await axios.post(`${API_BASE_URL}/api/v1/Auth/login`, {
                emailOrPhone: owner.email,
                password: owner.password
            });
            if (res.data?.isSuccessful) {
                ownerData.push({ ...owner, token: res.data.data.token, id: res.data.data.id, name: res.data.data.firstName || 'Owner' });
                console.log(`Logged in Owner: ${owner.email} (${res.data.data.id})`);
            }
        } catch (err) {
            console.error(`Failed to login owner ${owner.email}`);
        }
    }

    // 2. Authenticate all Test Users
    for (const user of testUsers) {
        try {
            const res = await axios.post(`${API_BASE_URL}/api/v1/Auth/login`, {
                emailOrPhone: user.email,
                password: user.password
            });
            if (res.data?.isSuccessful) {
                testUserData.push({ ...user, token: res.data.data.token, id: res.data.data.id, name: res.data.data.firstName || 'User' });
                console.log(`Logged in Test User: ${user.email} (${res.data.data.id})`);
            }
        } catch (err) {
            console.error(`Failed to login test user ${user.email}`);
        }
    }

    // 3. Send messages from each Test User to each Owner
    for (const user of testUserData) {
        for (const owner of ownerData) {
            console.log(`\nStarting conversation: ${user.name} -> ${owner.name}`);
            
            const messagesFromUser = [
                `Hi ${owner.name}, I'm interested in one of your properties!`,
                `Could we schedule a viewing sometime next week?`,
                `Let me know when you're available.`
            ];

            const messagesFromOwner = [
                `Hello ${user.name}! Thanks for reaching out.`,
                `I would be happy to show you around. Next Tuesday works for me.`,
                `I'll send you the exact address shortly.`
            ];

            // User sends messages
            for (const msg of messagesFromUser) {
                try {
                    await axios.post(`${API_BASE_URL}/api/v1/Chat/send`, {
                        recipientId: owner.id,
                        content: msg
                    }, {
                        headers: { 'Authorization': `Bearer ${user.token}` }
                    });
                    console.log(`[${user.name} -> ${owner.name}]: ${msg}`);
                } catch (e: any) {
                    console.error(`Failed to send message from ${user.name}:`, e.response?.data || e.message);
                }
            }

            // Owner replies
            for (const msg of messagesFromOwner) {
                try {
                    await axios.post(`${API_BASE_URL}/api/v1/Chat/send`, {
                        recipientId: user.id,
                        content: msg
                    }, {
                        headers: { 'Authorization': `Bearer ${owner.token}` }
                    });
                    console.log(`[${owner.name} -> ${user.name}]: ${msg}`);
                } catch (e: any) {
                    console.error(`Failed to send reply from ${owner.name}:`, e.response?.data || e.message);
                }
            }
        }
    }

    console.log('\n--- Chat Seeding Completed ---');
}

seedMessages().catch(console.error);
