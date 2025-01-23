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

async function displayPhotographerData() {
    const { photographer, photographerMedia } = await getPhotographerData();

    // Affichage des informations du photographe
    const contactButton = document.querySelector('.contact_button');
    const infoBlock = document.createElement("div");
    const h2 = document.createElement('h2');
    h2.textContent = photographer.name;
    h2.setAttribute("aria-label", photographer.name);
    const h3 = document.createElement('h3');
    h3.textContent = `${photographer.city}, ${photographer.country}`;
    h3.setAttribute("aria-label", `${photographer.city}, ${photographer.country}`);
    const h4 = document.createElement('h4');
    h4.textContent = photographer.tagline;
    h4.setAttribute("aria-label", photographer.tagline);
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

    // Ajout du gestionnaire d'événement pour le tri
    document.getElementById('sortOptions').addEventListener('change', (event) => {
        const sortBy = event.target.value; // Récupérer la valeur sélectionnée
        const sortedMedia = sortMedia(photographerMedia, sortBy); // Trier les médias
        displayPhotographerMedia(sortedMedia); // Réafficher les médias triés
    });
}


function displayPhotographerMedia(mediaList) {
    const mediaContainer = document.querySelector('.media_container');
    mediaContainer.innerHTML = ''; // Réinitialise le conteneur

    mediaList.forEach((media, index) => {
        const mediaElement = document.createElement('div');
        mediaElement.classList.add('media_item');

        if (media.image) {
            // Si c'est une image
            const img = document.createElement('img');
            img.setAttribute('src', `assets/photographers/FishEye_Photos/SamplePhotos/${media.image}`);
            img.setAttribute('alt', media.title);
            img.setAttribute('data-index', index); // Ajout de l'index pour la lightbox
            img.addEventListener('click', () => openLightbox(index)); // Événement de clic pour ouvrir la lightbox
            mediaElement.appendChild(img);
        } else if (media.video) {
            // Si c'est une vidéo
            const video = document.createElement('video');
            video.setAttribute('src', `assets/photographers/FishEye_Photos/SamplePhotos/${media.video}`);
            video.setAttribute('controls', true);
            mediaElement.appendChild(video);
        }

        // Titre et likes du média
        const infoContainer = document.createElement('div');
        infoContainer.classList.add('info-container');

        const title = document.createElement('h5');
        title.textContent = media.title;

        const likesContainer = document.createElement('div');
        likesContainer.classList.add('likes-container');

        const likeCount = document.createElement('span');
        likeCount.classList.add('like-count');
        likeCount.textContent = media.likes; // Nombre initial de likes

        const likeButton = document.createElement('button');
        likeButton.classList.add('like-button');
        likeButton.innerHTML = `<i class="fa-solid fa-heart"></i>`;
        likeButton.setAttribute('aria-label', `Ajouter un like à ${media.title}`);
        likeButton.addEventListener('click', () => {
            media.likes++; // Incrémenter le nombre de likes
            likeCount.textContent = media.likes; // Mettre à jour l'affichage
            likeButton.disabled = true;
        });

        likesContainer.appendChild(likeCount);
        likesContainer.appendChild(likeButton);

        infoContainer.appendChild(title);
        infoContainer.appendChild(likesContainer);

        mediaElement.appendChild(infoContainer);
        mediaContainer.appendChild(mediaElement);
    });
}

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


//Utilisation du clavier pour changer de contenu
document.addEventListener('keydown', (event) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.style.display === 'flex') { 
        if (event.key === 'ArrowRight') {
            changeImage(1); // Image suivante
        } else if (event.key === 'ArrowLeft') {
            changeImage(-1); // Image précédente
        } else if (event.key === 'Escape') {
            closeLightbox(); // Ferme la lightbox
        }
    }
});


//Fonction pour filtrer les médias par popularité, date ou titre
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


displayPhotographerData();


