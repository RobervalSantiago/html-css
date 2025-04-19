/**
 * Biblioteca de Ebooks - Script Principal
 * Funcionalidades:
 * - Contador regressivo para oferta urgente
 * - Formulário de captura de leads
 * - Toggle para perguntas frequentes
 * - Botão "Voltar ao topo"
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar contador regressivo
    initCountdown();
    
    // Inicializar toggle do FAQ
    initFaqToggle();
    
    // Inicializar botão "Voltar ao topo"
    initBackToTop();
    
    // Inicializar formulário de captura de leads
    initLeadForm();
});

/**
 * Inicializa o contador regressivo
 */
function initCountdown() {
    // Elementos do contador
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (!hoursElement || !minutesElement || !secondsElement) return;
    
    // Definir tempo inicial (24 horas a partir de agora)
    let totalSeconds = 24 * 60 * 60;
    
    // Verificar se há um tempo salvo no localStorage
    const savedTime = localStorage.getItem('offerCountdown');
    const savedTimestamp = localStorage.getItem('offerTimestamp');
    
    if (savedTime && savedTimestamp) {
        // Calcular quanto tempo se passou desde o último acesso
        const elapsedSeconds = Math.floor((Date.now() - parseInt(savedTimestamp)) / 1000);
        totalSeconds = Math.max(0, parseInt(savedTime) - elapsedSeconds);
    }
    
    // Atualizar contador a cada segundo
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    function updateCountdown() {
        if (totalSeconds <= 0) {
            clearInterval(countdownInterval);
            totalSeconds = 24 * 60 * 60; // Reiniciar para 24 horas quando chegar a zero
        }
        
        // Calcular horas, minutos e segundos
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        // Atualizar elementos na página
        hoursElement.textContent = String(hours).padStart(2, '0');
        minutesElement.textContent = String(minutes).padStart(2, '0');
        secondsElement.textContent = String(seconds).padStart(2, '0');
        
        // Salvar tempo restante no localStorage
        localStorage.setItem('offerCountdown', totalSeconds);
        localStorage.setItem('offerTimestamp', Date.now());
        
        // Decrementar contador
        totalSeconds--;
    }
}

/**
 * Inicializa o toggle para as perguntas frequentes
 */
function initFaqToggle() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Fechar outros itens abertos
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Alternar estado do item atual
            item.classList.toggle('active');
        });
    });
}

/**
 * Inicializa o botão "Voltar ao topo"
 */
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (!backToTopButton) return;
    
    // Mostrar/ocultar botão com base na posição de rolagem
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Rolar suavemente para o topo ao clicar no botão
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Inicializa o formulário de captura de leads
 */
function initLeadForm() {
    const leadForm = document.getElementById('lead-capture-form');
    
    if (!leadForm) return;
    
    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Obter dados do formulário
        const formData = new FormData(leadForm);
        const name = formData.get('name');
        const email = formData.get('email');
        
        // Validação básica
        if (!name || !email) {
            showFormMessage('Por favor, preencha todos os campos.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showFormMessage('Por favor, insira um e-mail válido.', 'error');
            return;
        }
        
        // Simulação de envio (em produção, substituir por chamada AJAX real)
        showFormMessage('Processando...', 'info');
        
        // Simular delay de processamento
        setTimeout(() => {
            // Armazenar lead no localStorage (apenas para demonstração)
            const leads = JSON.parse(localStorage.getItem('leads') || '[]');
            leads.push({ name, email, date: new Date().toISOString() });
            localStorage.setItem('leads', JSON.stringify(leads));
            
            // Mostrar mensagem de sucesso
            showFormMessage('Obrigado! Enviamos a amostra para seu e-mail.', 'success');
            
            // Limpar formulário
            leadForm.reset();
            
            // Remover mensagem após alguns segundos
            setTimeout(() => {
                const messageElement = document.querySelector('.form-message');
                if (messageElement) {
                    messageElement.remove();
                }
            }, 5000);
        }, 1500);
    });
    
    /**
     * Valida formato de e-mail
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Exibe mensagem no formulário
     */
    function showFormMessage(message, type) {
        // Remover mensagem anterior, se existir
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Criar elemento de mensagem
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        // Inserir mensagem após o formulário
        leadForm.parentNode.insertBefore(messageElement, leadForm.nextSibling);
    }
}

/**
 * Adiciona estilos CSS para mensagens do formulário
 */
(function addFormMessageStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .form-message {
            padding: 10px 15px;
            border-radius: 5px;
            margin-top: 15px;
            font-weight: 600;
        }
        .form-message.success {
            background-color: rgba(39, 174, 96, 0.2);
            color: #27ae60;
        }
        .form-message.error {
            background-color: rgba(231, 76, 60, 0.2);
            color: #e74c3c;
        }
        .form-message.info {
            background-color: rgba(52, 152, 219, 0.2);
            color: #3498db;
        }
    `;
    document.head.appendChild(style);
})();

/**
 * Inicializa animações de scroll
 */
(function initScrollAnimations() {
    // Adicionar classe para elementos que devem ser animados
    const animatedElements = document.querySelectorAll('.benefit-card, .testimonial-card, .section-title, .hero-content, .hero-image');
    
    animatedElements.forEach(element => {
        element.classList.add('animate-on-scroll');
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Função para verificar se elemento está visível na viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Função para animar elementos visíveis
    function animateVisibleElements() {
        const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
        
        elementsToAnimate.forEach(element => {
            if (isElementInViewport(element) && element.style.opacity === '0') {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 100);
            }
        });
    }
    
    // Verificar elementos visíveis no carregamento e durante o scroll
    window.addEventListener('load', animateVisibleElements);
    window.addEventListener('scroll', animateVisibleElements);
})();
