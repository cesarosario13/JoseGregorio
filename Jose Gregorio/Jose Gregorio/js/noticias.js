document.addEventListener('DOMContentLoaded', () => {
    // 1. Configuración inicial
    const ADMIN_CREDENTIALS = {
        username: 'admin',
        password: '12345678'
    };

    // 2. Selección de elementos del DOM
    const DOM = {
        loginSection: document.getElementById('loginSection'),
        newsSection: document.getElementById('newsSection'),
        loginForm: document.getElementById('loginForm'),
        newsList: document.getElementById('newsList'),
        addNewsBtn: document.getElementById('addNewsBtn'),
        newsModal: new bootstrap.Modal(document.getElementById('newsModal')),
        saveNewsBtn: document.getElementById('saveNewsBtn'),
        newsForm: document.getElementById('newsForm'),
        newsFileInput: document.getElementById('newsFile'),
        previewImage: document.getElementById('previewImage'),
        previewVideo: document.getElementById('previewVideo'),
        loginError: document.getElementById('loginError'),
        errorMessage: document.getElementById('errorMessage'),
        imagePreviewContainer: document.getElementById('imagePreviewContainer'),
        videoPreviewContainer: document.getElementById('videoPreviewContainer')
    };

    // 3. Estado de la aplicación
    let news = JSON.parse(localStorage.getItem('news')) || [];
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // 4. Inicialización
    if (isLoggedIn) {
        showNewsSection();
        renderNews();
    }

    // 5. Manejadores de eventos
    DOM.loginForm.addEventListener('submit', handleLogin);
    DOM.addNewsBtn.addEventListener('click', showAddNewsModal);
    DOM.saveNewsBtn.addEventListener('click', saveNews);
    DOM.newsFileInput.addEventListener('change', handleFilePreview);
    document.getElementById('username').addEventListener('input', () => DOM.loginError.classList.add('d-none'));
    document.getElementById('password').addEventListener('input', () => DOM.loginError.classList.add('d-none'));

    // 6. Funciones principales
    function handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            localStorage.setItem('isLoggedIn', 'true');
            DOM.loginError.classList.add('d-none');
            showNewsSection();
            renderNews();
        } else {
            DOM.errorMessage.textContent = 'Credenciales incorrectas';
            DOM.loginError.classList.remove('d-none');
            animateError();
        }
    }

    function animateError() {
        DOM.loginError.classList.add('animate__animated', 'animate__headShake');
        setTimeout(() => {
            DOM.loginError.classList.remove('animate__animated', 'animate__headShake');
        }, 1000);
    }

    function showNewsSection() {
        DOM.loginSection.classList.add('d-none');
        DOM.newsSection.classList.remove('d-none');
    }

    function renderNews() {
        DOM.newsList.innerHTML = '';
        
        if (news.length === 0) {
            DOM.newsList.innerHTML = '<div class="col-12 text-center py-5"><p>No hay noticias aún</p></div>';
            return;
        }
        
        news.forEach((item, index) => {
            const mediaContent = getMediaContent(item);
            
            DOM.newsList.innerHTML += `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card legacy-card h-100">
                        ${mediaContent}
                        <div class="card-body">
                            <h5>${item.title}</h5>
                            <p class="card-text">${item.content.substring(0, 100)}${item.content.length > 100 ? '...' : ''}</p>
                            <div class="d-flex justify-content-between mt-3">
                                <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${index}">
                                    <i class="fas fa-edit me-1"></i>Editar
                                </button>
                                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${index}">
                                    <i class="fas fa-trash me-1"></i>Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
        });

        addCardEventListeners();
    }

    function getMediaContent(item) {
        if (!item.fileData) return '';
        
        if (item.fileType.startsWith('image/')) {
            return `
                <div class="card-img-top" style="height: 200px; overflow: hidden;">
                    <img src="${item.fileData}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>`;
        } else if (item.fileType.startsWith('video/')) {
            return `
                <div class="card-img-top ratio ratio-16x9">
                    <video controls style="background-color: #000;">
                        <source src="${item.fileData}" type="${item.fileType}">
                        Tu navegador no soporta el video.
                    </video>
                </div>`;
        }
        return '';
    }

    function addCardEventListeners() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editNews(parseInt(btn.dataset.id)));
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteNews(parseInt(btn.dataset.id)));
        });
    }

    function showAddNewsModal() {
        document.getElementById('modalTitle').textContent = 'Agregar Noticia';
        DOM.newsForm.reset();
        document.getElementById('newsId').value = '';
        DOM.imagePreviewContainer.classList.add('d-none');
        DOM.videoPreviewContainer.classList.add('d-none');
        DOM.newsModal.show();
    }

    function handleFilePreview(e) {
        const file = e.target.files[0];
        if (!file) return;

        DOM.imagePreviewContainer.classList.add('d-none');
        DOM.videoPreviewContainer.classList.add('d-none');

        if (file.type.startsWith('image/')) {
            DOM.previewImage.src = URL.createObjectURL(file);
            DOM.imagePreviewContainer.classList.remove('d-none');
        } else if (file.type.startsWith('video/')) {
            DOM.previewVideo.src = URL.createObjectURL(file);
            DOM.videoPreviewContainer.classList.remove('d-none');
        }
    }

    async function saveNews() {
        const id = document.getElementById('newsId').value;
        const title = document.getElementById('newsTitle').value;
        const content = document.getElementById('newsContent').value;
        const file = DOM.newsFileInput.files[0];

        if (!validateNewsInput(id, title, content, file)) return;

        try {
            const fileData = file ? await readFileAsDataURL(file) : news[id]?.fileData;
            const fileType = file ? file.type : news[id]?.fileType;

            const newsItem = {
                title,
                content,
                date: new Date().toLocaleDateString(),
                fileData,
                fileType
            };

            if (id === '') {
                news.unshift(newsItem);
            } else {
                news[id] = newsItem;
            }

            localStorage.setItem('news', JSON.stringify(news));
            DOM.newsModal.hide();
            renderNews();
        } catch (error) {
            console.error('Error al guardar:', error);
            alert('Error al procesar el archivo. Intente con uno más pequeño.');
        }
    }

    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function validateNewsInput(id, title, content, file) {
        if (!title || !content) {
            alert('Por favor complete título y contenido');
            return false;
        }

        if (id === '' && !file) {
            alert('Por favor seleccione un archivo para nueva noticia');
            return false;
        }

        return true;
    }

    function editNews(id) {
        document.getElementById('modalTitle').textContent = 'Editar Noticia';
        document.getElementById('newsId').value = id;
        document.getElementById('newsTitle').value = news[id].title;
        document.getElementById('newsContent').value = news[id].content;
        
        DOM.imagePreviewContainer.classList.add('d-none');
        DOM.videoPreviewContainer.classList.add('d-none');
        DOM.previewImage.src = '';
        DOM.previewVideo.src = '';
        
        if (news[id].fileData) {
            if (news[id].fileType.startsWith('image/')) {
                DOM.previewImage.src = news[id].fileData;
                DOM.imagePreviewContainer.classList.remove('d-none');
            } else if (news[id].fileType.startsWith('video/')) {
                DOM.previewVideo.src = news[id].fileData;
                DOM.videoPreviewContainer.classList.remove('d-none');
            }
        }
        
        DOM.newsModal.show();
    }

    function deleteNews(id) {
        if (confirm('¿Estás seguro de eliminar esta noticia?')) {
            news.splice(id, 1);
            localStorage.setItem('news', JSON.stringify(news));
            renderNews();
        }
    }
});