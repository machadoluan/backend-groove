import { Controller, Post, Body, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Response } from 'express';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post('checkout')
    async createCheckout(@Body() body: { amount: number; description: string }) {

        if (!body.amount || isNaN(body.amount)) {
            return { error: 'O valor do pagamento é inválido.' };
        }

        return this.paymentService.createCheckout(body.amount, body.description);
    }
}