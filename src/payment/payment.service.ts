import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class PaymentService {
    constructor(private configService: ConfigService
    ) { }
    private readonly PAGBANK_URL = this.configService.get<string>('PAGBANK_URL');
    private readonly PAGBANK_TOKEN = this.configService.get<string>('PAGBANK_TOKEN');

    async createCheckout(amount: number, itemName: string) {
        const transactionId = Math.random().toString(36).substr(2, 9);

        const data = {
            amount: {
                value: amount * 100, // PagSeguro usa centavos
                currency: "BRL",
            },
            itemName,
            redirect_url: "https://seusite.com/retorno",
            items: [
                {
                    reference_id: transactionId,
                    name: itemName,
                    quantity: 1,
                    unit_amount: amount * 100,
                },
            ],
        };

        try {
            const response = await axios.post(this.PAGBANK_URL, data, {
                headers: {
                    Authorization: `Bearer ${this.PAGBANK_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            });

            // Buscar o link correto de pagamento
            const payLink = response.data.links.find(link => link.rel === 'PAY')?.href;

            if (!payLink) {
                throw new Error('Nenhum link de pagamento encontrado');
            }

            return { checkoutUrl: payLink };
        } catch (error) {
            console.error('Erro ao criar checkout:', error.response?.data || error.message);
            throw new Error('Erro ao criar checkout: ' + error.message);
        }
    }
}
