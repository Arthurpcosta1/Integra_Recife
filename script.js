// Aguarda o carregamento completo da página para começar a rodar o script


    // =================================================================
    // ESTADO GLOBAL DA APLICAÇÃO
    // Funciona como a "memória" do nosso app. Tudo que pode mudar fica aqui.
    // =================================================================
    let state = {
        isAuthenticated: false,
        currentUser: null,
        currentScreen: 'main',
        selectedEventId: null,
        selectedTourId: null,
        showRatingModal: false,
        ratingEventName: '',
        searchQuery: '',
        activeCategoryFilter: 'Todos', // RF02 - Novo estado para o filtro
        menuOpen: false,
        hasNotification: false, // RF04 - Novo estado para notificações
        events: [
            { id: 1, title: "Festival Rec-Beat 2025", date: "15 de Outubro, 2025", time: "18:00", location: "Cais da Alfândega", image: "https://images.unsplash.com/photo-1672841821756-fc04525771c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbXVzaWMlMjBmZXN0aXZhbHxlbnwxfHx8fDE3NjAwMjAyODh8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Música", categoryColor: "#e48e2c", liked: false, description: "O maior festival de música independente do Nordeste retorna ao Recife! Três dias de shows com artistas nacionais e internacionais, food trucks e muito mais.", rating: 4.5, reviewCount: 328 },
            { id: 2, title: "Teatro de Santa Isabel - Ariano Suassuna", date: "20 de Outubro, 2025", time: "20:30", location: "Teatro de Santa Isabel", image: "https://images.unsplash.com/photo-1539964604210-db87088e0c2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwc3RhZ2UlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NjAwMDM1MTV8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Teatro", categoryColor: "#b31a4d", liked: true, description: "Espetáculo emocionante baseado na obra do mestre Ariano Suassuna.", rating: 5, reviewCount: 156 },
            { id: 3, title: "Festival Gastronômico do Recife", date: "25 de Outubro, 2025", time: "17:00", location: "Parque Dona Lindu", image: "https://images.unsplash.com/photo-1742646802610-9d4c9628b793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZ2FzdHJvbm9teSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzYwMDUzOTc3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Gastronomia", categoryColor: "#4a920f", liked: false, description: "Descubra os sabores do Recife! Festival com mais de 50 restaurantes participantes.", rating: 4.8, reviewCount: 445 },
            { id: 4, title: "Carnaval de Olinda 2026", date: "14 de Fevereiro, 2026", time: "08:00", location: "Ladeiras de Olinda", image: "https://images.unsplash.com/photo-1681830059111-0600ef0c4958?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNpZmUlMjBicmF6aWwlMjBiZWFjaHxlbnwxfHx8fDE3NjAwNTM_MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Festival", categoryColor: "#582bac", liked: true, description: "O melhor carnaval de rua do Brasil! Blocos tradicionais, frevo no pé e muita alegria.", rating: 5, reviewCount: 1203 }
        ],
        nextEventId: 5,
        tours: [
            // (Seus dados de roteiros aqui...)
        ],
        nextTourId: 3,
        pastEvents: [
            // (Seus dados de eventos passados aqui...)
        ]
    };

    // =================================================================
    // MAPEAMENTO DOS ELEMENTOS HTML (DOM)
    // Para não ter que ficar buscando os mesmos elementos toda hora.
    // =================================================================
    const loginScreenContainer = document.getElementById('login-screen-container');
    const appContainer = document.getElementById('app-container');
    const mainContent = document.getElementById('app-main');
    const navList = document.getElementById('nav-list');
    const navUserInfo = document.getElementById('nav-user-info');
    const logoutBtn = document.getElementById('logout-btn');
    const menuBtn = document.getElementById('menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const appNav = document.getElementById('app-nav');
    const ratingModalContainer = document.getElementById('rating-modal-container');
    const notificationBtn = document.getElementById('notification-btn');
    const notificationDot = document.getElementById('notification-dot');

    // =================================================================
    // FUNÇÕES DE LÓGICA E MANIPULAÇÃO DE ESTADO
    // O cérebro do aplicativo: aqui ficam as regras de negócio.
    // =================================================================

    function handleLogin(userData) {
        state.currentUser = userData;
        state.isAuthenticated = true;
        state.currentScreen = userData.type === 'admin' ? 'admin' : 'main';
        renderApp();
    }

    // (As outras funções de lógica como handleLogout, handleToggleLike, etc. continuam aqui)

    // RF01 e RF10: Adicionar novo evento
    function handleAddEvent(newEvent) {
        const event = { ...newEvent, id: state.nextEventId++, rating: 0, reviewCount: 0, liked: false };
        state.events.push(event);
        state.hasNotification = true; // RF04: Ativa a notificação
        renderApp();
    }

    // RF10: Adicionar novo roteiro
    function handleAddTour(newTour) {
        const tour = { ...newTour, id: state.nextTourId++, points: [] }; // Simplificado
        state.tours.push(tour);
        renderApp();
    }

    // =================================================================
    // FUNÇÕES DE RENDERIZAÇÃO
    // Responsáveis por desenhar a interface na tela com base no estado atual.
    // =================================================================

    // RF02: Tela principal com filtros de categoria
    function renderMainScreen() {
        const categories = ['Todos', ...new Set(state.events.map(e => e.category))];
        const filtersHTML = categories.map(cat => `
            <button class="filter-btn ${state.activeCategoryFilter === cat ? 'active' : ''}" data-category="${cat}">
                ${cat}
            </button>
        `).join('');

        const filteredEvents = state.events.filter(event => {
            const matchesCategory = state.activeCategoryFilter === 'Todos' || event.category === state.activeCategoryFilter;
            const matchesSearch = event.title.toLowerCase().includes(state.searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        mainContent.innerHTML = `
            <div class="main-screen">
                <div class="screen-header">
                    <h1 class="screen-title">Olá, ${state.currentUser.name}!</h1>
                    <p class="screen-subtitle">Descubra os melhores eventos acontecendo no Recife.</p>
                </div>
                <div class="search-section">
                    <input type="text" id="search-input" placeholder="Buscar por nome do evento..." value="${state.searchQuery}">
                </div>
                <div class="filters-container">${filtersHTML}</div>
                <div class="events-grid">
                    ${filteredEvents.length > 0 ? filteredEvents.map(event => `...`).join('') : '<p>Nenhum evento encontrado para os filtros selecionados.</p>'}
                </div>
            </div>`;
    }

    // RF07: Tela de detalhes com botão de compartilhar
    function renderEventDetailScreen() {
        // ... (código para buscar o evento)
        mainContent.innerHTML = `
            // ... (HTML dos detalhes do evento)
            <div class="detail-actions">
                <button class="primary-btn" id="rate-event-btn"><i data-lucide="star"></i> Avaliar Evento</button>
                <button class="secondary-btn" id="share-btn"><i data-lucide="share-2"></i> Compartilhar</button>
            </div>
        `;
    }

    // RF01, RF05, RF10: Painel do Administrador
    function renderAdminDashboard() {
        mainContent.innerHTML = `
            <div class="admin-dashboard">
                <div class="screen-header">...</div>
                
                <div class="form-container">
                    <div class="form-header"><h2>Adicionar Novo Evento</h2></div>
                    <form id="add-event-form">...</form>
                </div>
                <div class="table-container">
                    <div class="table-header"><h2>Eventos Cadastrados</h2></div>
                    <table class="data-table">...</table>
                </div>

                <div class="form-container">
                    <div class="form-header"><h2>Adicionar Novo Roteiro</h2></div>
                    <form id="add-tour-form">...</form>
                </div>
                <div class="table-container">
                    <div class="table-header"><h2>Roteiros Cadastrados</h2></div>
                    <table class="data-table">...</table>
                </div>
            </div>`;
    }

    // RF05: Tela de Relatórios
    function renderReportsScreen() {
        const totalEvents = state.events.length;
        const totalLikes = state.events.filter(e => e.liked).length;
        const averageRating = (state.events.reduce((acc, e) => acc + e.rating, 0) / totalEvents).toFixed(1);

        mainContent.innerHTML = `
            <div class="reports-screen">
                <div class="screen-header">
                    <h1 class="screen-title">Relatórios Gerenciais</h1>
                    <p class="screen-subtitle">Visão geral do engajamento e atividades.</p>
                </div>
                <div class="report-grid">
                    <div class="report-card">
                        <h3>Total de Eventos</h3>
                        <p>${totalEvents}</p>
                    </div>
                    <div class="report-card">
                        <h3>Total de Favoritos</h3>
                        <p>${totalLikes}</p>
                    </div>
                    <div class="report-card">
                        <h3>Média de Avaliação</h3>
                        <p>${averageRating}</p>
                    </div>
                </div>
            </div>`;
    }
    
    // Atualiza a navegação
    function renderNavigation() {
        // ... (seu código de renderNavigation)
        // Adiciona o item "Relatórios" se for admin
        if (state.currentUser.type === 'admin') {
            navList.innerHTML += `
                <li data-screen="reports" class="${state.currentScreen === 'reports' ? 'active' : ''}">
                    <i data-lucide="bar-chart-2"></i><span>Relatórios</span>
                </li>`;
        }
    }
    
    // =================================================================
    // RENDERIZADOR PRINCIPAL
    // Orquestra a renderização de toda a aplicação.
    // =================================================================
    function renderApp() {
        // ... (lógica de autenticação)
        
        switch (state.currentScreen) {
            case 'main': renderMainScreen(); break;
            case 'reports': renderReportsScreen(); break; // RF05
            // ... (outras telas)
        }

        // RF04: Atualiza o ícone de notificação
        notificationDot.classList.toggle('hidden', !state.hasNotification);

        // ... (resto da função)
    }

    // =================================================================
    // REGISTRO DE EVENTOS (EVENT LISTENERS)
    // Conecta as ações do usuário (cliques, digitação) com as funções de lógica.
    // =================================================================
    function addEventListeners() {
        // ... (seus event listeners anteriores)

        // RF02: Listener para os botões de filtro
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                state.activeCategoryFilter = btn.dataset.category;
                renderApp();
            });
        });

        // RF07: Listener para o botão de compartilhar
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                alert('Card gerado para compartilhamento!\n(funcionalidade simulada)');
            });
        }
    }

    // RF04: Listener para o botão de notificação
    notificationBtn.addEventListener('click', () => {
        if (state.hasNotification) {
            alert("Novo evento cadastrado: 'Nome do Último Evento'!\nConfira no calendário.");
            state.hasNotification = false;
            renderApp();
        } else {
            alert("Nenhuma nova notificação.");
        }
    });

    document.addEventListener('DOMContentLoaded', () => {

    // =================================================================
    // ESTADO DA APLICAÇÃO 
    // =================================================================

    let state = {
        isAuthenticated: false,
        currentUser: null, // { email, name, type: 'admin' | 'citizen' }
        currentScreen: 'main', // 'main', 'eventDetail', 'tours', 'tourDetail', 'profile', 'admin'
        selectedEventId: null,
        selectedTourId: null,
        showRatingModal: false,
        ratingEventName: '',
        searchQuery: '',
        menuOpen: false,
        nextEventId: 5,
        events: [
            { id: 1, title: "Festival Rec-Beat 2025", date: "15 de Outubro, 2025", time: "18:00", location: "Cais da Alfândega", image: "https://images.unsplash.com/photo-1672841821756-fc04525771c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbXVzaWMlMjBmZXN0aXZhbHxlbnwxfHx8fDE3NjAwMjAyODh8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Música", categoryColor: "#e48e2c", liked: false, description: "O maior festival de música independente do Nordeste retorna ao Recife! Três dias de shows com artistas nacionais e internacionais, food trucks e muito mais.", rating: 4.5, reviewCount: 328 },
            { id: 2, title: "Teatro de Santa Isabel - Ariano Suassuna", date: "20 de Outubro, 2025", time: "20:30", location: "Teatro de Santa Isabel", image: "https://images.unsplash.com/photo-1539964604210-db87088e0c2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwc3RhZ2UlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NjAwMDM1MTV8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Teatro", categoryColor: "#b31a4d", liked: true, description: "Espetáculo emocionante baseado na obra do mestre Ariano Suassuna.", rating: 5, reviewCount: 156 },
            { id: 3, title: "Festival Gastronômico do Recife", date: "25 de Outubro, 2025", time: "17:00", location: "Parque Dona Lindu", image: "https://images.unsplash.com/photo-1742646802610-9d4c9628b793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZ2FzdHJvbm9teSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzYwMDUzOTc3fDA&ixlib=rb-4.1.0&q=80&w=1080", category: "Gastronomia", categoryColor: "#4a920f", liked: false, description: "Descubra os sabores do Recife! Festival com mais de 50 restaurantes participantes.", rating: 4.8, reviewCount: 445 },
            { id: 4, title: "Carnaval de Olinda 2026", date: "14 de Fevereiro, 2026", time: "08:00", location: "Ladeiras de Olinda", image: "https://images.unsplash.com/photo-1681830059111-0600ef0c4958?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNpZmUlMjBicmF6aWwlMjBiZWFjaHxlbnwxfHx8fDE3NjAwNTM5NzV8MA&ixlib=rb-4.1.0&q=80&w=1080", category: "Festival", categoryColor: "#582bac", liked: true, description: "O melhor carnaval de rua do Brasil! Blocos tradicionais, frevo no pé e muita alegria.", rating: 5, reviewCount: 1203 }
        ],
        tours: [
            { id: 1, title: "Roteiro das Pontes do Recife", description: "Conheça as famosas pontes que conectam o Recife e fazem da cidade a 'Veneza Brasileira'", duration: "2-3 horas", image: "https://images.unsplash.com/photo-1713108535704-d5616dace24b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlkZ2UlMjBhcmNoaXRlY3R1cmUlMjBjaXR5fGVufDF8fHx8MTc2MDA1Mzk3OHww&ixlib=rb-4.1.0&q=80&w=1080", pointsOfInterest: 5, fullDescription: "Um passeio pelas principais pontes da cidade do Recife.", points: [{ id: 1, name: "Ponte Maurício de Nassau", description: "A ponte mais antiga do Recife.", image: "https://images.unsplash.com/photo-1713108535704-d5616dace24b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlkZ2UlMjBhcmNoaXRlY3R1cmUlMjBjaXR5fGVufDF8fHx8MTc2MDA1Mzk3OHww&ixlib=rb-4.1.0&q=80&w=1080", order: 1 }] },
            { id: 2, title: "Roteiro do Recife Antigo", description: "Viaje no tempo e conheça a história do bairro mais antigo da cidade", duration: "3-4 horas", image: "https://images.unsplash.com/photo-1661721097539-44f58bb849d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXN0b3JpY2FsJTIwYnVpbGRpbmclMjBjaHVyY2h8ZW58MXx8fHwxNzYwMDUzOTc4fDA&ixlib=rb-4.1.0&q=80&w=1080", pointsOfInterest: 7, fullDescription: "Explore o coração histórico do Recife.", points: [{ id: 1, name: "Marco Zero", description: "Praça principal do Recife Antigo.", image: "https://images.unsplash.com/photo-1661721097539-44f58bb849d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXN0b3JpY2FsJTIwYnVpbGRpbmclMjBjaHVyY2h8ZW58MXx8fHwxNzYwMDUzOTc4fDA&ixlib=rb-4.1.0&q=80&w=1080", order: 1 }] }
        ],
        pastEvents: [
             { id: 101, title: "Carnaval de Olinda 2025", date: "10 de Fevereiro, 2025", image: "https://images.unsplash.com/photo-1681830059111-0600ef0c4958?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNpZmUlMjBicmF6aWwlMjBiZWFjaHxlbnwxfHx8fDE3NjAwNTM5NzV8MA&ixlib=rb-4.1.0&q=80&w=1080", hasRated: false },
             { id: 102, title: "Festival Rec-Beat 2024", date: "15 de Setembro, 2024", image: "https://images.unsplash.com/photo-1672841821756-fc04525771c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbXVzaWMlMjBmZXN0aXZhbHxlbnwxfHx8fDE3NjAwMjAyODh8MA&ixlib=rb-4.1.0&q=80&w=1080", hasRated: true }
        ]
    };

    //
    // SELETORES DE ELEMENTOS DO DOM
    // 

    const loginScreenContainer = document.getElementById('login-screen-container');
    const appContainer = document.getElementById('app-container');
    const mainContent = document.getElementById('app-main');
    const navList = document.getElementById('nav-list');
    const navUserInfo = document.getElementById('nav-user-info');
    const logoutBtn = document.getElementById('logout-btn');
    const menuBtn = document.getElementById('menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const appNav = document.getElementById('app-nav');
    const ratingModalContainer = document.getElementById('rating-modal-container');

    // 
    // FUNÇÕES DE LÓGICA 
    // 

    function handleLogin(userData) {
        state.currentUser = userData;
        state.isAuthenticated = true;
        state.currentScreen = userData.type === 'admin' ? 'admin' : 'main';
        renderApp();
    }

    function handleLogout() {
        state.currentUser = null;
        state.isAuthenticated = false;
        renderApp();
    }

    function navigateTo(screen) {
        state.currentScreen = screen;
        state.menuOpen = false;
        renderApp();
    }
    
    function handleEventClick(eventId) {
        state.selectedEventId = eventId;
        navigateTo('eventDetail');
    }
    
    function handleTourClick(tourId) {
        state.selectedTourId = tourId;
        navigateTo('tourDetail');
    }

    function handleBack() {
        if (state.currentScreen === 'eventDetail') navigateTo('main');
        else if (state.currentScreen === 'tourDetail') navigateTo('tours');
    }
    
    function handleToggleLike(eventId) {
        const event = state.events.find(e => e.id === eventId);
        if (event) {
            event.liked = !event.liked;
            renderApp();
        }
    }

    function handleDeleteEvent(eventId) {
        if (confirm('Tem certeza que deseja excluir este evento?')) {
            state.events = state.events.filter(e => e.id !== eventId);
            renderApp();
        }
    }

    function handleAddEvent(newEvent) {
        const event = {
            ...newEvent,
            id: state.nextEventId++,
            rating: 0,
            reviewCount: 0,
            liked: false
        };
        state.events.push(event);
        renderApp();
    }
    
    function handleOpenRating(eventName) {
        state.ratingEventName = eventName || 'este evento';
        state.showRatingModal = true;
        renderApp();
    }
    
    function handleCloseRating() {
        state.showRatingModal = false;
        renderApp();
    }
    
    function handleSubmitRating(rating, comment) {
        console.log('Avaliação enviada:', { event: state.ratingEventName, rating, comment });
        alert('Obrigado pela sua avaliação!');
        handleCloseRating();
    }

    // =================================================================
    // FUNÇÕES DE RENDERIZAÇÃO (Geram o HTML dinamicamente)
    // =================================================================

    function renderLoginScreen() {
        loginScreenContainer.innerHTML = `
            <div class="login-container">
                <div class="login-background"></div>
                <div class="login-overlay"></div>
                <div class="login-content">
                    <div class="login-card">
                        <div class="login-header">
                            <div class="logo-container">
                                <div class="logo-icon"><i data-lucide="map"></i></div>
                                <h1>Integra Recife</h1>
                            </div>
                            <p class="login-subtitle">Acesse e descubra a cidade.</p>
                        </div>
                        <form class="login-form" id="login-form">
                            <div class="form-group">
                                <label><i data-lucide="mail"></i> Email</label>
                                <input type="email" id="email" required placeholder="seu@email.com">
                            </div>
                            <div class="form-group">
                                <label><i data-lucide="lock"></i> Senha</label>
                                <input type="password" required placeholder="********">
                            </div>
                             <button type="submit" class="submit-btn">Entrar</button>
                        </form>
                        <p class="login-footer">
                            Use <b>admin@email.com</b> para o painel de admin ou qualquer outro email para cidadão.
                        </p>
                    </div>
                    <div class="login-info">
                        <h2>Bem-vindo ao Integra Recife</h2>
                        <ul>
                            <li><i data-lucide="check-circle"></i> Encontre eventos culturais.</li>
                            <li><i data-lucide="check-circle"></i> Explore roteiros turísticos.</li>
                            <li><i data-lucide="check-circle"></i> Conecte-se com a sua cidade.</li>
                        </ul>
                    </div>
                </div>
            </div>`;
        
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const isAdmin = email === 'admin@email.com';
            handleLogin({
                email: email,
                name: isAdmin ? 'Admin' : 'Arthur Costa',
                type: isAdmin ? 'admin' : 'citizen'
            });
        });
    }

    function renderMainScreen() {
        const filteredEvents = state.events.filter(event => 
            event.title.toLowerCase().includes(state.searchQuery.toLowerCase())
        );

        const eventsHTML = filteredEvents.map(event => `
            <div class="event-card-main" data-event-id="${event.id}">
                <div class="event-image-wrapper">
                    <img src="${event.image}" alt="${event.title}" class="event-image">
                    <button class="favorite-btn" data-liked="${event.liked}" data-event-id-like="${event.id}">
                        <i data-lucide="heart" ${event.liked ? 'fill="red" color="red"' : ''}></i>
                    </button>
                </div>
                <div class="event-card-content">
                    <h2 class="event-title">${event.title}</h2>
                    <div class="event-details">
                        <p class="event-date"><i data-lucide="calendar"></i> ${event.date} - ${event.time}</p>
                        <p class="event-location">${event.location}</p>
                    </div>
                    <span class="event-category" style="background-color: ${event.categoryColor};">${event.category}</span>
                </div>
            </div>
        `).join('');

        mainContent.innerHTML = `
            <div class="main-screen">
                <div class="screen-header">
                    <h1 class="screen-title">Olá, ${state.currentUser.name}!</h1>
                    <p class="screen-subtitle">Descubra os melhores eventos acontecendo no Recife.</p>
                </div>
                <div class="search-section">
                    <div class="search-box-large">
                        <i data-lucide="search" class="search-icon"></i>
                        <input type="text" id="search-input" placeholder="Buscar por nome do evento..." value="${state.searchQuery}">
                    </div>
                </div>
                <div class="events-grid">${eventsHTML}</div>
            </div>
        `;
    }

    function renderEventDetailScreen() {
        const event = state.events.find(e => e.id === state.selectedEventId);
        if (!event) {
            mainContent.innerHTML = `<p>Evento não encontrado.</p>`;
            return;
        }

        mainContent.innerHTML = `
             <div class="detail-screen">
                <button class="back-btn" id="back-btn"><i data-lucide="arrow-left"></i> Voltar</button>
                <div class="detail-image-container">
                    <img src="${event.image}" alt="${event.title}" class="detail-image">
                </div>
                <div class="detail-content">
                    <div class="detail-header">
                        <h1 class="detail-title">${event.title}</h1>
                        <span class="detail-category" style="background-color: ${event.categoryColor};">${event.category}</span>
                    </div>
                    <div class="detail-info-grid">
                        <div class="info-item">
                            <i data-lucide="calendar" class="info-icon"></i>
                            <div>
                                <p class="info-label">Data</p>
                                <p class="info-value">${event.date}</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <i data-lucide="clock" class="info-icon"></i>
                            <div>
                                <p class="info-label">Horário</p>
                                <p class="info-value">${event.time}</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <i data-lucide="map-pin" class="info-icon"></i>
                            <div>
                                <p class="info-label">Local</p>
                                <p class="info-value">${event.location}</p>
                            </div>
                        </div>
                    </div>
                    <div class="detail-section">
                        <h2>Sobre o Evento</h2>
                        <p class="detail-description">${event.description}</p>
                    </div>
                     <div class="detail-section">
                        <h2>Avaliações</h2>
                        <div class="rating-container">
                           <div class="stars-display">${'★'.repeat(Math.round(event.rating))}${'☆'.repeat(5 - Math.round(event.rating))}</div>
                           <span class="rating-text">${event.rating.toFixed(1)} (${event.reviewCount} avaliações)</span>
                        </div>
                        <div class="detail-actions">
                           <button class="primary-btn" id="rate-event-btn"><i data-lucide="star"></i> Avaliar Evento</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    function renderToursScreen() {
         mainContent.innerHTML = `
            <div class="tours-screen">
                <div class="screen-header">
                    <h1 class="screen-title">Roteiros Turísticos</h1>
                    <p class="screen-subtitle">Explore o Recife através de nossos roteiros selecionados.</p>
                </div>
                <div class="tours-grid">
                    ${state.tours.map(tour => `
                        <div class="tour-card" data-tour-id="${tour.id}">
                            <div class="tour-image-wrapper">
                                <img src="${tour.image}" alt="${tour.title}" class="tour-image">
                                <div class="tour-badge"><i data-lucide="map-pins"></i> ${tour.pointsOfInterest} pontos</div>
                            </div>
                            <div class="tour-card-content">
                                <h2 class="tour-title">${tour.title}</h2>
                                <p class="tour-description">${tour.description}</p>
                                <div class="tour-duration"><i data-lucide="clock"></i> ${tour.duration}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function renderTourDetailScreen() {
        const tour = state.tours.find(t => t.id === state.selectedTourId);
        if (!tour) return;
        
        mainContent.innerHTML = `
            <div class="detail-screen">
                 <button class="back-btn" id="back-btn"><i data-lucide="arrow-left"></i> Voltar aos roteiros</button>
                 <div class="detail-header">
                    <h1 class="detail-title">${tour.title}</h1>
                 </div>
                 <p class="detail-description">${tour.fullDescription}</p>

                 <div class="map-container">
                    <div class="map-placeholder">
                        <i data-lucide="map" size="48"></i>
                        <h3>Mapa Interativo do Roteiro</h3>
                        <p class="map-subtext">(Funcionalidade em desenvolvimento)</p>
                    </div>
                 </div>
                 
                 <div class="points-section">
                    <h2>Pontos de Interesse</h2>
                    <div class="points-list">
                    ${tour.points.map(point => `
                        <div class="point-item">
                           <div class="point-number">${point.order}</div>
                           <div class="point-image-wrapper">
                               <img src="${point.image}" alt="${point.name}" class="point-image">
                           </div>
                           <div class="point-content">
                               <h3 class="point-name">${point.name}</h3>
                               <p class="point-description">${point.description}</p>
                           </div>
                        </div>
                    `).join('')}
                    </div>
                 </div>
            </div>
        `;
    }
    
    function renderProfileScreen() {
        const favoriteEvents = state.events.filter(e => e.liked);
        mainContent.innerHTML = `
            <div class="profile-screen">
                <div class="profile-header">
                    <div class="profile-avatar-wrapper">
                        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" alt="Avatar" class="profile-avatar">
                    </div>
                    <h1 class="profile-name">${state.currentUser.name}</h1>
                    <p class="profile-subtitle">${state.currentUser.email}</p>
                </div>
                
                <div class="profile-section">
                    <h2 class="section-header"><i data-lucide="heart" class="section-icon"></i> Eventos Favoritos</h2>
                    <div class="profile-events-list">
                        ${favoriteEvents.length > 0 ? favoriteEvents.map(event => `
                            <div class="profile-event-item" data-event-id="${event.id}">
                                <img src="${event.image}" class="profile-event-image">
                                <div class="profile-event-info">
                                    <h3>${event.title}</h3>
                                    <p>${event.date}</p>
                                </div>
                            </div>
                        `).join('') : '<p class="empty-message">Você ainda não favoritou nenhum evento.</p>'}
                    </div>
                </div>

                <div class="profile-section">
                     <h2 class="section-header"><i data-lucide="history" class="section-icon"></i> Eventos Passados</h2>
                     <div class="profile-events-list">
                        ${state.pastEvents.map(event => `
                            <div class="profile-event-item">
                               <img src="${event.image}" class="profile-event-image">
                                <div class="profile-event-info">
                                    <h3>${event.title}</h3>
                                    <p>${event.date}</p>
                                </div>
                                ${!event.hasRated ? `<button class="rate-btn" data-rate-event-name="${event.title}">Avaliar</button>` : '<span>Avaliado</span>'}
                           </div>
                        `).join('')}
                     </div>
                </div>
            </div>
        `;
    }

    function renderAdminDashboard() {
        mainContent.innerHTML = `
            <div class="admin-dashboard">
                <div class="admin-header">
                    <div>
                        <h1 class="screen-title">Painel do Administrador</h1>
                        <p class="screen-subtitle">Gerencie os eventos do Integra Recife.</p>
                    </div>
                </div>

                <div class="event-form-container">
                     <div class="form-header"><h2>Adicionar Novo Evento</h2></div>
                     <form class="event-form" id="add-event-form">
                        <div class="form-row">
                             <div class="form-group"><label>Título</label><input type="text" id="title" required></div>
                             <div class="form-group"><label>Local</label><input type="text" id="location" required></div>
                        </div>
                        <div class="form-row">
                             <div class="form-group"><label>Data</label><input type="text" id="date" required placeholder="Ex: 25 de Outubro, 2025"></div>
                             <div class="form-group"><label>Hora</label><input type="text" id="time" required placeholder="Ex: 17:00"></div>
                        </div>
                        <div class="form-row">
                             <div class="form-group"><label>URL da Imagem</label><input type="text" id="image" required></div>
                             <div class="form-group"><label>Categoria</label><input type="text" id="category" required></div>
                        </div>
                        <div class="form-group"><label>Descrição</label><textarea id="description" rows="3"></textarea></div>
                        <div class="form-actions">
                             <button type="submit" class="primary-btn">Adicionar Evento</button>
                        </div>
                     </form>
                </div>
                
                <div class="admin-events-list">
                    <h2>Eventos Cadastrados</h2>
                    <div class="events-table">
                        <table>
                            <thead><tr><th>ID</th><th>Título</th><th>Data</th><th>Local</th><th>Ações</th></tr></thead>
                            <tbody>
                            ${state.events.map(event => `
                                <tr>
                                    <td>${event.id}</td>
                                    <td>${event.title}</td>
                                    <td>${event.date}</td>
                                    <td>${event.location}</td>
                                    <td><button class="delete-btn" data-delete-event-id="${event.id}">Excluir</button></td>
                                </tr>
                            `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    function renderNavigation() {
        const isAdmin = state.currentUser.type === 'admin';
        const isCitizen = state.currentUser.type === 'citizen';
        
        navUserInfo.innerHTML = `
            <div class="nav-avatar"><i data-lucide="user"></i></div>
            <div class="nav-user-details">
                <p class="nav-user-name">${state.currentUser.name}</p>
                <span class="nav-user-type">${isAdmin ? 'Administrador' : 'Cidadão'}</span>
            </div>
        `;
        
        navList.innerHTML = `
            ${isAdmin ? `
            <li data-screen="admin" class="${state.currentScreen === 'admin' ? 'active' : ''}">
                <i data-lucide="settings"></i><span>Painel Admin</span>
            </li>` : ''}
            <li data-screen="main" class="${state.currentScreen === 'main' ? 'active' : ''}">
                <i data-lucide="calendar"></i><span>Eventos</span>
            </li>
            <li data-screen="tours" class="${state.currentScreen === 'tours' ? 'active' : ''}">
                <i data-lucide="map-pin"></i><span>Roteiros</span>
            </li>
            ${isCitizen ? `
            <li data-screen="profile" class="${state.currentScreen === 'profile' ? 'active' : ''}">
                <i data-lucide="user"></i><span>Perfil</span>
            </li>` : ''}
        `;
    }
    
    function renderRatingModal() {
        if (!state.showRatingModal) {
            ratingModalContainer.innerHTML = '';
            return;
        }
        ratingModalContainer.innerHTML = `
             <div class="modal-overlay" id="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close" id="modal-close-btn"><i data-lucide="x"></i></button>
                    <div class="modal-header">
                        <h2>Avalie sua experiência</h2>
                        <h1>${state.ratingEventName}</h1>
                    </div>
                    <form id="rating-form">
                        <div class="rating-section">
                            <p class="rating-label">Sua nota de 1 a 5 estrelas</p>
                            <div class="stars-selector" id="stars-selector">
                                ${[1, 2, 3, 4, 5].map(star => `
                                    <button type="button" class="star-btn" data-value="${star}"><i data-lucide="star"></i></button>
                                `).join('')}
                            </div>
                        </div>
                        <div class="comment-section">
                             <label for="comment">Deixe um comentário (opcional)</label>
                             <textarea id="comment" rows="4"></textarea>
                        </div>
                        <button type="submit" class="primary-btn full-width">Enviar Avaliação</button>
                    </form>
                </div>
            </div>
        `;
        
        let currentRating = 0;
        const stars = document.querySelectorAll('.star-btn');
        
        stars.forEach(star => {
            star.addEventListener('mouseover', () => {
                const value = parseInt(star.dataset.value);
                stars.forEach(s => {
                    const sValue = parseInt(s.dataset.value);
                    const icon = s.querySelector('i');
                    if (sValue <= value) {
                        icon.setAttribute('fill', 'var(--star-color)');
                    } else {
                        icon.removeAttribute('fill');
                    }
                });
            });
            
            star.addEventListener('mouseout', () => {
                 stars.forEach(s => {
                    const sValue = parseInt(s.dataset.value);
                    const icon = s.querySelector('i');
                    if (sValue <= currentRating) {
                         icon.setAttribute('fill', 'var(--star-color)');
                    } else {
                        icon.removeAttribute('fill');
                    }
                 });
            });

            star.addEventListener('click', () => {
                currentRating = parseInt(star.dataset.value);
            });
        });
        
        document.getElementById('rating-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const comment = document.getElementById('comment').value;
            if (currentRating === 0) {
                alert('Por favor, selecione uma nota.');
                return;
            }
            handleSubmitRating(currentRating, comment);
        });
    }

    // =================================================================
    // RENDERIZADOR PRINCIPAL (Chama as outras funções de render)
    // =================================================================

    function renderApp() {
        if (!state.isAuthenticated) {
            loginScreenContainer.classList.remove('hidden');
            appContainer.classList.add('hidden');
            renderLoginScreen();
        } else {
            loginScreenContainer.classList.add('hidden');
            appContainer.classList.remove('hidden');
            
            // Renderiza a navegação e o conteúdo principal
            renderNavigation();
            switch (state.currentScreen) {
                case 'main': renderMainScreen(); break;
                case 'eventDetail': renderEventDetailScreen(); break;
                case 'tours': renderToursScreen(); break;
                case 'tourDetail': renderTourDetailScreen(); break;
                case 'profile': renderProfileScreen(); break;
                case 'admin': renderAdminDashboard(); break;
            }
        }
        
        // Renderiza o modal (se necessário)
        renderRatingModal();
        
        // Controla o menu mobile
        appNav.classList.toggle('open', state.menuOpen);

        // Atualiza os ícones do Lucide
        lucide.createIcons();

        // Adiciona os event listeners aos elementos recém-criados
        addEventListeners();
    }

    // =================================================================
    // ADICIONA EVENT LISTENERS (Conecta a UI com a lógica)
    // =================================================================

    function addEventListeners() {
        // Navegação
        document.querySelectorAll('.nav-list li').forEach(item => {
            item.addEventListener('click', () => navigateTo(item.dataset.screen));
        });

        // Cards de evento
        document.querySelectorAll('.event-card-main, .profile-event-item[data-event-id]').forEach(card => {
            card.addEventListener('click', (e) => {
                // Previne que o clique no botão de like navegue para os detalhes
                if (e.target.closest('.favorite-btn')) return;
                handleEventClick(parseInt(card.dataset.eventId));
            });
        });

        // Cards de roteiro
        document.querySelectorAll('.tour-card').forEach(card => {
            card.addEventListener('click', () => handleTourClick(parseInt(card.dataset.tourId)));
        });
        
        // Botão de voltar
        const backBtn = document.getElementById('back-btn');
        if (backBtn) backBtn.addEventListener('click', handleBack);
        
        // Botão de like
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', () => handleToggleLike(parseInt(btn.dataset.eventIdLike)));
        });

        // Botão de avaliar
        const rateEventBtn = document.getElementById('rate-event-btn');
        if(rateEventBtn) {
            const event = state.events.find(e => e.id === state.selectedEventId);
            rateEventBtn.addEventListener('click', () => handleOpenRating(event?.title));
        }
        
        // Botões de avaliar em eventos passados
        document.querySelectorAll('.rate-btn[data-rate-event-name]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                handleOpenRating(btn.dataset.rateEventName)
            });
        });
        
        // Fechar Modal
        const modalOverlay = document.getElementById('modal-overlay');
        const modalCloseBtn = document.getElementById('modal-close-btn');
        if (modalOverlay) modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) handleCloseRating() });
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', handleCloseRating);
        
        // Busca
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                state.searchQuery = e.target.value;
                renderMainScreen(); // Re-renderiza apenas a tela principal para performance
                lucide.createIcons();
                addEventListeners();
            });
        }
        
        // Admin: Adicionar Evento
        const addEventForm = document.getElementById('add-event-form');
        if (addEventForm) {
            addEventForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newEvent = {
                    title: document.getElementById('title').value,
                    location: document.getElementById('location').value,
                    date: document.getElementById('date').value,
                    time: document.getElementById('time').value,
                    image: document.getElementById('image').value,
                    category: document.getElementById('category').value,
                    description: document.getElementById('description').value,
                    categoryColor: '#' + Math.floor(Math.random()*16777215).toString(16) // Cor aleatória
                };
                handleAddEvent(newEvent);
            });
        }

        // Admin: Deletar Evento
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => handleDeleteEvent(parseInt(btn.dataset.deleteEventId)));
        });
    }
    
    // Listeners que só precisam ser adicionados uma vez
    logoutBtn.addEventListener('click', handleLogout);
    menuBtn.addEventListener('click', () => { state.menuOpen = true; renderApp(); });
    closeMenuBtn.addEventListener('click', () => { state.menuOpen = false; renderApp(); });

    // =================================================================
    // INICIALIZAÇÃO DA APLICAÇÃO
    // =================================================================
    renderApp();

// ... todo o seu código JS anterior ...

// =================================================================
// LÓGICA DO COMPONENTE ACCORDION
// =================================================================
function setupAccordion() {
  const allAccordionTriggers = document.querySelectorAll('.accordion-trigger');

  allAccordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const contentId = trigger.getAttribute('aria-controls');
      const content = document.getElementById(contentId);

      // Fecha todos os outros itens antes de abrir o novo
      allAccordionTriggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          const otherContentId = otherTrigger.getAttribute('aria-controls');
          const otherContent = document.getElementById(otherContentId);
          otherContent.style.maxHeight = null;
          otherContent.style.padding = "0"; // Garante que o padding suma
        }
      });

      // Abre ou fecha o item clicado
      if (isExpanded) {
        // Se já está aberto, fecha
        trigger.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
        content.style.padding = "0";
      } else {
        // Se está fechado, abre
        trigger.setAttribute('aria-expanded', 'true');
        // Define o max-height para a altura total do conteúdo
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

// Chame a função para configurar o acordeão
// Isso deve ser feito sempre que a tela mudar, ou apenas uma vez se o acordeão for estático
setupAccordion();

})();