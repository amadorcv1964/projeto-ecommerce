/**
 * Game Mania E-commerce | Split Payment Multimodal, Cupons, QR Code Pix & LGPD
 * SENAI UC09 - Codificação Front-End
 */

let currentPaymentMethod = "PIX_ONLY";
let appliedCoupon = null;
let useLoyaltyPoints = false;

function openCheckoutModal() {
    if (!cartItems || cartItems.length === 0) {
        alert("Seu carrinho está vazio! Adicione algum produto para prosseguir.");
        return;
    }

    closeCartDrawer();
    const modal = document.getElementById("checkoutModal");
    if (modal) {
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
    }

    updateCheckoutSummary();
    renderPaymentFields();
}

function closeCheckoutModal() {
    const modal = document.getElementById("checkoutModal");
    if (modal) {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
    }
}

function handlePaymentMethodChange(method) {
    currentPaymentMethod = method;
    updateCheckoutSummary();
    renderPaymentFields();
}

function toggleLoyaltyPoints(checked) {
    useLoyaltyPoints = checked;
    updateCheckoutSummary();
}

function applyCouponCode() {
    const input = document.getElementById("couponCodeInput");
    const feedback = document.getElementById("couponFeedbackMessage");
    const code = input.value.trim().toUpperCase();

    if (!code) {
        feedback.textContent = "Digite um código de cupom.";
        feedback.style.color = "var(--siemens-accent-red)";
        return;
    }

    const coupon = window.PROMO_COUPONS[code];
    if (!coupon) {
        feedback.textContent = "Cupom inválido ou expirado. Tente SHADOW10 ou HYPESENAI.";
        feedback.style.color = "var(--siemens-accent-red)";
        appliedCoupon = null;
    } else {
        appliedCoupon = { code: code, ...coupon };
        feedback.textContent = `✓ ${coupon.description}`;
        feedback.style.color = "var(--siemens-green-pix)";
    }
    updateCheckoutSummary();
}

function calculateCheckoutTotals() {
    const subtotal = cartItems.reduce((acc, item) => acc + (item.priceOriginal * item.quantity), 0);
    let pixDiscount = 0;
    let couponDiscount = 0;
    let loyaltyDiscount = 0;

    // Desconto Pix (15% apenas se pago integralmente via Pix)
    if (currentPaymentMethod === "PIX_ONLY") {
        pixDiscount = subtotal * 0.15;
    }

    // Desconto Cupom
    if (appliedCoupon) {
        couponDiscount = (subtotal - pixDiscount) * (appliedCoupon.discountPercent / 100);
    }

    // Desconto Fidelidade
    if (useLoyaltyPoints) {
        const user = getStoredUser();
        const availableBlocks = Math.floor(user.loyaltyPoints / 100);
        loyaltyDiscount = availableBlocks * 5.0;
        const maxAllowed = (subtotal - pixDiscount - couponDiscount);
        if (loyaltyDiscount > maxAllowed) loyaltyDiscount = maxAllowed;
    }

    const finalTotal = Math.max(0, subtotal - pixDiscount - couponDiscount - loyaltyDiscount);

    return { subtotal, pixDiscount, couponDiscount, loyaltyDiscount, finalTotal };
}

function updateCheckoutSummary() {
    const totals = calculateCheckoutTotals();

    // Renderizar prévia dos itens
    const previewContainer = document.getElementById("checkoutItemsPreview");
    if (previewContainer) {
        previewContainer.innerHTML = cartItems.map(item => `
            <div class="checkout-preview-row">
                <span>${item.quantity}x ${item.name}</span>
                <strong>R$ ${(item.priceOriginal * item.quantity).toFixed(2).replace(".", ",")}</strong>
            </div>
        `).join("");
    }

    document.getElementById("checkoutSubtotalDisplay").textContent = `R$ ${totals.subtotal.toFixed(2).replace(".", ",")}`;

    const pixRow = document.getElementById("pixDiscountRow");
    if (totals.pixDiscount > 0) {
        pixRow.style.display = "flex";
        document.getElementById("pixDiscountDisplay").textContent = `- R$ ${totals.pixDiscount.toFixed(2).replace(".", ",")}`;
    } else {
        pixRow.style.display = "none";
    }

    const couponRow = document.getElementById("couponDiscountRow");
    if (totals.couponDiscount > 0) {
        couponRow.style.display = "flex";
        document.getElementById("couponDiscountDisplay").textContent = `- R$ ${totals.couponDiscount.toFixed(2).replace(".", ",")}`;
    } else {
        couponRow.style.display = "none";
    }

    const loyaltyRow = document.getElementById("loyaltyDiscountRow");
    const loyaltyText = document.getElementById("loyaltyDiscountAppliedText");
    if (totals.loyaltyDiscount > 0) {
        loyaltyRow.style.display = "flex";
        document.getElementById("loyaltyDiscountDisplay").textContent = `- R$ ${totals.loyaltyDiscount.toFixed(2).replace(".", ",")}`;
        loyaltyText.textContent = `Desconto de R$ ${totals.loyaltyDiscount.toFixed(2).replace(".", ",")} aplicado com sucesso!`;
    } else {
        loyaltyRow.style.display = "none";
        loyaltyText.textContent = "";
    }

    document.getElementById("checkoutFinalTotalDisplay").textContent = `R$ ${totals.finalTotal.toFixed(2).replace(".", ",")}`;
}

function renderPaymentFields() {
    const container = document.getElementById("paymentFieldsContainer");
    const lgpdContainer = document.getElementById("lgpdConsentContainer");
    const totals = calculateCheckoutTotals();

    if (currentPaymentMethod === "PIX_ONLY") {
        lgpdContainer.style.display = "none";
        container.innerHTML = `
            <div style="text-align: center; padding: 10px 0;">
                <span style="font-size: 32px;">⚡</span>
                <h4 style="color: var(--siemens-green-pix); margin: 6px 0;">Desconto Especial de 15% Aplicado!</h4>
                <p style="font-size: 12px; color: var(--siemens-text-muted);">Ao clicar em concluir, geraremos o QR Code Oficial do Pix com expiração em 15 minutos.</p>
            </div>
        `;
    } else if (currentPaymentMethod === "DEBIT_ONLY" || currentPaymentMethod === "CREDIT_ONLY") {
        lgpdContainer.style.display = "block";
        container.innerHTML = getSingleCardFormHtml("Cartão Único", totals.finalTotal);
    } else if (currentPaymentMethod === "SPLIT_PIX_DEBIT" || currentPaymentMethod === "SPLIT_PIX_CREDIT") {
        lgpdContainer.style.display = "block";
        const half = (totals.finalTotal / 2).toFixed(2);
        container.innerHTML = `
            <div class="form-group">
                <label>Valor a ser pago no Pix (R$):</label>
                <input type="number" id="splitPixAmount" value="${half}" step="0.01" onchange="recalculateCardBalance(this.value, ${totals.finalTotal})">
            </div>
            <div class="form-group">
                <label>Saldo restante no Cartão:</label>
                <input type="text" id="splitCardRemaining" value="R$ ${(totals.finalTotal - half).toFixed(2).replace(".", ",")}" readonly>
            </div>
            ${getSingleCardFormHtml("Dados do Cartão")}
        `;
    } else if (currentPaymentMethod === "SPLIT_TWO_CARDS") {
        lgpdContainer.style.display = "block";
        const half = (totals.finalTotal / 2).toFixed(2);
        container.innerHTML = `
            <div style="background: rgba(0, 163, 224, 0.1); border-left: 3px solid var(--siemens-cyan); padding: 10px; margin-bottom: 14px; font-size: 12px;">
                <strong>Multi-Titular:</strong> Permite utilizar 2 cartões de crédito inclusive de pessoas diferentes.
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                <div>
                    <h5 style="color: var(--siemens-cyan); margin-bottom: 8px;">Primeiro Cartão (Cartão 1)</h5>
                    <div class="form-group">
                        <label>Valor no Cartão 1 (R$):</label>
                        <input type="number" id="splitCard1Amount" value="${half}" step="0.01" onchange="recalculateTwoCardsBalance(this.value, ${totals.finalTotal})">
                    </div>
                    ${getCardInputsOnly("card1")}
                </div>
                <div>
                    <h5 style="color: var(--siemens-cyan); margin-bottom: 8px;">Segundo Cartão (Cartão 2)</h5>
                    <div class="form-group">
                        <label>Valor no Cartão 2 (R$):</label>
                        <input type="text" id="splitCard2Remaining" value="R$ ${(totals.finalTotal - half).toFixed(2).replace(".", ",")}" readonly>
                    </div>
                    ${getCardInputsOnly("card2")}
                </div>
            </div>
        `;
    }
}

function recalculateCardBalance(pixVal, total) {
    const val = parseFloat(pixVal) || 0;
    const rem = Math.max(0, total - val);
    document.getElementById("splitCardRemaining").value = `R$ ${rem.toFixed(2).replace(".", ",")}`;
}

function recalculateTwoCardsBalance(card1Val, total) {
    const val = parseFloat(card1Val) || 0;
    const rem = Math.max(0, total - val);
    document.getElementById("splitCard2Remaining").value = `R$ ${rem.toFixed(2).replace(".", ",")}`;
}

function getSingleCardFormHtml(labelTitle) {
    return `
        <h5 style="color: var(--siemens-cyan); margin-bottom: 10px;">${labelTitle}</h5>
        ${getCardInputsOnly("cardSolo")}
    `;
}

function getCardInputsOnly(prefix) {
    return `
        <div class="form-group">
            <label>Nome do Titular (Como no cartão):</label>
            <input type="text" id="${prefix}Holder" placeholder="Ex: LUCAS S RAMOS" required>
        </div>
        <div class="form-group">
            <label>Número do Cartão:</label>
            <input type="text" id="${prefix}Number" placeholder="0000 0000 0000 0000" maxlength="19" required>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="form-group">
                <label>Validade:</label>
                <input type="text" id="${prefix}Expiry" placeholder="MM/AA" maxlength="5" required>
            </div>
            <div class="form-group">
                <label>CVV (Não salvo):</label>
                <input type="password" id="${prefix}Cvv" placeholder="•••" maxlength="4" required>
            </div>
        </div>
    `;
}

function processFinalCheckout() {
    const totals = calculateCheckoutTotals();
    const consentLGPD = document.getElementById("checkLGPDSaveCard")?.checked;

    // Se houve consentimento, salvar cartão de forma mascarada (LGPD Art. 7º, I)
    if (consentLGPD) {
        if (currentPaymentMethod === "DEBIT_ONLY" || currentPaymentMethod === "CREDIT_ONLY" || currentPaymentMethod.startsWith("SPLIT_PIX")) {
            const holder = document.getElementById("cardSoloHolder")?.value || "LUCAS RAMOS";
            const num = document.getElementById("cardSoloNumber")?.value || "4242424242424242";
            const exp = document.getElementById("cardSoloExpiry")?.value || "12/29";
            maybeSaveCardLGPD(holder, num, exp, "Cartão Principal");
        } else if (currentPaymentMethod === "SPLIT_TWO_CARDS") {
            const h1 = document.getElementById("card1Holder")?.value || "TITULAR 1";
            const n1 = document.getElementById("card1Number")?.value || "1111222233334444";
            const e1 = document.getElementById("card1Expiry")?.value || "10/28";
            maybeSaveCardLGPD(h1, n1, e1, "Cartão 1");

            const h2 = document.getElementById("card2Holder")?.value || "TITULAR 2";
            const n2 = document.getElementById("card2Number")?.value || "5555666677778888";
            const e2 = document.getElementById("card2Expiry")?.value || "11/29";
            maybeSaveCardLGPD(h2, n2, e2, "Cartão 2");
        }
    }

    // Deduzir pontos se utilizados
    if (useLoyaltyPoints && totals.loyaltyDiscount > 0) {
        const pointsDeducted = Math.floor(totals.loyaltyDiscount / 5) * 100;
        deductLoyaltyPoints(pointsDeducted);
    }

    // Conceder novos pontos pela compra
    const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const earnedPoints = Math.floor(totals.finalTotal / 2) + (totalQty >= 2 ? totalQty * 10 : 0);
    awardLoyaltyPoints(earnedPoints, "Compra no E-commerce Game Mania");

    // Limpar carrinho
    cartItems = [];
    saveCartToStorage();
    renderCart();

    closeCheckoutModal();
    showOrderSuccessReceipt(totals, earnedPoints);
}

function showOrderSuccessReceipt(totals, earnedPoints) {
    const successModal = document.getElementById("orderSuccessModal");
    const orderNum = `GM-${Math.floor(10000 + Math.random() * 90000)}`;

    document.getElementById("successOrderNumber").textContent = `Pedido #${orderNum}`;
    document.getElementById("successTotalPaid").textContent = `R$ ${totals.finalTotal.toFixed(2).replace(".", ",")}`;
    document.getElementById("successPaymentMethod").textContent = getMethodReadableName(currentPaymentMethod);
    document.getElementById("successPointsEarned").textContent = earnedPoints;

    const pixReceipt = document.getElementById("pixReceiptContainer");
    const hasPix = currentPaymentMethod.includes("PIX");

    if (hasPix) {
        pixReceipt.style.display = "block";
        const pixAmount = currentPaymentMethod === "PIX_ONLY" ? totals.finalTotal : (parseFloat(document.getElementById("splitPixAmount")?.value) || totals.finalTotal / 2);
        document.getElementById("pixAllocatedDisplay").textContent = `R$ ${pixAmount.toFixed(2).replace(".", ",")}`;
        
        const randomHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const pixCode = `00020126580014BR.GOV.BCB.PIX0136gamemania-centro-sp@banco.com520400005303986540${pixAmount.toFixed(2)}5802BR5916GAME MANIA SP6009SAO PAULO62070503***6304${randomHash.toUpperCase()}`;
        document.getElementById("pixCopyPasteInput").value = pixCode;
        renderMathSvgQrCode();
    } else {
        pixReceipt.style.display = "none";
    }

    successModal.classList.add("active");
    successModal.setAttribute("aria-hidden", "false");
}

function renderMathSvgQrCode() {
    const wrapper = document.getElementById("qrCodeWrapper");
    // Renderiza SVG geométrico procedural estilo QR Code real
    let rects = "";
    const size = 15;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const isCornerFinder = (r < 4 && c < 4) || (r < 4 && c >= size - 4) || (r >= size - 4 && c < 4);
            const isRandomPixel = Math.random() > 0.45;
            if (isCornerFinder || isRandomPixel) {
                rects += `<rect x="${c * 10}" y="${r * 10}" width="9" height="9" fill="#001826" />`;
            }
        }
    }
    wrapper.innerHTML = `
        <svg viewBox="0 0 150 150" width="160" height="160" xmlns="http://www.w3.org/2000/svg">
            <rect width="150" height="150" fill="#FFFFFF" />
            ${rects}
        </svg>
    `;
}

function copyPixCode() {
    const input = document.getElementById("pixCopyPasteInput");
    input.select();
    navigator.clipboard.writeText(input.value).then(() => {
        alert("Código Pix Copia e Cola copiado para a área de transferência!");
    });
}

function getMethodReadableName(method) {
    const map = {
        "PIX_ONLY": "⚡ Pix à Vista (15% OFF)",
        "DEBIT_ONLY": "💳 Cartão de Débito",
        "CREDIT_ONLY": "💳 Cartão de Crédito",
        "SPLIT_PIX_DEBIT": "⚡ + 💳 Pix + Cartão de Débito",
        "SPLIT_PIX_CREDIT": "⚡ + 💳 Pix + Cartão de Crédito",
        "SPLIT_TWO_CARDS": "👥 2 Cartões de Crédito (Titulares Distintos)"
    };
    return map[method] || method;
}

function closeSuccessModal() {
    const modal = document.getElementById("orderSuccessModal");
    if (modal) {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
    }
}