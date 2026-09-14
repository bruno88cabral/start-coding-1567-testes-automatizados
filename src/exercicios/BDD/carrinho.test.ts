import { calcularDesconto, calcularFrete, calcularTotal, Carrinho } from "./carrinho"

describe('calcularDesconto', () => {
    it('deve retornar 0 quando não há cupom', () => {
        const carrinho: Carrinho = {
            itens: [{ nome: 'Produto', precoEmCentavos: 5000, quantidade: 1 }]
        }
        expect(calcularDesconto(carrinho)).toBe(0)
    })
    it('deve aplicar desconto percentual', () => {
        const carrinho: Carrinho = {
            itens: [{ nome: 'Produto', precoEmCentavos: 5000, quantidade: 1 }],
            cupom: { tipo: 'percentual', percentual: 10 }
        }
        expect(calcularDesconto(carrinho)).toBe(500) // 10% of R$50
    })
    it('deve aplicar desconto fixo', () => {
        const carrinho: Carrinho = {
            itens: [{ nome: 'Produto', precoEmCentavos: 5000, quantidade: 1 }], // R$50
            cupom: { tipo: 'fixo', valorEmCentavos: 1000 } // R$10 off
        }
        expect(calcularDesconto(carrinho)).toBe(1000) // R$10
    })
    it('deve limitar desconto fixo ao valor do subtotal', () => {
        const carrinho: Carrinho = {
            itens: [{ nome: 'Produto', precoEmCentavos: 5000, quantidade: 1 }], // R$50
            cupom: { tipo: 'fixo', valorEmCentavos: 9999 } // R$99,99 off (maior que o subtotal)
        }
        expect(calcularDesconto(carrinho)).toBe(5000) // capped at R$50
    })
})

describe('calcularFrete', () => {
    it('deve retornar 0 quando carrinho está vazio', () => {
        const carrinho: Carrinho = { itens: [] }
        expect(calcularFrete(carrinho)).toBe(0)
    })
    it('deve retornar 0 quando total é maior que R$200', () => {
        const carrinho: Carrinho = {
            itens: [{ nome: 'Produto', precoEmCentavos: 50000, quantidade: 1 }] // R$500
        }
        expect(calcularFrete(carrinho)).toBe(0)
    })
    it('deve cobrar frete quando total é menor que R$200', () => {
        const carrinho: Carrinho = {
            itens: [{ nome: 'Produto', precoEmCentavos: 1000, quantidade: 1 }] // R$10
        }
        expect(calcularFrete(carrinho)).toBe(1500) // R$15
    })
})

describe('calcularTotal', () => {
    it('deve retornar subtotal + frete sem cupom', () => {
        const carrinho: Carrinho = {
            itens: [{ nome: 'Produto', precoEmCentavos: 1000, quantidade: 1 }] // R$10 + R$15 frete
        }
        expect(calcularTotal(carrinho)).toBe(2500) // R$25
    })
    it('deve retornar subtotal - desconto + frete com cupom', () => {
        const carrinho: Carrinho = {
            itens: [{ nome: 'Produto', precoEmCentavos: 50000, quantidade: 1 }], // R$500
            cupom: { tipo: 'percentual', percentual: 10 } // 10% off = R$50
        }
        expect(calcularTotal(carrinho)).toBe(45000) // R$450 + R$0 frete
    })
})