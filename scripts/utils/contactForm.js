// DOM Champ de formulaire
const form = document.querySelector("form")

//Fonction pour faire apparaitre la modale de contact lors du clic de l'utilisateur
async function displayModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "block";
    modal.setAttribute("aria-hidden", "false");
  
    // Récupérer les données du photographe
    const { photographer } = await getPhotographerData();
  
    // Mettre à jour le nom dans le paragraphe sous le titre
    const photographerNameElement = document.getElementById("photographer-name");
    photographerNameElement.textContent = photographer.name;
  }
//Fonction pour fermer la modale de contact
function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}

//Fonction se déclenchant à l'envoi du formulaire par l'utilisateur en cliquant sur submit.
//Ferme la modale après l'envoi et récupération des données envoyées à travers un console.log
function SubmitContactForm() {
  const firstName = document.getElementById("first-name").value
  const lastName = document.getElementById("last-name").value
  const email = document.getElementById("email").value
  const userMessage = document.getElementById("votre-message").value
  closeModal()

  console.log(firstName, lastName, email, userMessage)
}
  form.addEventListener("submit", (event) => {
    event.preventDefault()
  })

  
