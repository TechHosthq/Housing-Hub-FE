import { NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

const API_BASE_URL = 'https://pk1wr06fr1.execute-api.af-south-1.amazonaws.com/dev';
const ADMIN_API_BASE = 'https://3tgjb2crdf.execute-api.af-south-1.amazonaws.com/admin';

export async function GET() {
    const logs: string[] = [];
    const errors: string[] = [];

    const log = (msg: string) => {
        console.log(`[KYC Seeder] ${msg}`);
        logs.push(msg);
    };

    try {
        log('Starting KYC seed process...');

        // 1. Log in the owner
        const ownerEmail = 'jeremyvictor788@gmail.com';
        const ownerPassword = 'Saladin123!@#';
        log(`Logging in owner: ${ownerEmail}...`);
        
        let ownerToken = '';
        let ownerId = '';

        try {
            const ownerLoginRes = await axios.post(`${API_BASE_URL}/api/v1/Auth/login`, {
                emailOrPhone: ownerEmail,
                password: ownerPassword,
            });
            ownerToken = ownerLoginRes.data.data.token;
            ownerId = ownerLoginRes.data.data.id;
            log(`Owner login successful. ID: ${ownerId}`);
        } catch (err: any) {
            const msg = `Owner login failed: ${err?.response?.data?.message || err.message}`;
            log(msg);
            errors.push(msg);
            throw new Error(msg);
        }

        // 2. Perform KYC Submission as the Owner
        log(`Submitting KYC for owner: ${ownerEmail}...`);
        const kycPayload = {
            customerId: ownerId,
            dateOfBirth: '1990-01-01',
            nationalIdNumber: '12345678901',
            idType: 1, // Passport / National ID
            idDocumentUrl: 'https://realestacy-kyc-documents.s3.amazonaws.com/mock-id.png',
            jobTitle: 'Real Estate Investor',
            companyName: 'Victor Holdings',
            industry: 'Real Estate'
        };

        try {
            const kycSubmitRes = await axios.post(`${API_BASE_URL}/api/v1/Customer/kyc`, kycPayload, {
                headers: { 'Authorization': `Bearer ${ownerToken}` }
            });
            log(`KYC submission successful: ${JSON.stringify(kycSubmitRes.data)}`);
        } catch (err: any) {
            // If already submitted or exists, log warning but continue
            const msg = `KYC submission warning: ${err?.response?.data?.message || err.message}`;
            log(msg);
        }

        // 3. Log in as the Admin (using the Admin API Auth login endpoint)
        const adminEmail = 'ugoluwa@gmail.com';
        const adminPassword = 'Father+1';
        log(`Logging in admin: ${adminEmail}...`);
        
        let adminToken = '';

        try {
            const adminLoginRes = await axios.post(`${ADMIN_API_BASE}/admin/api/AdminAuth/login`, {
                email: adminEmail,
                password: adminPassword,
            });
            adminToken = adminLoginRes.data.token;
            log('Admin login successful.');
        } catch (err: any) {
            const msg = `Admin login failed: ${err?.response?.data?.message || err.message}`;
            log(msg);
            errors.push(msg);
            throw new Error(msg);
        }

        // 4. Perform KYC Verification / Approval by Admin
        log(`Admin verifying/approving KYC for owner: ${ownerEmail}...`);
        try {
            const verifyRes = await axios.put(
                `${ADMIN_API_BASE}/api/AdminCustomer/${ownerId}/kyc/verify?approve=true`,
                {},
                {
                    headers: { 'Authorization': `Bearer ${adminToken}` }
                }
            );
            log(`KYC verification successful: ${JSON.stringify(verifyRes.data)}`);
        } catch (err: any) {
            const msg = `KYC verification failed: ${err?.response?.data?.message || err.message}`;
            log(msg);
            errors.push(msg);
            throw new Error(msg);
        }

        log('KYC seed process successfully completed!');
        return NextResponse.json({
            isSuccessful: true,
            message: 'KYC Seeding process completed successfully',
            logs,
            errors
        });
    } catch (error: any) {
        log(`KYC Seeding failed: ${error.message}`);
        return NextResponse.json({
            isSuccessful: false,
            message: 'KYC Seeding process failed',
            logs,
            errors,
            error: error.message
        }, { status: 500 });
    }
}
