import { Controller, Post, Body, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Response } from 'express';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post('checkout')
    gerarCheckout(@Body() body: { nome: string; preco: number; quantidade: number, license: string }) {
        return this.paymentService.gerarLinkPagamento(body);
    }

    @Post('webhook')
    async receberWebhook(@Body() body: any) {
        if (body.status !== 'paid') return { ignored: true };

        await this.paymentService.registrarPagamento(body);

        const { items } = body;

        const license = items?.[0]?.license;

        if (!license) {
            console.error('❌ License não encontrada no item');
            return { error: 'Missing license' };
        }



        return { received: true };
    }

}