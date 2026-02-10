// 1. Seletores (Definição das variáveis para o JS encontrar o HTML)
const about = document.querySelector('#about');
const swiperWrapper = document.querySelector('.swiper-wrapper');
const formulario = document.querySelector('#formulario');
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// 2. Função para buscar os dados do seu Perfil no GitHub
async function getAboutGithub() {
    try {
        const resposta = await fetch('https://api.github.com/users/conteudoGeneration');
        const perfil = await resposta.json();

        if (about) {
            about.innerHTML = `
                <figure class="about-image">
                    <img src="${perfil.avatar_url}" alt="Foto do perfil - ${perfil.name}">
                </figure>

                <article class="about-content">
                    <h2>Sobre mim</h2>
                    <p>
                        Trabalho com desenvolvimento de software focado em criar soluções 
                        eficientes e escaláveis. Atualmente cursando Sistemas de Informação.
                    </p>

                    <div class="about-buttons-data">
                        <div class="buttons-container">
                            <a href="${perfil.html_url}" target="_blank" class="botao">Ver GitHub</a>
                            <a href="#" target="_blank" class="botao-outline">Currículo</a>
                        </div>

                        <div class="data-container">
                            <div class="data-item">
                                <span class="data-number">${perfil.followers}</span>
                                <span class="data-label">Seguidores</span>
                            </div>

                            <div class="data-item">
                                <span class="data-number">${perfil.public_repos}</span>
                                <span class="data-label">Repositórios</span>
                            </div>
                        </div>
                    </div>
                </article>
            `;
        }
    } catch (error) {
        console.error('Erro ao buscar dados do GitHub (Sobre):', error);
    }
}

// 3. Função para buscar e renderizar os seus Projetos do GitHub
async function getProjectsGithub() {
    try {
        const resposta = await fetch('https://api.github.com/users/conteudoGeneration/repos?sort=updated&per_page=6');
        const repositorios = await resposta.json();

        let slidesHTML = '';

        const linguagens = {
            'JavaScript': { icone: 'javascript' },
            'TypeScript': { icone: 'typescript' },
            'Python': { icone: 'python' },
            'Java': { icone: 'java' },
            'HTML': { icone: 'html' },
            'CSS': { icone: 'css' },
            'PHP': { icone: 'php' },
            'C#': { icone: 'csharp' },
            'Go': { icone: 'go' },
            'Kotlin': { icone: 'kotlin' },
            'Swift': { icone: 'swift' },
        };

        repositorios.forEach(repositorio => {
            const linguagemExibir = repositorio.language || 'GitHub';
            const config = linguagens[repositorio.language] || { icone: 'github' };
            const urlIcone = `./assets/icons/languages/${config.icone}.svg`;

            const nomeFormatado = repositorio.name
                .replace(/[-_]/g, ' ')
                .replace(/[^a-zA-Z0-9\s]/g, '')
                .toUpperCase();

            const descricao = repositorio.description
                ? (repositorio.description.length > 100 ? repositorio.description.substring(0, 97) + '...' : repositorio.description)
                : 'Projeto desenvolvido no GitHub';

            const tags = repositorio.topics?.length > 0
                ? repositorio.topics.slice(0, 3).map(topic => `<span class="tag">${topic}</span>`).join('')
                : `<span class="tag">${linguagemExibir}</span>`;

            const botoesAcao = `
                <div class="project-buttons">
                    <a href="${repositorio.html_url}" target="_blank" class="botao botao-sm">GitHub</a>
                    ${repositorio.homepage ? `<a href="${repositorio.homepage}" target="_blank" class="botao-outline botao-sm">Deploy</a>` : ''}
                </div>
            `;

            slidesHTML += `
                <div class="swiper-slide">
                    <article class="project-card">
                        <div class="project-image">
                            <img src="${urlIcone}" 
                                alt="Ícone ${linguagemExibir}"
                                onerror="this.onerror=null; this.src='./assets/icons/languages/github.svg';">
                        </div>

                        <div class="project-content">
                            <h3>${nomeFormatado}</h3>
                            <p>${descricao}</p>
                            <div class="project-tags">${tags}</div>
                            ${botoesAcao}
                        </div>
                    </article>
                </div>
            `;
        });

        if (swiperWrapper) {
            swiperWrapper.innerHTML = slidesHTML;
            iniciarSwiper();
        }

    } catch (error) {
        console.error('Erro ao buscar repositórios:', error);
    }
}

// 4. Função de configuração do Carrossel (Swiper)
function iniciarSwiper() {
    new Swiper('.projects-swiper', {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 24,
        loop: true,
        breakpoints: {
            769: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 40 },
            1025: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 54 }
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        grabCursor: true
    });
}


// Função de Validação do Formulário
formulario.addEventListener('submit', function(event) {
    event.preventDefault();

    // Limpa mensagens de erro anteriores
    document.querySelectorAll('form span')
        .forEach(span => span.innerHTML = '');

    let isValid = true;

    // Validação do Campo Nome
    const nome = document.querySelector('#nome');
    const erroNome = document.querySelector('#erro-nome');

    if (nome.value.trim().length < 3) {
        erroNome.innerHTML = 'O Nome deve ter no mínimo 3 caracteres.';
        if (isValid) nome.focus();
        isValid = false;
    }

    // Validação do Campo Email
    const email = document.querySelector('#email');
    const erroEmail = document.querySelector('#erro-email');

    if (!email.value.trim().match(emailRegex)) {
        erroEmail.innerHTML = 'Digite um e-mail válido.';
        if (isValid) email.focus();
        isValid = false;
    }

    // Validação do Campo Assunto
    const assunto = document.querySelector('#assunto');
    const erroAssunto = document.querySelector('#erro-assunto');

    if (assunto.value.trim().length < 5) {
        erroAssunto.innerHTML = 'O Assunto deve ter no mínimo 5 caracteres.';
        if (isValid) assunto.focus();
        isValid = false;
    }

    // Validação do Campo Mensagem
    const mensagem = document.querySelector('#mensagem');
    const erroMensagem = document.querySelector('#erro-mensagem');

    if (mensagem.value.trim().length === 0) {
        erroMensagem.innerHTML = 'A mensagem não pode ser vazia.';
        if (isValid) mensagem.focus();
        isValid = false;
    }

    // Envio do formulário se tudo estiver válido
    if (isValid) {
        const submitButton = formulario.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        formulario.submit();
    }
});

// 5. Chamada inicial das funções
getAboutGithub();
getProjectsGithub();