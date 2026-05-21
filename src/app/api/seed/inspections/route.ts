import { NextResponse } from 'next/server';
import { seedInspections } from '@/utils/inspectionSeeder';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log('Starting inspection seed process...');
        const results = await seedInspections();
        console.log('Inspection seed process completed.');
        
        return NextResponse.json({
            message: 'Inspection seeding process completed',
            summary: {
                logsCount: results.logs.length,
                totalErrors: results.errors.length,
            },
            errors: results.errors,
            logs: results.logs
        });
    } catch (error: any) {
        console.error('Inspection seed error:', error);
        return NextResponse.json({
            message: 'Inspection seeding process failed',
            error: error.message
        }, { status: 500 });
    }
}
