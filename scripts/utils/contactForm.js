async function displayModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "block";
    modal.setAttribute("aria-hidden", "false");
   
  
    // Récupérer les données du photographe
    const { photographer } = await getPhotographerData();
  
    // Mettre à jour le nom dans le paragraphe sous le titre
    const photographerNameElement = document.getElementById("photographer-name");
    photographerNameElement.textContent = photographer.name; // Insère le nom
  }

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}
