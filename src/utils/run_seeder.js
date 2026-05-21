/**
 * Comprehensive Seeder — run with:
 *   node src/utils/run_seeder.js
 *
 * Fixes applied vs old seeders:
 *  1. seedKey is "8813bc3a69" (not empty string)
 *  2. Admin login uses ADMIN_API, not client API
 *  3. PropertyAddress.PropertyId = '00000000-0000-0000-0000-000000000000'
 *  4. Admin publish URL is correct (no duplicate "admin/")
 *  5. Admin publish includes Authorization header
 *  6. Email verification uses Admin API (not broken client token flow)
 */



/*
PropertyAvailability: [1, 2, 3, 4, 5] — 0 is invalid
PropertyLeaseType: [1, 2, 3] — 0 is invalid
PropertyType: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] — 0 is invalid
PropertyFeature: [0, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192] — 0 IS valid (it's a flags enum, 0 = None)*/
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'https://pk1wr06fr1.execute-api.af-south-1.amazonaws.com/dev';
const ADMIN_API_BASE = 'https://3tgjb2crdf.execute-api.af-south-1.amazonaws.com/admin';
const SEED_KEY = '8813bc3a69';

const lagosLocations = [
    { place: 'Alirat Street', city: 'Ikeja', state: 'Lagos' },
    { place: 'Lekki Phase 1', city: 'Lekki', state: 'Lagos' },
    { place: 'Victoria Island', city: 'Lagos Island', state: 'Lagos' },
    { place: 'Maryland Mall Area', city: 'Ikeja', state: 'Lagos' },
    { place: 'Gbagada Phase 2', city: 'Gbagada', state: 'Lagos' },
    { place: 'Surulere', city: 'Surulere', state: 'Lagos' },
    { place: 'Yaba', city: 'Yaba', state: 'Lagos' },
];

const propertyNames = ['Villa', 'Penthouse', 'Duplex', 'Bungalow', 'Apartment', 'Suite', 'Mansion'];

// Tiny JPEG fallback buffer (1x1 pixel JPEG)
const TINY_JPEG = Buffer.from(
    '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwg' +
    'JC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIy' +
    'MjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFgAB' +
    'AQEAAAAAAAAAAAAAAAAABgUEB/8QAHhAAAQQDAQEBAAAAAAAAAAAAAQIDBAUREiH/xAAUAQEAAAAAAAAA' +
    'AAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABpSlKUpSlKUpSlKD//Z',
    'base64'
);

const results = {
    admins: [],
    owners: [],
    customers: [],
    properties: [],
    errors: [],
    logs: [],
};

const log = (msg) => {
    console.log(`[${new Date().toISOString()}] ${msg}`);
    results.logs.push(msg);
};

const error = (msg) => {
    console.error(`[ERROR] ${msg}`);
    results.errors.push(msg);
};

// ─────────────────────────────────────────────
// STEP 1: Create & login Admin
// ─────────────────────────────────────────────
async function createAndLoginAdmin() {
    const ts = Date.now();
    const email = `admin_seed_${ts}@realestacy.com`;
    const password = 'Password123!';

    log(`Creating admin: ${email}...`);
    try {
        const regRes = await axios.post(`${ADMIN_API_BASE}/admin/api/AdminAuth/create`, {
            seedKey: SEED_KEY,
            email,
            password,
            firstName: 'SeedAdmin',
            lastName: 'Bot',
        });
        log(`Admin created: ${JSON.stringify(regRes.data)}`);
    } catch (err) {
        const detail = err.response?.data || err.message;
        error(`Admin create failed: ${JSON.stringify(detail)}`);
        return null;
    }

    log(`Logging in admin: ${email}...`);
    try {
        const loginRes = await axios.post(`${ADMIN_API_BASE}/admin/api/AdminAuth/login`, {
            email,
            password,
        });
        const token = loginRes.data.token;
        if (!token) throw new Error('No token in response');
        log(`Admin login success. Token acquired.`);
        results.admins.push({ email, token });
        return token;
    } catch (err) {
        const detail = err.response?.data || err.message;
        error(`Admin login failed: ${JSON.stringify(detail)}`);
        return null;
    }
}

// ─────────────────────────────────────────────
// STEP 2: Register + verify + login an owner
// ─────────────────────────────────────────────
async function registerOwner(index, adminToken) {
    const ts = Date.now();
    const email = `owner_${index}_${ts}@realestacy.com`;
    const password = 'Password123!';

    log(`Registering owner ${index}: ${email}...`);
    try {
        const regRes = await axios.post(`${API_BASE_URL}/api/v1/Auth/register`, {
            firstName: `Owner`,
            lastName: `${index}`,
            email,
            phoneNumber: `080${Math.floor(10000000 + Math.random() * 90000000)}`,
            password,
            customerType: 2, // Homeowner/Owner
        });

        if (!regRes.data.isSuccessful) {
            error(`Owner ${index} registration failed: ${regRes.data.message}`);
            return null;
        }
        log(`Owner ${index} registered. Verifying email via Admin API...`);
    } catch (err) {
        const detail = err.response?.data || err.message;
        error(`Owner ${index} registration exception: ${JSON.stringify(detail)}`);
        return null;
    }

    // Verify email using Admin API (bypasses the broken client token flow)
    try {
        await axios.post(
            `${ADMIN_API_BASE}/admin/api/AdminUser/verify-email`,
            { email },
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        log(`Owner ${index} email verified via Admin API.`);
    } catch (err) {
        const detail = err.response?.data || err.message;
        error(`Owner ${index} email verification warning: ${JSON.stringify(detail)}`);
        // Continue anyway — login may still work
    }

    // Login
    try {
        const loginRes = await axios.post(`${API_BASE_URL}/api/v1/Auth/login`, {
            emailOrPhone: email,
            password,
        });

        if (!loginRes.data.isSuccessful || !loginRes.data.data) {
            error(`Owner ${index} login failed: ${loginRes.data.message}`);
            return null;
        }
        const { token, id } = loginRes.data.data;
        log(`Owner ${index} logged in. ID: ${id}`);
        return { id, email, token };
    } catch (err) {
        const detail = err.response?.data || err.message;
        error(`Owner ${index} login exception: ${JSON.stringify(detail)}`);
        return null;
    }
}

// ─────────────────────────────────────────────
// STEP 3: Create a property for an owner
// ─────────────────────────────────────────────
async function createProperty(owner, index, adminToken) {
    const loc = lagosLocations[index % lagosLocations.length];
    const propName = propertyNames[index % propertyNames.length];
    const title = `${propName} ${index} — ${loc.city}`;

    const form = new FormData();
    form.append('Title', title);
    form.append('Description', `A stunning ${propName.toLowerCase()} in ${loc.place}, ${loc.city}. Modern amenities, premium finishes.`);
    form.append('PropertyType', String(index % 5));       // 0-4
    form.append('Price', String(Math.floor(Math.random() * 10000000) + 500000));
    form.append('Availability', '1');
    form.append('PropertyLeaseType', String(index % 2));  // 0=Rent, 1=Sale
    form.append('Features', '0');
    form.append('ContactPersonName', `Owner ${index}`);
    form.append('ContactPersonEmail', owner.email);
    form.append('ContactPersonPhoneNumber', '08012345678');
    form.append('OwnerId', owner.id);
    form.append('PropertyAddress.Place', loc.place);
    form.append('PropertyAddress.City', loc.city);
    form.append('PropertyAddress.State', loc.state);
    form.append('PropertyAddress.Country', 'Nigeria');
    form.append('PropertyAddress.PostalCode', '100001');
    // KEY FIX: zero-GUID prevents "PropertyId is required/empty" validation error
    form.append('PropertyAddress.PropertyId', '00000000-0000-0000-0000-000000000000');
    // Attach a tiny JPEG so the "Files" field is not empty
    form.append('Files', TINY_JPEG, { filename: `property_${index}.jpg`, contentType: 'image/jpeg' });

    try {
        const propRes = await axios.post(`${API_BASE_URL}/api/v1/Property`, form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${owner.token}`,
            },
        });

        if (!propRes.data.isSuccessful) {
            error(`Property ${index} creation failed: ${propRes.data.message}`);
            return null;
        }

        const propertyId = propRes.data.data.id;
        log(`Property ${index} created. ID: ${propertyId}`);

        // Publish via Admin API
        // KEY FIX: correct URL path (no duplicate "admin/") + auth header
        try {
            await axios.put(
                `${ADMIN_API_BASE}/admin/api/AdminProperty/${propertyId}/publish`,
                {},
                { headers: { Authorization: `Bearer ${adminToken}` } }
            );
            log(`Property ${propertyId} published.`);
        } catch (pubErr) {
            const detail = pubErr.response?.data || pubErr.message;
            error(`Publish failed for ${propertyId}: ${JSON.stringify(detail)}`);
        }

        return { id: propertyId, title, ownerId: owner.id };
    } catch (err) {
        const detail = err.response?.data || err.message;
        error(`Property ${index} exception: ${JSON.stringify(detail)}`);
        return null;
    }
}

// ─────────────────────────────────────────────
// STEP 4: Register + verify a customer
// ─────────────────────────────────────────────
async function registerCustomer(index, adminToken) {
    const ts = Date.now();
    const email = `customer_${index}_${ts}@realestacy.com`;
    const password = 'Password123!';

    log(`Registering customer ${index}: ${email}...`);
    try {
        const regRes = await axios.post(`${API_BASE_URL}/api/v1/Auth/register`, {
            firstName: `Customer`,
            lastName: `${index}`,
            email,
            phoneNumber: `070${Math.floor(10000000 + Math.random() * 90000000)}`,
            password,
            customerType: 1, // Buyer/Renter
        });

        if (!regRes.data.isSuccessful) {
            error(`Customer ${index} registration failed: ${regRes.data.message}`);
            return null;
        }

        // Verify email
        await axios.post(
            `${ADMIN_API_BASE}/admin/api/AdminUser/verify-email`,
            { email },
            { headers: { Authorization: `Bearer ${adminToken}` } }
        ).catch(err => {
            error(`Customer ${index} email verify warning: ${err.response?.data?.message || err.message}`);
        });

        log(`Customer ${index} registered & verified.`);
        return { email, id: regRes.data.data?.id };
    } catch (err) {
        const detail = err.response?.data || err.message;
        error(`Customer ${index} exception: ${JSON.stringify(detail)}`);
        return null;
    }
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
async function main() {
    log('===== Starting Full Seed =====');

    // 1. Admin
    const adminToken = await createAndLoginAdmin();
    if (!adminToken) {
        error('Cannot proceed without admin token. Aborting.');
        return saveResults();
    }

    // 2. Owners + Properties (3 owners × 10 properties = 30 properties)
    const OWNER_COUNT = 3;
    const PROPS_PER_OWNER = 10;
    let propIndex = 0;

    for (let i = 1; i <= OWNER_COUNT; i++) {
        const owner = await registerOwner(i, adminToken);
        if (!owner) continue;
        results.owners.push({ id: owner.id, email: owner.email });

        for (let j = 1; j <= PROPS_PER_OWNER; j++) {
            const prop = await createProperty(owner, ++propIndex, adminToken);
            if (prop) results.properties.push(prop);
        }
    }

    // 3. Customers (5)
    const CUSTOMER_COUNT = 5;
    for (let i = 1; i <= CUSTOMER_COUNT; i++) {
        const customer = await registerCustomer(i, adminToken);
        if (customer) results.customers.push(customer);
    }

    log('===== Seed Complete =====');
    log(`Admins:     ${results.admins.length}`);
    log(`Owners:     ${results.owners.length}`);
    log(`Properties: ${results.properties.length}`);
    log(`Customers:  ${results.customers.length}`);
    log(`Errors:     ${results.errors.length}`);

    saveResults();
}

function saveResults() {
    const outPath = path.join(__dirname, 'seed_run_results.json');
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
    console.log(`\nResults saved to: ${outPath}`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    saveResults();
});
