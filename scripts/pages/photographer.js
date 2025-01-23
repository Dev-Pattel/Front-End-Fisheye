// Récupérer les données des photographes
async function getPhotographerData() {
    const response = await fetch('../../data/photographers.json');
    const data = await response.json();
    const { photographers, media } = data;

    // Extraction de l'ID du photographe
    const urlParams = new URLSearchParams(window.location.search);
    const photographerId = parseInt(urlParams.get('id'));

    // Recherche du photographe et des médias correspondants
    const photographer = photographers.find(p => p.id === photographerId);
    const photographerMedia = media.filter(m => m.photographerId === photographerId);

    return { photographer, photographerMedia };
}

// Afficher les informations du photographe et les médias
async function displayPhotographerData() {
    const { photographer, photographerMedia } = await getPhotographerData();

    // Affichage des informations du photographe
    const contactButton = document.querySelector('.contact_button');
    const infoBlock = document.createElement("div");
    const h2 = document.createElement('h2');
    h2.textContent = photographer.name;
    const h3 = document.createElement('h3');
    h3.textContent = `${photographer.city}, ${photographer.country}`;
    const h4 = document.createElement('h4');
    h4.textContent = photographer.tagline;
    const picture = `assets/photographers/${photographer.portrait}`;
    const img = document.createElement('img');
    img.setAttribute("src", picture);
    img.setAttribute("alt", "photographer profile picture");

    contactButton.before(infoBlock);
    contactButton.after(img);
    infoBlock.appendChild(h2);
    infoBlock.appendChild(h3);
    infoBlock.appendChild(h4);

    // Tri initial par popularité
    const sortedMedia = sortMedia(photographerMedia, 'popularity');
    displayPhotographerMedia(sortedMedia);

    // Mettre à jour la liste des images pour la lightbox après l'affichage des médias
    images = Array.from(document.querySelectorAll('.media_container img'));

    // Calculer les likes totaux et mettre à jour l'encadré
    const totalLikes = calculateTotalLikes(photographerMedia);
    document.getElementById('total-likes').textContent = totalLikes;

    // Mettre à jour le prix à la journée
    document.getElementById('daily-price').textContent = photographer.price;
}

// Afficher les médias du photographe
function displayPhotographerMedia(mediaList) {
    const mediaContainer = document.querySelector('.media_container');
    mediaContainer.innerHTML = ''; // Réinitialise le conteneur

    mediaList.forEach((media, index) => {
        const mediaElement = document.createElement('div');
        mediaElement.classList.add('media_item');

        if (media.image) {
            const img = document.createElement('img');
            img.setAttribute('src', `assets/photographers/FishEye_Photos/SamplePhotos/${media.image}`);
            img.setAttribute('alt', media.title);
            img.setAttribute('data-index', index); // Ajout de l'index pour la lightbox
            img.addEventListener('click', () => openLightbox(index));
            mediaElement.appendChild(img);
        } else if (media.video) {
            const video = document.createElement('video');
            video.setAttribute('src', `assets/photographers/FishEye_Photos/SamplePhotos/${media.video}`);
            video.setAttribute('controls', true);
            mediaElement.appendChild(video);
        }

        const infoContainer = document.createElement('div');
        infoContainer.classList.add('info-container');

        const title = document.createElement('h5');
        title.textContent = media.title;

        const likesContainer = document.createElement('div');
        likesContainer.classList.add('likes-container');

        const likeCount = document.createElement('span');
        likeCount.classList.add('like-count');
        likeCount.textContent = media.likes;

        const likeButton = document.createElement('button');
        likeButton.classList.add('like-button');
        likeButton.innerHTML = `<i class="fa-solid fa-heart"></i>`;
        likeButton.addEventListener('click', () => handleLikeClick(likeCount, media, mediaList));

        likesContainer.appendChild(likeCount);
        likesContainer.appendChild(likeButton);

        infoContainer.appendChild(title);
        infoContainer.appendChild(likesContainer);

        mediaElement.appendChild(infoContainer);
        mediaContainer.appendChild(mediaElement);
    });
}


// Gestion des likes
// Fonction pour gérer le clic sur un bouton de like
function handleLikeClick(likeElement, media, photographerMedia) {
    // Vérifier si le média n'a pas encore été liké
    if (!likeElement.classList.contains('liked')) {
        // Ajouter un like au média
        media.likes += 1;

        // Mettre à jour l'affichage du nombre de likes pour le média
        likeElement.textContent = media.likes;

        // Ajouter la classe 'liked' pour indiquer que ce média est déjà liké
        likeElement.classList.add('liked');

        // Mettre à jour le compteur total de likes
        const totalLikes = calculateTotalLikes(photographerMedia);
        document.getElementById('total-likes').textContent = totalLikes;
    }
}

// Tri des médias
function sortMedia(mediaList, criterion) {
    if (criterion === 'popularity') {
        return mediaList.sort((a, b) => b.likes - a.likes);
    } else if (criterion === 'date') {
        return mediaList.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (criterion === 'title') {
        return mediaList.sort((a, b) => a.title.localeCompare(b.title));
    }
    return mediaList;
}

// Calculer le total des likes
function calculateTotalLikes(mediaList) {
    return mediaList.reduce((total, media) => total + media.likes, 0);
}

// Gestion de la lightbox
let currentImageIndex = 0;
let images = [];

function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightbox.style.display = 'flex';
    lightboxImg.src = images[currentImageIndex].src;
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

function changeImage(direction) {
    currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = images[currentImageIndex].src;
}

// Navigation avec le clavier pour la lightbox
document.addEventListener('keydown', (event) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.style.display === 'flex') {
        if (event.key === 'ArrowRight') {
            changeImage(1);
        } else if (event.key === 'ArrowLeft') {
            changeImage(-1);
        } else if (event.key === 'Escape') {
            closeLightbox();
        }
    }
});

// Lancer l'affichage initial
displayPhotographerData();
