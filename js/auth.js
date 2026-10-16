/**
 * Game Mania E-commerce | Gestão de Autenticação, Fidelidade & LGPD
 * SENAI UC09 - Codificação Front-End
 */

const DEFAULT_USER = {
    name: "Lucas 'Shadow' Ramos",
    email: "lucas.shadow@gamer.com",
    tier: "Gamer VIP Ouro",
    loyaltyPoints: 120,
    savedCards: [
        {
            id: "card-1",
            holderName: "LUCAS S RAMOS",
            maskedNumber: "•••• •••• •••• 4242",
            brand: "Mastercard Black",
            expiry: "09/29"
        }
    ]
};

function getStoredUser() {
    const raw = localStorage.getItem("gamemania_user");
    if (!raw) {
        localStorage.setItem("gamemania_user", JSON.stringify(DEFAULT_USER));
        return DEFAULT_USER;
    }
    try {
        return JSON.parse(raw);
    } catch (e) {
        return DEFAULT_USER;
    }
}

function saveUser(user) {
    localStorage.setItem("gamemania_user", JSON.stringify(user));
    updateUserInterface();
}

function updateUserInterface() {
    const user = getStoredUser();
    const isLoggedIn = localStorage.getItem("gamemania_logged_in") === "true";

    const headerName = document.getElementById("headerUserName");
    const headerPoints = document.getElementById("headerLoyaltyPoints");
    const profileName = document.getElementById("profileUserName");
    const profileTier = document.getElementById("profileUserTier");
    const profilePoints = document.getElementById("profileTotalPoints");
    const profileDiscount = document.getElementById("profilePointsDiscountValue");
    const checkoutPointsBalance = document.getElementById("checkoutPointsBalance");

    if (headerName) {
        headerName.textContent = isLoggedIn ? "Lucas Ramos" : "Minha Conta";
    }
    if (headerPoints) {
        headerPoints.textContent = `${user.loyaltyPoints} pts`;
    }
    if (profileName) {
        profileName.textContent = user.name;
    }
    if (profileTier) {
        profileTier.textContent = user.tier;
    }
    if (profilePoints) {
        profilePoints.textContent = user.loyaltyPoints;
    }
    if (profileDiscount) {
        const discountVal = (Math.floor(user.loyaltyPoints / 100) * 5.0).toFixed(2).replace(".", ",");
        profileDiscount.textContent = `R$ ${discountVal}`;
    }
    if (checkoutPointsBalance) {
        checkoutPointsBalance.textContent = `${user.loyaltyPoints} pts`;
    }

    renderSavedCardsList();
}

function renderSavedCardsList() {
    const container = document.getElementById("savedCardsContainer");
    if (!container) return;

    const user = getStoredUser();
    if (!user.savedCards || user.savedCards.length === 0) {
        container.innerHTML = '<p style="font-size: 12px; color: var(--siemens-text-muted);">Nenhum cartão salvo no momento.</p>';
        return;
    }

    container.innerHTML = user.savedCards.map(card => `
        <div class="saved-card-item">
            <div>
                <strong>💳 ${card.brand}</strong> - <code>${card.maskedNumber}</code><br>
                <small style="color: var(--siemens-text-muted);">Titular: ${card.holderName} • Validade: ${card.expiry}</small>
            </div>
            <button class="btn-remove-card" onclick="deleteSavedCard('${card.id}')" title="Excluir conforme LGPD">Excluir 🗑️</button>
        </div>
    `).join("");
}

function deleteSavedCard(cardId) {
    if (!confirm("LGPD: Deseja realmente revogar a autorização e excluir este cartão salvo dos nossos registros locais?")) {
        return;
    }
    const user = getStoredUser();
    user.savedCards = user.savedCards.filter(c => c.id !== cardId);
    saveUser(user);
    alert("Cartão removido com sucesso dos registros em conformidade com a LGPD.");
}

function maybeSaveCardLGPD(holderName, fullNumber, expiry, brand = "Cartão de Crédito") {
    const user = getStoredUser();
    if (!user.savedCards) user.savedCards = [];

    const cleanNum = fullNumber.replace(/\D/g, "");
    const last4 = cleanNum.slice(-4) || "0000";
    const masked = `•••• •••• •••• ${last4}`;

    const exists = user.savedCards.some(c => c.maskedNumber === masked && c.holderName === holderName.toUpperCase());
    if (!exists) {
        user.savedCards.push({
            id: `card-${Date.now()}`,
            holderName: holderName.toUpperCase(),
            maskedNumber: masked,
            brand: brand,
            expiry: expiry || "12/28"
        });
        saveUser(user);
    }
}

function awardLoyaltyPoints(amount, reason = "") {
    const user = getStoredUser();
    user.loyaltyPoints += amount;
    saveUser(user);
}

function deductLoyaltyPoints(amount) {
    const user = getStoredUser();
    user.loyaltyPoints = Math.max(0, user.loyaltyPoints - amount);
    saveUser(user);
}

function openAuthModal() {
    const modal = document.getElementById("authModal");
    const loginView = document.getElementById("loginView");
    const profileView = document.getElementById("profileView");
    const isLoggedIn = localStorage.getItem("gamemania_logged_in") === "true";

    if (modal) {
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
    }

    if (isLoggedIn) {
        loginView.classList.add("hidden");
        profileView.classList.remove("hidden");
    } else {
        loginView.classList.remove("hidden");
        profileView.classList.add("hidden");
    }
}

function closeAuthModal() {
    const modal = document.getElementById("authModal");
    if (modal) {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
    }
}

function handleLoginSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPassword").value.trim();

    if (!email || !pass) {
        alert("Por favor, preencha o e-mail e a senha.");
        return;
    }

    localStorage.setItem("gamemania_logged_in", "true");
    updateUserInterface();
    openAuthModal();
}

function handleLogout() {
    localStorage.setItem("gamemania_logged_in", "false");
    updateUserInterface();
    openAuthModal();
}

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("gamemania_logged_in") === null) {
        localStorage.setItem("gamemania_logged_in", "true");
    }
    updateUserInterface();
});