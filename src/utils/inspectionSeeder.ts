import axios from 'axios';

const API_BASE_URL = 'https://pk1wr06fr1.execute-api.af-south-1.amazonaws.com/dev';
const ADMIN_API_BASE = 'https://3tgjb2crdf.execute-api.af-south-1.amazonaws.com/admin';

export async function seedInspections() {
    const results = {
        logs: [] as string[],
        errors: [] as string[],
    };
    const log = (msg: string) => {
        console.log(`[Inspection Seeder] ${msg}`);
        results.logs.push(msg);
    };

    log('--- Starting Inspections Seeder Refactor ---');

    try {
        // 1. Login as Admin
        log('Logging in as Admin...');
        const adminLoginRes = await axios.post(`${ADMIN_API_BASE}/admin/api/AdminAuth/login`, {
            email: "ugoluwa@gmail.com",
            password: "Father+1"
        });
        const adminToken = adminLoginRes.data.token;
        log('Admin logged in successfully.');

        // 2. Register/Login the Other Owner (otherowner@realestacy.com)
        const otherOwnerEmail = 'otherowner@realestacy.com';
        const otherOwnerPassword = 'Password123!';
        let otherOwnerToken = '';
        let otherOwnerId = '';

        log(`Settling other owner: ${otherOwnerEmail}...`);
        try {
            const loginRes = await axios.post(`${API_BASE_URL}/api/v1/Auth/login`, {
                emailOrPhone: otherOwnerEmail,
                password: otherOwnerPassword,
            });
            otherOwnerToken = loginRes.data.data.token;
            otherOwnerId = loginRes.data.data.id;
            log('Other owner logged in successfully.');
        } catch (err) {
            log('Other owner login failed. Registering new account...');
            try {
                const regRes = await axios.post(`${API_BASE_URL}/api/v1/Auth/register`, {
                    firstName: 'Sarah',
                    lastName: 'PropertyOwner',
                    email: otherOwnerEmail,
                    phoneNumber: `080${Math.floor(10000000 + Math.random() * 90000000)}`,
                    password: otherOwnerPassword,
                    customerType: 2, // Homeowner
                });
                
                log('Other owner registered successfully. Logging in...');
                const loginRes = await axios.post(`${API_BASE_URL}/api/v1/Auth/login`, {
                    emailOrPhone: otherOwnerEmail,
                    password: otherOwnerPassword,
                });
                otherOwnerToken = loginRes.data.data.token;
                otherOwnerId = loginRes.data.data.id;
                log('Other owner logged in successfully.');
            } catch (regErr: any) {
                const msg = `Failed to settle other owner: ${regErr.response?.data?.message || regErr.message}`;
                log(msg);
                results.errors.push(msg);
                return results;
            }
        }

        // 3. Login as Jeremy Victor
        const jeremyEmail = 'jeremyvictor788@gmail.com';
        const jeremyPassword = 'Saladin123!@#';
        let jeremyToken = '';
        let jeremyId = '';

        log(`Logging in as Jeremy Victor: ${jeremyEmail}...`);
        try {
            const jeremyLoginRes = await axios.post(`${API_BASE_URL}/api/v1/Auth/login`, {
                emailOrPhone: jeremyEmail,
                password: jeremyPassword,
            });
            jeremyToken = jeremyLoginRes.data.data.token;
            jeremyId = jeremyLoginRes.data.data.id;
            log('Jeremy logged in successfully.');
        } catch (err: any) {
            const msg = `Jeremy login failed: ${err.response?.data?.message || err.message}`;
            log(msg);
            results.errors.push(msg);
            return results;
        }

        // 4. Clean up / Delete Jeremy's existing inspections
        log('Fetching existing inspections to clean up self-inspections...');
        try {
            // Fetch Jeremy's buyer inspections
            const myInspectionsRes = await axios.get(`${API_BASE_URL}/api/v1/Inspection/my?PageNumber=1&PageSize=100`, {
                headers: { 'Authorization': `Bearer ${jeremyToken}` }
            });
            const myInspections = myInspectionsRes.data?.data?.items || [];
            log(`Found ${myInspections.length} existing inspections requested by Jeremy.`);

            for (const insp of myInspections) {
                log(`Deleting inspection ${insp.id}...`);
                await axios.delete(`${API_BASE_URL}/api/v1/Inspection/${insp.id}`, {
                    headers: { 'Authorization': `Bearer ${jeremyToken}` }
                }).catch((err) => log(`  Delete Warning: ${err.message}`));
            }
        } catch (err: any) {
            log(`Cleanup Warning: ${err.message}`);
        }

        // 5. Download a cached fallback image to seed properties
        log('Downloading sample property image...');
        let imageBlob: any = null;
        try {
            const imgRes = await axios.get('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=200', {
                responseType: 'arraybuffer',
                timeout: 10000
            });
            imageBlob = imgRes.data;
            log('Sample image downloaded successfully.');
        } catch (err: any) {
            log(`Image Download Warning: ${err.message}. Using dummy buffer.`);
            imageBlob = Buffer.alloc(100);
        }

        // 6. Create 5 properties owned by Sarah (the other owner)
        log('Creating 5 premium properties for the other owner (Sarah)...');
        const propertyIds: string[] = [];
        const lagosLocations = [
            { place: 'Lekki Phase 1', city: 'Lekki', state: 'Lagos' },
            { place: 'Victoria Island', city: 'Lagos Island', state: 'Lagos' },
            { place: 'Maryland Mall area', city: 'Ikeja', state: 'Lagos' },
            { place: 'Gbagada Phase 2', city: 'Gbagada', state: 'Lagos' },
            { place: 'Ikeja GRA', city: 'Ikeja', state: 'Lagos' }
        ];

        for (let i = 0; i < 5; i++) {
            const loc = lagosLocations[i];
            const type = ['Apartment', 'Duplex', 'Villa', 'Penthouse', 'Mansion'][i];
            const title = `Premium ${type} by Sarah ${i + 1}`;

            const formData = new FormData();
            formData.append('Title', title);
            formData.append('Description', `Beautiful luxury ${type.toLowerCase()} located in the heart of ${loc.city}.`);
            formData.append('PropertyType', '1');
            formData.append('Price', (7500000 + i * 2000000).toString());
            formData.append('Availability', '1');
            formData.append('PropertyLeaseType', '1');
            formData.append('Features', '0');
            formData.append('ContactPersonName', 'Sarah');
            formData.append('ContactPersonEmail', otherOwnerEmail);
            formData.append('ContactPersonPhoneNumber', '08099887766');
            formData.append('OwnerId', otherOwnerId);
            formData.append('PropertyAddress.Place', loc.place);
            formData.append('PropertyAddress.City', loc.city);
            formData.append('PropertyAddress.State', loc.state);
            formData.append('PropertyAddress.Country', 'Nigeria');
            formData.append('PropertyAddress.PostalCode', '100001');

            // Append sample image
            const blobObj = new Blob([imageBlob], { type: 'image/jpeg' });
            formData.append('Files', blobObj, `property_image_${i}.jpg`);

            try {
                const propRes = await axios.post(`${API_BASE_URL}/api/v1/Property`, formData, {
                    headers: {
                        'Authorization': `Bearer ${otherOwnerToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (propRes.data.isSuccessful) {
                    const propertyId = propRes.data.data.id;
                    propertyIds.push(propertyId);
                    log(`Property [${i+1}/5] "${title}" created (ID: ${propertyId}).`);

                    // Publish the property via Admin
                    await axios.put(`${ADMIN_API_BASE}/api/AdminProperty/${propertyId}/publish`, {}, {
                        headers: { 'Authorization': `Bearer ${adminToken}` }
                    });
                    log(`  Property [${i+1}/5] published successfully by Admin.`);
                }
            } catch (err: any) {
                log(`Failed to create property ${title}: ${err.response?.data?.message || err.message}`);
            }
        }

        if (propertyIds.length === 0) {
            throw new Error('No properties could be created for the other owner.');
        }

        // 7. Create Inspections for Jeremy Victor on Sarah's properties
        log('Creating inspections for Jeremy Victor on Sarah\'s properties...');
        const statuses = [
            { name: 'Pending', status: 0 },
            { name: 'Confirmed', status: 1 },
            { name: 'Completed', status: 3 },
            { name: 'Confirmed', status: 1 },
            { name: 'Pending', status: 0 }
        ];

        for (let i = 0; i < propertyIds.length; i++) {
            const propertyId = propertyIds[i];
            const statusInfo = statuses[i % statuses.length];

            log(`Creating ${statusInfo.name} inspection [${i+1}/${propertyIds.length}] for Jeremy...`);
            try {
                const createRes = await axios.post(`${API_BASE_URL}/api/v1/Inspection`, {
                    propertyId: propertyId,
                    scheduledDate: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    scheduledTime: '10:00:00',
                    note: `I would love to inspect this property for buying.`,
                    authenticatedUserId: jeremyId
                }, {
                    headers: { 'Authorization': `Bearer ${jeremyToken}` }
                });

                if (createRes.data.isSuccessful) {
                    const inspectionId = createRes.data.data.id;
                    log(`  Inspection created (ID: ${inspectionId}).`);

                    // 8. Respond as Other Owner (Sarah) to accept/confirm or complete
                    if (statusInfo.status !== 0) {
                        log(`  Responding as Sarah to accept inspection...`);
                        await axios.put(`${API_BASE_URL}/api/v1/Inspection/${inspectionId}/respond`, {
                            inspectionId,
                            accept: true,
                            note: 'Welcome for inspection! Let me know if you need directions.'
                        }, {
                            headers: { 'Authorization': `Bearer ${otherOwnerToken}` }
                        });
                        log(`  Inspection status updated to Confirmed.`);

                        if (statusInfo.status === 3) {
                            log(`  Responding as Sarah to complete inspection...`);
                            await axios.put(`${API_BASE_URL}/api/v1/Inspection/${inspectionId}/status`, {
                                status: 3
                            }, {
                                headers: { 'Authorization': `Bearer ${otherOwnerToken}` }
                            });
                            log(`  Inspection status updated to Completed.`);
                        }
                    }
                }
            } catch (err: any) {
                log(`  Failed to create/respond to inspection: ${err.response?.data?.message || err.message}`);
            }
        }

        log('--- Seeding inspections completed successfully! ---');
        return results;

    } catch (err: any) {
        const errMsg = err.response?.data || err.message;
        log(`Fatal Seeding Error: ${JSON.stringify(errMsg)}`);
        results.errors.push(JSON.stringify(errMsg));
        return results;
    }
}
