/* ==========================================================================
   SHADOW GAMES STORE - BASE DE DADOS DOS PRODUTOS (js/data.js)
   Catálogo de Jogos, Metadados, Preços e Links de Demonstração Interativa
   ========================================================================== */

const PRODUCTS_DATABASE = [
  {
    id: "game-01",
    title: "Shadow Fighter: Retribution",
    genre: "Luta Competitiva",
    platforms: ["PC", "PS5", "Xbox Series X"],
    price: 249.90,
    pointsReward: 125,
    pointsExperience: 15,
    coverUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
    description: "O mais aclamado jogo de luta em hype do momento. Mecânicas refinadas com taxa de 60fps constante para e-Sports.",
    trailerEmbedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    technicalSpecs: {
      developer: "Shadow Core Studios",
      releaseYear: 2026,
      rating: "14+",
      multiplayer: "Online (Rollback Netcode)"
    }
  },
  {
    id: "game-02",
    title: "Cyber Rush: Neo São Paulo",
    genre: "RPG de Ação / Sci-Fi",
    platforms: ["PC", "PS5"],
    price: 199.50,
    pointsReward: 100,
    pointsExperience: 15,
    coverUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80",
    description: "Explore uma metrópole futurista imersiva, repleta de missões eletrizantes, customizações cibernéticas e gráficos ultrarrealistas.",
    trailerEmbedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    technicalSpecs: {
      developer: "Paulista Cyber Works",
      releaseYear: 2026,
      rating: "16+",
      multiplayer: "Single Player com Modo Cooperativo"
    }
  },
  {
    id: "game-03",
    title: "Speed Vortex: Hyper Drift",
    genre: "Corrida / Simulação Arcade",
    platforms: ["PC", "Xbox Series X", "Switch"],
    price: 149.00,
    pointsReward: 75,
    pointsExperience: 15,
    coverUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
    description: "Pistas alucinantes com física gravitacional, customização profunda de supercarros e disputas online mundiais.",
    trailerEmbedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    technicalSpecs: {
      developer: "Vortex Games Brasil",
      releaseYear: 2025,
      rating: "Livre",
      multiplayer: "Até 16 jogadores simultâneos"
    }
  },
  {
    id: "game-04",
    title: "Kingdom of Valoria: Awakening",
    genre: "Aventura / Fantasia Medieval",
    platforms: ["PC", "PS5", "Xbox Series X"],
    price: 279.90,
    pointsReward: 140,
    pointsExperience: 15,
    coverUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80",
    description: "Um vasto mundo aberto com masmorras perigosas, dragões colossais e sistema de magia baseado em combos elementais.",
    trailerEmbedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    technicalSpecs: {
      developer: "Mythic Forge",
      releaseYear: 2026,
      rating: "12+",
      multiplayer: "Campanha Cooperativa 4 Players"
    }
  },
  {
    id: "game-05",
    title: "Tactical Strike: Zero Protocol",
    genre: "FPS Tático Competitivo",
    platforms: ["PC"],
    price: 119.90,
    pointsReward: 60,
    pointsExperience: 15,
    coverUrl: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&auto=format&fit=crop&q=80",
    description: "Tiro tático em primeira pessoa com foco em comunicação, destruição de cenários e armas balísticas precisas.",
    trailerEmbedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    technicalSpecs: {
      developer: "Protocol Labs",
      releaseYear: 2026,
      rating: "16+",
      multiplayer: "Competitivo 5v5 Ranqueado"
    }
  },
  {
    id: "game-06",
    title: "Galaxy Explorers: Deep Space",
    genre: "Sobrevivência / Espaço",
    platforms: ["PC", "PS5", "Xbox Series X"],
    price: 189.90,
    pointsReward: 95,
    pointsExperience: 15,
    coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    description: "Construa sua nave estelar, colete recursos em planetas desconhecidos e sobreviva às ameaças cósmicas.",
    trailerEmbedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    technicalSpecs: {
      developer: "Astro Frontier",
      releaseYear: 2025,
      rating: "10+",
      multiplayer: "Servidores Dedicados Comunitários"
    }
  }
];

// Cupons de Campanha de Marketing Válidos no Sistema
const MARKETING_COUPONS = {
  "SHADOW10": {
    code: "SHADOW10",
    type: "PERCENT",
    value: 0.10, // 10% de desconto
    description: "10% de Desconto Especial Hype Gamer"
  },
  "HYPESENAI": {
    code: "HYPESENAI",
    type: "FIXED",
    value: 20.00, // R$ 20,00 de desconto
    description: "R$ 20,00 OFF - Parceria SENAI UC09"
  }
];

// Helper global para formatar moeda em padrão Real brasileiro (R$)
function formatBRL(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}