/**
 * Game Mania E-commerce | Gestão de Catálogo, Shorts e Carrinho
 * SENAI UC09 - Codificação Front-End
 */

let cartItems = [];

function initCatalogAndShorts() {
    renderShorts(window.SHORTS_DATA || []);
    renderProducts(window.PRODUCTS_DATA || []);
    loadCartFromStorage();
}

function renderShorts(shorts) {
    const container = document.getElementById("shortsGrid");
    if (!container) return;

    container.innerHTML = shorts.map(short => `
        <div class="short-card" onclick="openShortVideoModal('${short.id}')">
            <div class="short-thumbnail">
                <span class="short-badge-fps">⚡ ${short.fps}</span>
                <div class="short-play-btn">▶</div>
            </div>
            <div class="short-body">
                <div>
                    <h3 class="short-title">${short.title}</h3>
                    <p class="short-desc">${short.desc}</p>
                </div>
                <div class="short-footer-cta">
                    <span class="short-tag-game">🎮 ${short.game}</span>
                    <small style="color: var(--siemens-note); font-weight: 700;">+15 pts ao testar</small>
                </div>
            </div>
        </div>
    `).join("");
}

function renderProducts(products) {
    const container = document.getElementById("productsGrid");
    if (!container) return;

    container.innerHTML = products.map(prod => `
        <div class="product-card">
            <span class="product-badge-pix">15% NO PIX</span>
            <div class="product-img-box" onclick="openProductModal('${prod.id}')">
                <span>${prod.icon}</span>
            </div>
            <div>
                <span class="product-cat">${prod.category}</span>
                <h3 class="product-title">${prod.name}</h3>
            </div>
            <div class="product-pricing">
                <div class="price-original">R$ ${prod.priceOriginal.toFixed(2).replace(".", ",")}</div>
                <div class="price-pix-strong">R$ ${prod.pricePix.toFixed(2).replace(".", ",")}</div>
                <div class="price-card-split">${prod.installments}</div>
                <div class="product-actions-group">
                    <button class="btn-details" onclick="openProductModal('${prod.id}')">Ficha Técnica</button>
                    <button class="btn-cart-add" onclick="addToCart('${prod.id}')">Comprar 🛒</button>
                </div>
            </div>
        </div>
    `).join("");
}

function filterDepartment(dept) {
    document.querySelectorAll(".nav-dept-btn").forEach(btn => btn.classList.remove("active"));
    const clickedBtn = event ? event.target : null;
    if (clickedBtn) clickedBtn.classList.add("active");

    const label = document.getElementById("currentFilterLabel");
    if (label) label.textContent = dept;

    if (dept === "TODOS") {
        renderProducts(window.PRODUCTS_DATA);
    } else if (dept === "OFERTAS 15% PIX") {
        renderProducts(window.PRODUCTS_DATA);
    } else {
        const filtered = window.PRODUCTS_DATA.filter(p => p.department === dept || p.category === dept);
        renderProducts(filtered);
    }
}

function handleSearchInput(query) {
    const dropdown = document.getElementById("searchDropdown");
    if (!dropdown) return;
    const clean = query.trim().toLowerCase();

    if (clean.length < 2) {
        dropdown.style.display = "none";
        return;
    }

    const matches = window.PRODUCTS_DATA.filter(p => 
        p.name.toLowerCase().includes(clean) || 
        p.category.toLowerCase().includes(clean) ||
        p.department.toLowerCase().includes(clean)
    );

    if (matches.length === 0) {
        dropdown.innerHTML = '<div style="padding: 12px; font-size: 12px; color: var(--siemens-text-muted);">Nenhum produto encontrado.</div>';
    } else {
        dropdown.innerHTML = matches.map(p => `
            <div class="search-dropdown-item" onclick="selectSearchProduct('${p.id}')">
                <span>${p.icon} <strong>${p.name}</strong></span>
                <strong style="color: var(--siemens-green-pix);">R$ ${p.pricePix.toFixed(2).replace(".", ",")}</strong>
            </div>
        `).join("");
    }
    dropdown.style.display = "block";
}

function selectSearchProduct(prodId) {
    document.getElementById("searchDropdown").style.display = "none";
    openProductModal(prodId);
}

function executeSearch() {
    const val = document.getElementById("searchInput").value.trim().toLowerCase();
    if (!val) return;
    document.getElementById("searchDropdown").style.display = "none";
    const filtered = window.PRODUCTS_DATA.filter(p => p.name.toLowerCase().includes(val) || p.category.toLowerCase().includes(val));
    renderProducts(filtered);
    scrollToCatalog();
}

function scrollToCatalog() {
    document.getElementById("catalogSection").scrollIntoView({ behavior: "smooth" });
}

function scrollToShorts() {
    document.getElementById("shortsSection").scrollIntoView({ behavior: "smooth" });
}

function addFeaturedToCart() {
    addToCart("pc-challenger");
    openCartDrawer();
}

function addToCart(productId) {
    const product = window.PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    const existing = cartItems.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cartItems.push({
            id: product.id,
            name: product.name,
            icon: product.icon,
            priceOriginal: product.priceOriginal,
            pricePix: product.pricePix,
            quantity: 1
        });
    }

    saveCartToStorage();
    renderCart();
    openCartDrawer();
}

function changeItemQty(productId, delta) {
    const item = cartItems.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cartItems = cartItems.filter(i => i.id !== productId);
    }

    saveCartToStorage();
    renderCart();
}

function removeCartItem(productId) {
    cartItems = cartItems.filter(i => i.id !== productId);
    saveCartToStorage();
    renderCart();
}

function renderCart() {
    const container = document.getElementById("cartItemsContainer");
    const countHeader = document.getElementById("headerCartCount");
    const totalHeader = document.getElementById("headerCartTotal");
    const bottomBadge = document.getElementById("bottomNavCartCount");
    const summaryQty = document.getElementById("cartSummaryQty");
    const summaryPoints = document.getElementById("cartEstimatedPoints");
    const summarySubtotal = document.getElementById("cartSubtotalValue");

    const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cartItems.reduce((acc, item) => acc + (item.priceOriginal * item.quantity), 0);

    // Regra de Fidelidade: 1 pt a cada R$ 2,00 + bônus de 10 pts por item se total >= 2 itens
    const pointsFromValue = Math.floor(subtotal / 2);
    const bonusPoints = totalQty >= 2 ? (totalQty * 10) : 0;
    const totalEstimatedPoints = pointsFromValue + bonusPoints;

    if (countHeader) countHeader.textContent = totalQty;
    if (bottomBadge) bottomBadge.textContent = totalQty;
    if (totalHeader) totalHeader.textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
    if (summaryQty) summaryQty.textContent = `${totalQty} itens`;
    if (summaryPoints) summaryPoints.textContent = `+${totalEstimatedPoints} pts`;
    if (summarySubtotal) summarySubtotal.textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;

    if (!container) return;

    if (cartItems.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: var(--siemens-text-muted);">
                <span style="font-size: 40px; display: block; margin-bottom: 10px;">🛒</span>
                <p>Seu carrinho está vazio.</p>
                <small>Explore nossos produtos e aproveite 15% OFF no Pix!</small>
            </div>
        `;
        return;
    }

    container.innerHTML = cartItems.map(item => `
        <div class="cart-item-card">
            <div class="cart-item-icon">${item.icon}</div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="item-price">R$ ${(item.priceOriginal * item.quantity).toFixed(2).replace(".", ",")}</div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="changeItemQty('${item.id}', -1)">-</button>
                    <span style="font-size: 13px; font-weight: 700;">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeItemQty('${item.id}', 1)">+</button>
                    <button class="cart-item-remove" onclick="removeCartItem('${item.id}')" title="Remover item">🗑️</button>
                </div>
            </div>
        </div>
    `).join("");
}

function openCartDrawer() {
    const drawer = document.getElementById("cartDrawer");
    if (drawer) {
        drawer.classList.add("open");
        drawer.setAttribute("aria-hidden", "false");
    }
}

function closeCartDrawer() {
    const drawer = document.getElementById("cartDrawer");
    if (drawer) {
        drawer.classList.remove("open");
        drawer.setAttribute("aria-hidden", "true");
    }
}

function saveCartToStorage() {
    localStorage.setItem("gamemania_cart", JSON.stringify(cartItems));
}

function loadCartFromStorage() {
    const raw = localStorage.getItem("gamemania_cart");
    if (raw) {
        try {
            cartItems = JSON.parse(raw);
        } catch (e) {
            cartItems = [];
        }
    }
    renderCart();
}

function openProductModal(productId) {
    const product = window.PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    awardLoyaltyPoints(5, "Consulta Técnica de Especificações");

    const modal = document.getElementById("productModal");
    const body = document.getElementById("productModalBody");

    body.innerHTML = `
        <div style="display: flex; gap: 24px; flex-wrap: wrap;">
            <div style="font-size: 80px; background: radial-gradient(circle, #1E3E62, #0B192C); padding: 30px; border-radius: 12px; display: flex; align-items: center; justify-content: center; min-width: 160px;">
                ${product.icon}
            </div>
            <div style="flex: 1; min-width: 280px;">
                <span class="badge-fidelidade-alert" style="margin-bottom: 8px; display: inline-block;">⭐ +5 pts por consultar especificações</span>
                <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 6px;">${product.name}</h2>
                <div style="color: var(--siemens-green-pix); font-size: 22px; font-weight: 900; margin-bottom: 12px;">
                    R$ ${product.pricePix.toFixed(2).replace(".", ",")} <small style="color: white; font-size: 12px;">à vista no Pix</small>
                </div>
                <h4 style="font-size: 13px; text-transform: uppercase; color: var(--siemens-cyan); margin-bottom: 8px;">Especificações Técnicas:</h4>
                <ul style="list-style: square; padding-left: 20px; font-size: 13px; color: var(--siemens-text-muted); line-height: 1.6; margin-bottom: 16px;">
                    ${product.specs.map(s => `<li>${s}</li>`).join("")}
                </ul>
                <div style="background: rgba(0, 130, 138, 0.15); border: 1px solid var(--siemens-teal); padding: 10px; border-radius: 6px; font-size: 12px; margin-bottom: 16px;">
                    <strong>Benchmark Oficial Game Mania:</strong> ${product.benchmark}
                </div>
                <button class="btn btn-primary btn-block" onclick="addToCart('${product.id}'); closeProductModal();">Adicionar ao Carrinho 🛒</button>
            </div>
        </div>
    `;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
}

function closeProductModal() {
    const modal = document.getElementById("productModal");
    if (modal) {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
    }
}

function openShortVideoModal(shortId) {
    const short = window.SHORTS_DATA.find(s => s.id === shortId);
    if (!short) return;

    awardLoyaltyPoints(15, `Short de Benchmark Assistido: ${short.title}`);

    const modal = document.getElementById("productModal");
    const body = document.getElementById("productModalBody");

    body.innerHTML = `
        <div style="text-align: center;">
            <span class="badge-fidelidade-alert" style="margin-bottom: 10px; display: inline-block;">⭐ Parabéns! Você ganhou +15 pontos de fidelidade!</span>
            <div style="height: 280px; background: linear-gradient(180deg, #1E293B, #0F172A); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 16px 0; border: 1px solid var(--siemens-cyan);">
                <div style="font-size: 54px; margin-bottom: 10px;">▶</div>
                <strong style="color: var(--siemens-cyan); font-size: 16px;">[SIMULADOR DE VÍDEO EXECUTANDO...]</strong>
                <p style="font-size: 12px; color: var(--siemens-text-muted); margin-top: 4px;">Taxa medida em tempo real: <span style="color: var(--siemens-green-pix); font-weight: 800;">${short.fps}</span></p>
            </div>
            <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 6px;">${short.title}</h3>
            <p style="font-size: 13px; color: var(--siemens-text-muted); margin-bottom: 18px;">${short.desc}</p>
            <button class="btn btn-primary" onclick="addToCart('${short.productId}'); closeProductModal();">Comprar Produto do Vídeo 🛒</button>
        </div>
    `;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
}

function toggleFaq(btn) {
    const item = btn.parentElement;
    item.classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", initCatalogAndShorts);