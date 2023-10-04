import "../style.css";

// Constants
const ENDPOINT_COMPLETIONS = "https://api.openai.com/v1/chat/completions";
const ENDPOINT_IMAGES = "https://api.openai.com/v1/images/generations";

// Global variables
let API_KEY;

// Helper functions
async function getBlurb(title, theme) {
  // TODO Implement Me!
  // Use the OpenAI API to generate a blurb based on the title and theme.
  // You should use the global API_KEY variable to authenticate your request.
  // You must use fetch to make the request.
  // You should return the generated blurb.

  const prompt = `Generate a short manga blurb given this title (${title}) and theme (${theme}). The blurb should be shorter than 800 characters.`;
  try {
    const responseRaw = await fetch(`${ENDPOINT_COMPLETIONS}`, {
      method: 'POST', 
      headers: {"Content-Type": "application/json", Authorization: `Bearer ${API_KEY}`}, 
      body: JSON.stringify({"model": "gpt-3.5-turbo", "messages": [{"role": "user", "content": prompt}]})
    });
    const response = await responseRaw.json();  // make data accessible 
    return response.choices[0].message.content;
  } catch (err) {
      alert("API error: check browser console for more information.");
      console.log(err);
  }
}

async function getCoverImage(blurb) {
  // TODO Implement Me!
  // Use the OpenAI API to generate a cover image based on the blurb.
  // You should use the global API_KEY variable to authenticate your request.
  // You must use fetch to make the request.
  // You should return the URL of the generated image.

  const prompt = `Generate a cover image for a manga given this blurb: ${blurb}.`;
  try {
    const rawLink = await fetch(`${ENDPOINT_IMAGES}`, {
      method: 'POST', 
      headers: {"Content-Type": "application/json", Authorization: `Bearer ${API_KEY}`}, 
      body: JSON.stringify({"prompt": prompt})
    });
    const link = await rawLink.json();
    return link.data[0].url;
  } catch (err) {
      alert("API error: check browser console for more information.");
      console.log(err);
  }
}

// Event handlers
async function handleFormSubmission(e) {
  // TODO Implement Me!
  // This function is called when the form is submitted.
  // It should get the title and theme from the form.
  // It should then call getBlurb and getCoverImage to generate the blurb and image.
  // Finally, it should update the DOM to display the blurb and image.

  e.preventDefault();
  const blurbElement = document.getElementById("generatedBlurb");
  blurbElement.classList.add("hidden");
  const coverElement= document.getElementById("coverImage");
  coverElement.classList.add("hidden");
  const titleInput = e.currentTarget.querySelector("#mangaTitle");
  const title = titleInput.value;
  const themeInput = e.currentTarget.querySelector("#mangaTheme");
  const theme = themeInput.value;
  const genButton = e.currentTarget.querySelector("#generateButton");

  // handle if title or theme is missing
  if (title.trim() === "" || theme.trim() === "") {
    alert("Please enter both a title and a theme.");
    return;
  }

  // update DOM directly after submitting (waiting on async functions)
  genButton.classList.add("hidden");
  const spinner = document.getElementById("spinner");
  spinner.classList.remove("hidden");
  titleInput.disabled = true;
  themeInput.disabled = true;

  // update DOM after receiving blurb 
  let blurb = await getBlurb(title, theme);
  blurbElement.textContent = blurb;
  blurbElement.classList.remove("hidden");

  // update DOM after receiving cover
  let cover = await getCoverImage(blurb);
  coverElement.src = cover;
  coverElement.classList.remove("hidden");
  spinner.classList.add("hidden");
  genButton.classList.remove("hidden");
  titleInput.disabled = false;
  themeInput.disabled = false;

}

document.addEventListener("DOMContentLoaded", () => {
  API_KEY = localStorage.getItem("openai_api_key");

  if (!API_KEY) {
    alert(
      "Please store your API key in local storage with the key 'openai_api_key'.",
    );
    return;
  }

  const mangaInputForm = document.getElementById("mangaInputForm");
  mangaInputForm.addEventListener("submit", handleFormSubmission);
});
