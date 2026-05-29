import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This route can be called by Vercel Cron or any external service to keep the database active
// Vercel Hobby tier allows 1-2 free cron jobs per day.
export async function GET(request: Request) {
    try {
        // Optional: Secure the endpoint using Vercel's CRON_SECRET
        const authHeader = request.headers.get('authorization');
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Run a lightweight query to keep the Supabase database awake
        const count = await prisma.tool.count();
        
        return NextResponse.json({ 
            success: true, 
            message: 'Database pinged successfully to prevent Supabase pause',
            timestamp: new Date().toISOString(),
            toolsCount: count 
        });
    } catch (error) {
        console.error('Keep-alive ping failed:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to ping database' 
        }, { status: 500 });
    }
}
