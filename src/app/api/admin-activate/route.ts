import { NextResponse } from 'next/server';
import { adminActivate } from '@/utils/adminActivator';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log('Starting admin activation process...');
        const results = await adminActivate();
        console.log('Admin activation process completed.');
        
        return NextResponse.json({
            message: 'Activation process completed',
            summary: {
                publishedProperties: results.publishedProperties,
                totalErrors: results.errors.length,
            },
            errors: results.errors,
            logs: results.logs
        });
    } catch (error: any) {
        console.error('Activation error:', error);
        return NextResponse.json({
            message: 'Activation process failed',
            error: error.message
        }, { status: 500 });
    }
}
