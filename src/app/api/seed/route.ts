import { NextResponse } from 'next/server';
import { seedData } from '@/utils/seeder';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log('Starting seed process...');
        const results = await seedData();
        console.log('Seed process completed.');
        
        return NextResponse.json({
            message: 'Seeding process completed',
            summary: {
                ownersCreated: results.owners.length,
                propertiesCreated: results.properties.length,
                inspectionsCreated: results.inspections.length,
                totalErrors: results.errors.length,
            },
            errors: results.errors,
            logs: results.logs,
            data: {
                owners: results.owners,
            }
        });
    } catch (error: any) {
        console.error('Seed error:', error);
        return NextResponse.json({
            message: 'Seeding process failed',
            error: error.message
        }, { status: 500 });
    }
}
