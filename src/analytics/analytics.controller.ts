import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Request } from 'express';

@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Post('log')
    async logEvent(
        @Body('event') event: string,
        @Req() req: Request,
        @Body('userId') userId?: string,
    ) {
        const ip =this.getClientIp(req);
        await this.analyticsService.logEvent(event, userId, ip);
        return { success: true };
    }

    @Get('dashboard')
    async getMetrics() {
        return this.analyticsService.getDashboardMetrics();
    }

    getClientIp(req: Request): string {
        const xForwardedFor = req.headers['x-forwarded-for'] as string;
        let ip = xForwardedFor?.split(',')[0]?.trim() || req.socket.remoteAddress || req.ip;

        // Remove "::ffff:" se estiver presente
        if (ip?.startsWith('::ffff:')) {
            ip = ip.replace('::ffff:', '');
        }

        return ip;
    }
}
