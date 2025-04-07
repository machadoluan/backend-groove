import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnalyticsLog } from './analytics-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(AnalyticsLog)
    private readonly analyticsRepo: Repository<AnalyticsLog>,
  ) {}

  async logEvent(event: string, userId?: string, ip?: string) {
    const log = this.analyticsRepo.create({ event, userId, ip });
    await this.analyticsRepo.save(log);
  }

  private async countEvent(event: string): Promise<number> {
    return this.analyticsRepo.count({ where: { event } });
  }

  async getDashboardMetrics() {
    return {
      acessosPorIPFixo: await this.analyticsRepo
        .createQueryBuilder('log')
        .select('COUNT(DISTINCT log.ip)', 'count')
        .where('log.ip IS NOT NULL')
        .getRawOne()
        .then(res => +res.count),

      discordsVinculados: await this.countEvent('vinculo_discord'), //
      acessosTotais: await this.countEvent('acesso_site'), //
      cliquesDiscord: await this.countEvent('clique_discord'), //
      cliquesListaEspera: await this.countEvent('clique_lista_espera'), //
      cliquesFecharTelaLista: await this.countEvent('clique_fechar_lista'),
      cliquesCompraVipDiamante: await this.countEvent('clique_vip_diamante'),
      fazerAllowlist: await this.countEvent('fazer_allowlist'),
      cancelarAllowlist: await this.countEvent('cancelar_allowlist'),
    };
  }
}
