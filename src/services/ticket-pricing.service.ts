import { TicketType, TicketQuantities, TicketPricing } from '../types';

/**
 * Serviço para cálculo de preços de ingressos
 * Gerencia a lógica de negócio relacionada a tipos de ingresso (Inteira/Meia)
 */
export class TicketPricingService {

    /**
     * Percentual de desconto para meia-entrada
     */
    private static readonly MEIA_DISCOUNT = 0.5;

    /**
     * Percentual máximo de meias-entradas permitido
     */
    private static readonly MAX_MEIA_PERCENTAGE = 50;

    /**
     * Calcula o preço de um ingresso baseado no tipo
     * @param basePrice - Preço base da sessão
     * @param ticketType - Tipo do ingresso ('inteira' ou 'meia')
     * @returns Preço final do ingresso
     */
    static calculateTicketPrice(basePrice: number, ticketType: TicketType): number {
        if (ticketType === 'meia') {
            return basePrice * this.MEIA_DISCOUNT;
        }
        return basePrice;
    }

    /**
     * Calcula o preço total de múltiplos ingressos
     * @param basePrice - Preço base da sessão
     * @param quantities - Quantidade de ingressos por tipo
     * @returns Objeto com preços detalhados
     */
    static calculateTotalPrice(
        basePrice: number,
        quantities: TicketQuantities
    ): TicketPricing {
        const inteiraPrice = basePrice * quantities.inteira;
        const meiaPrice = (basePrice * this.MEIA_DISCOUNT) * quantities.meia;
        const total = inteiraPrice + meiaPrice;

        return {
            inteira: inteiraPrice,
            meia: meiaPrice,
            total
        };
    }

    /**
     * Valida se a quantidade de meias-entradas não excede o limite
     * Regra de negócio: máximo 50% do total de ingressos podem ser meia-entrada
     * @param inteiraQty - Quantidade de ingressos inteiros
     * @param meiaQty - Quantidade de meias-entradas
     * @returns Objeto com resultado da validação
     */
    static validateMeiaQuantity(
        inteiraQty: number,
        meiaQty: number
    ): { isValid: boolean; message?: string } {
        // Se não há meias, está válido
        if (meiaQty === 0) {
            return { isValid: true };
        }

        // Se não há ingressos inteiros mas há meias, validar se não excede 100%
        if (inteiraQty === 0 && meiaQty > 0) {
            return {
                isValid: false,
                message: 'É necessário ter pelo menos um ingresso inteiro na compra.'
            };
        }

        const total = inteiraQty + meiaQty;
        const meiaPercentage = (meiaQty / total) * 100;

        if (meiaPercentage > this.MAX_MEIA_PERCENTAGE) {
            return {
                isValid: false,
                message: `A quantidade de meias-entradas não pode exceder ${this.MAX_MEIA_PERCENTAGE}% do total de ingressos. Você está tentando ${meiaPercentage.toFixed(0)}%.`
            };
        }

        return { isValid: true };
    }

    /**
     * Valida se há pelo menos um ingresso sendo comprado
     * @param quantities - Quantidade de ingressos por tipo
     * @returns Objeto com resultado da validação
     */
    static validateMinimumTickets(
        quantities: TicketQuantities
    ): { isValid: boolean; message?: string } {
        const total = quantities.inteira + quantities.meia;

        if (total === 0) {
            return {
                isValid: false,
                message: 'É necessário selecionar pelo menos um ingresso.'
            };
        }

        return { isValid: true };
    }

    /**
     * Formata detalhes dos ingressos para exibição
     * @param quantities - Quantidade de ingressos por tipo
     * @returns String formatada para exibição
     */
    static formatTicketDetails(quantities: TicketQuantities): string {
        const parts: string[] = [];

        if (quantities.inteira > 0) {
            parts.push(`${quantities.inteira} inteira(s)`);
        }

        if (quantities.meia > 0) {
            parts.push(`${quantities.meia} meia(s)`);
        }

        return parts.length > 0 ? parts.join(' + ') : 'Nenhum ingresso';
    }

    /**
     * Formata preço para exibição em Real (BRL)
     * @param price - Valor a ser formatado
     * @returns String formatada (ex: "R$ 25,00")
     */
    static formatPrice(price: number): string {
        return `R$ ${price.toFixed(2).replace('.', ',')}`;
    }

    /**
     * Calcula o total de ingressos
     * @param quantities - Quantidade de ingressos por tipo
     * @returns Total de ingressos
     */
    static getTotalTickets(quantities: TicketQuantities): number {
        return quantities.inteira + quantities.meia;
    }

    /**
     * Valida todas as regras de negócio para venda de ingressos
     * @param basePrice - Preço base da sessão
     * @param quantities - Quantidade de ingressos por tipo
     * @returns Objeto com resultado da validação completa
     */
    static validateTicketSale(
        basePrice: number,
        quantities: TicketQuantities
    ): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Validar se há ingressos
        const minValidation = this.validateMinimumTickets(quantities);
        if (!minValidation.isValid) {
            errors.push(minValidation.message!);
        }

        // Validar proporção de meias
        const meiaValidation = this.validateMeiaQuantity(quantities.inteira, quantities.meia);
        if (!meiaValidation.isValid) {
            errors.push(meiaValidation.message!);
        }

        // Validar preço base
        if (basePrice <= 0) {
            errors.push('Preço base da sessão inválido.');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Calcula o desconto total aplicado (diferença entre preço cheio e preço com desconto)
     * @param basePrice - Preço base da sessão
     * @param quantities - Quantidade de ingressos por tipo
     * @returns Valor total de desconto
     */
    static calculateTotalDiscount(
        basePrice: number,
        quantities: TicketQuantities
    ): number {
        const fullPrice = basePrice * (quantities.inteira + quantities.meia);
        const pricing = this.calculateTotalPrice(basePrice, quantities);
        return fullPrice - pricing.total;
    }

    /**
     * Gera um resumo detalhado da compra
     * @param basePrice - Preço base da sessão
     * @param quantities - Quantidade de ingressos por tipo
     * @returns Objeto com resumo completo
     */
    static generatePurchaseSummary(
        basePrice: number,
        quantities: TicketQuantities
    ) {
        const pricing = this.calculateTotalPrice(basePrice, quantities);
        const totalTickets = this.getTotalTickets(quantities);
        const discount = this.calculateTotalDiscount(basePrice, quantities);

        return {
            quantities,
            pricing,
            totalTickets,
            discount,
            formattedDetails: this.formatTicketDetails(quantities),
            formattedTotal: this.formatPrice(pricing.total),
            formattedDiscount: this.formatPrice(discount)
        };
    }
}
