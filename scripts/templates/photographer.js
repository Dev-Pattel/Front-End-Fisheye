function photographerTemplate(data) {
    const { id, name, portrait, city, country, tagline, price } = data;

    const picture = `assets/photographers/${portrait}`;
    //Création de la carte du photographe 
    function getUserCardDOM() {
        const article = document.createElement('article');
        const img = document.createElement('img');
        img.setAttribute("src", picture);
        img.setAttribute("alt", name);
        const h2 = document.createElement('h2');
        h2.textContent = name;
        const h3 = document.createElement('h3');
        h3.textContent = city + ', ' + country;
        const h4 = document.createElement('h4');
        h4.textContent = tagline;
        const h5 = document.createElement('h5');
        h5.textContent = price + '€/jour';

        article.appendChild(img);
        article.appendChild(h2);
        article.appendChild(h3);
        article.appendChild(h4);
        article.appendChild(h5);

        // Ajouter un lien autour de l'article
        const link = document.createElement('a');
        link.setAttribute('href', `photographer.html?id=${id}`);
        link.style.textDecoration= 'none';
        link.appendChild(article);

        return link;
    }
    return { name, picture, getUserCardDOM };
}
