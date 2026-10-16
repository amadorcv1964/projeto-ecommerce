# Game Mania | E-commerce Gamer Oficial
### SENAI-SP • Escola Jorge Mahfuz • UC09: Codificação Front-End
**Docente:** Eduardo Casavella  
**Discente:** Amador Corrêa Vicente  
**GitHub Pages:** [https://amadorcv1964.github.io/projeto-ecommerce/](https://amadorcv1964.github.io/projeto-ecommerce/)

---

## 🎯 Sobre o Projeto
Aplicação Front-End completa e responsiva desenvolvida para a rede **Game Mania**, loja especializada em hardware e cultura gamer no Centro de São Paulo - SP com distribuição nacional.

O projeto implementa com fidelidade matemática a arquitetura de layout aprovada nos Rafes e Mockups da SA1:
1. **Desktop (1280px / 12 colunas):** Topbar de confiança, busca preditiva, hero duplo com PC Gamer Challenger, catálogo em 4 colunas e shorts de benchmark.
2. **Tablet (768px / 8 colunas):** Reorganização fluida, menu horizontal em carrossel e catálogo em 3 colunas.
3. **Mobile (390px / Mobile First):** Header compacto, busca full-width, catálogo em 2 colunas e **Bottom Navigation Bar fixa** no rodapé.

---

## 🚀 Funcionalidades Chave Implementadas
* **Autenticação Interativa & Persona:** Login funcional com alternância de estados e dados da persona Lucas "Shadow" Ramos.
* **Clube de Fidelidade:** Motor de pontuação que concede pontos por compras (1 pt a cada R$ 2,00 + bônus de 10 pts/item), consultas técnicas (+5 pts) e testes de shorts (+15 pts), com resgate real no checkout (100 pts = R$ 5,00).
* **Cupons Promocionais de Campanha:** Validação dinâmica dos cupons `SHADOW10` (10% OFF) e `HYPESENAI` (15% OFF).
* **Split Payment Multimodal (6 modalidades):**
  1. Apenas Pix (com 15% OFF à vista).
  2. Cartão de Débito.
  3. Cartão de Crédito (até 12x).
  4. Pix + Cartão de Débito.
  5. Pix + Cartão de Crédito.
  6. **2 Cartões de Crédito com Titulares Distintos:** Composição de limites entre cartões com formulários e titulares independentes.
* **Simulacro de QR Code Pix:** Geração visual de SVG vetorial de QR Code e código Copia e Cola funcional.
* **Privacidade & Conformidade LGPD (Lei nº 13.709/2018):**
  * Consentimento livre, informado e explícito via checkbox (Art. 7º, I).
  * Mascaramento rigoroso de cartões (`•••• •••• •••• 4242`).
  * Descarte imediato e não persistência de CVV (padrão internacional PCI-DSS).
  * Painel de visualização e botão de exclusão/revogação dos dados de cartão no perfil.

---

## 🧪 Roteiro de Testes para Avaliação
1. **Responsividade:** Abra o site no navegador e redimensione a janela entre Desktop (>992px), Tablet (768px) e Mobile (390px) para testar os breakpoints e o surgimento da Bottom Nav Bar.
2. **Shorts & Fidelidade:** Clique em qualquer um dos 3 cards de Shorts para testar o vídeo e verificar o acúmulo de **+15 pontos** no saldo.
3. **Carrinho:** Adicione o PC Gamer Challenger ou outros produtos ao carrinho.
4. **Checkout:** Avance para o checkout e teste os cupons `SHADOW10` e a opção de marcar para resgatar pontos.
5. **Split Payment:** Alterne para "2 Cartões (Titulares Distintos)" para testar a divisão de valores entre dois titulares.