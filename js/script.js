// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// NASA APOD API key (replace 'DEMO_KEY' with your own key for more requests)
const apiKey = 'melusmhBCicojTetJCk7jLC5U6HVGWRVplvXp6Mx';

// Find the gallery container and the button
const gallery = document.getElementById('gallery');
const getImagesBtn = document.getElementById('getImagesBtn');

// Modal elements
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');

// Fun space facts array
const spaceFacts = [
  "Did you know? A day on Venus is longer than a year on Venus!",
  "Did you know? Neutron stars can spin at a rate of 600 rotations per second!",
  "Did you know? The footprints on the Moon will be there for millions of years.",
  "Did you know? Jupiter is so big that over 1,300 Earths could fit inside it!",
  "Did you know? The Sun makes up more than 99% of the mass of our solar system.",
  "Did you know? There are more stars in the universe than grains of sand on Earth.",
  "Did you know? Space is completely silent—there’s no air for sound to travel through.",
  "Did you know? The hottest planet in our solar system is Venus, not Mercury.",
  "Did you know? Saturn could float in water because it’s mostly made of gas!",
  "Did you know? The Milky Way galaxy will collide with the Andromeda galaxy in about 4.5 billion years."
];

// Pick a random fact
const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];

// Display the fact above the gallery
const factSection = document.createElement('section');
factSection.className = 'space-fact';
factSection.innerHTML = `<span class="fact-label">Did You Know?</span> <span class="fact-text">${randomFact}</span>`;
const filters = document.querySelector('.filters');
filters.insertAdjacentElement('afterend', factSection);

// Function to open the modal with image details
function openModal(item) {
  modalImg.src = item.hdurl || item.url; // Use HD image if available
  modalImg.alt = item.title;
  modalTitle.textContent = item.title;
  modalDate.textContent = item.date;
  modalExplanation.textContent = item.explanation;
  modal.style.display = 'block';
}

// Close modal when X is clicked or when clicking outside modal content
closeModal.onclick = function() {
  modal.style.display = 'none';
};
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

// Function to display a loading message in the gallery
function showLoading() {
  gallery.innerHTML = '<div class="placeholder"><div class="placeholder-icon">🔄</div><p>Loading space photos…</p></div>';
}

// Function to display APOD images in the gallery
function displayGallery(data) {
  // Debug: log the API response
  console.log('APOD API response:', data);

  // Handle API error object
  if (data.error) {
    gallery.innerHTML = `<div class="placeholder"><div class="placeholder-icon">🚫</div><p>${data.error.message}</p></div>`;
    return;
  }

  // Clear the gallery first
  gallery.innerHTML = '';

  // If the API returns a single object instead of an array, wrap it in an array
  const items = Array.isArray(data) ? data : [data];

  // Loop through each item and create HTML for it
  items.forEach(item => {
    if (item.media_type === 'image') {
      // Create a div for each gallery item (image)
      const div = document.createElement('div');
      div.className = 'gallery-item';
      div.innerHTML = `
        <img src="${item.url}" alt="${item.title}" />
        <h3>${item.title}</h3>
        <p>${item.date}</p>
      `;
      div.addEventListener('click', () => openModal(item));
      gallery.appendChild(div);
    } else if (item.media_type === 'video') {
      // Handle video entries
      const div = document.createElement('div');
      div.className = 'gallery-item';
      // If it's a YouTube video, embed it, otherwise show a link
      let videoContent = '';
      if (item.url.includes('youtube.com') || item.url.includes('youtu.be')) {
        // Embed YouTube video
        videoContent = `<div class="video-wrapper"><iframe src="${item.url.replace('watch?v=', 'embed/')}" frameborder="0" allowfullscreen title="${item.title}"></iframe></div>`;
      } else {
        // Show a clear, clickable link for other videos
        videoContent = `<a href="${item.url}" target="_blank" rel="noopener" class="video-link">Watch Video</a>`;
      }
      div.innerHTML = `
        ${videoContent}
        <h3>${item.title}</h3>
        <p>${item.date}</p>
      `;
      // Optional: open modal with explanation on click
      div.addEventListener('click', () => openModal(item));
      gallery.appendChild(div);
    }
  });
}

// Function to fetch APOD data for a date range
function fetchAPOD(startDate, endDate) {
  showLoading(); // Show loading message before fetching

  // Build the API URL with the selected dates
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  // Use fetch to get data from NASA's API
  fetch(url)
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
      displayGallery(data); // Show the images in the gallery
    })
    .catch(error => {
      // Handle any errors
      console.error('Error fetching APOD data:', error);
      gallery.innerHTML = '<p>Sorry, there was a problem loading the images.</p>';
    });
}

// When the button is clicked, get the selected dates and fetch images
getImagesBtn.addEventListener('click', () => {
  const startDate = startInput.value;
  const endDate = endInput.value;
  fetchAPOD(startDate, endDate);
});

// On page load, show the default range
fetchAPOD(startInput.value, endInput.value);
