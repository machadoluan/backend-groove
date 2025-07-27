import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagamento } from './pagamento.entity';
import { Repository } from 'typeorm';


@Injectable()
export class PaymentService {
    constructor(private configService: ConfigService,
        @InjectRepository(Pagamento)
        private pagamentoRepo: Repository<Pagamento>,
    ) { }

    private readonly usuarioInfinity = 'luanmachadojs'; // seu usuário InfinityPay
    private readonly redirectUrl = 'https://groovegg.com.br/obrigado';


    gerarLinkPagamento(item: { nome: string; preco: number; quantidade: number; license: string }) {
        const { nome, preco, quantidade, license } = item;

        const items = encodeURIComponent(
            JSON.stringify([
                {
                    name: nome,
                    price: preco,
                    quantity: quantidade,
                    // 👇 Incluindo a license embutida como "meta"
                    license: license,
                },
            ])
        );

        const checkoutUrl = `https://checkout.infinitepay.io/${this.usuarioInfinity}?items=${items}&redirect_url=${encodeURIComponent(this.redirectUrl)}`;

        return { checkoutUrl };
    }


    async registrarPagamento(body: any) {
        const { status, payment_id, customer, items, total_amount } = body;

        if (status !== 'paid') return;

        const novoPagamento = this.pagamentoRepo.create({
            paymentId: payment_id,
            email: customer.email,
            nome: customer.name,
            valor: total_amount,
            itens: JSON.stringify(items),
            status,
        });

        await this.pagamentoRepo.save(novoPagamento);
    }

    
}
