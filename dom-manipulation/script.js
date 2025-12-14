// Initial quotes array with text and category
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Motivation" }
];

// Server URL for syncing (using JSONPlaceholder as mock API)
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

// Get references to DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const exportQuotesBtn = document.getElementById('exportQuotes');
const importFileInput = document.getElementById('importFile');
const categoryFilter = document.getElementById('categoryFilter');
const syncQuotesBtn = document.getElementById('syncQuotes');
const syncStatus = document.getElementById('syncStatus');
const notification = document.getElementById('notification');

// Function to show notification
function showNotification(message, duration = 3000) {
  notification.textContent = message;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, duration);
}

// Function to load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to save last viewed quote to session storage
function saveLastViewedQuote(quote) {
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Function to save last selected category filter
function saveSelectedCategory(category) {
  localStorage.setItem('selectedCategory', category);
}

// Function to load last selected category filter
function loadSelectedCategory() {
  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
    categoryFilter.value = savedCategory;
  }
}

// Function to populate categories dynamically
function populateCategories() {
  const categories = [...new Set(quotes.map(quote => quote.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  
  loadSelectedCategory();
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  saveSelectedCategory(selectedCategory);
  showRandomQuote();
}

// Function to get filtered quotes based on selected category
function getFilteredQuotes() {
  const selectedCategory = categoryFilter.value;
  
  if (selectedCategory === 'all') {
    return quotes;
  }
  
  return quotes.filter(quote => quote.category === selectedCategory);
}

// Function to display a random quote
function showRandomQuote() {
  const filteredQuotes = getFilteredQuotes();
  
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = '<p>No quotes available for this category</p>';
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  saveLastViewedQuote(quote);

  quoteDisplay.innerHTML = '';

  const quoteText = document.createElement('p');
  quoteText.textContent = quote.text;

  const quoteCategory = document.createElement('p');
  quoteCategory.textContent = `Category: ${quote.category}`;

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// Function to create the add quote form
function createAddQuoteForm() {
  const formContainer = document.createElement('div');

  const quoteInput = document.createElement('input');
  quoteInput.type = 'text';
  quoteInput.id = 'newQuoteText';
  quoteInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.onclick = addQuote;

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// Function to add a new quote
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (!quoteText || !quoteCategory) {
    alert('Please enter both quote text and category');
    return;
  }

  const newQuote = {
    text: quoteText,
    category: quoteCategory
  };

  quotes.push(newQuote);
  saveQuotes();
  populateCategories();

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';

  showRandomQuote();
  alert('Quote added successfully!');
}

// Function to export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'quotes.json';
  
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
  
  alert('Quotes exported successfully!');
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      
      if (!Array.isArray(importedQuotes)) {
        alert('Invalid file format. Please upload a valid JSON array of quotes.');
        return;
      }
      
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      
      alert('Quotes imported successfully!');
      showRandomQuote();
    } catch (error) {
      alert('Error parsing JSON file. Please ensure the file is valid JSON.');
      console.error('Import error:', error);
    }
  };
  
  fileReader.readAsText(event.target.files[0]);
}

// Function to display last viewed quote from session storage
function displayLastViewedQuote() {
  const lastQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    
    quoteDisplay.innerHTML = '';

    const quoteText = document.createElement('p');
    quoteText.textContent = quote.text;

    const quoteCategory = document.createElement('p');
    quoteCategory.textContent = `Category: ${quote.category}`;
    
    const sessionIndicator = document.createElement('p');
    sessionIndicator.textContent = '(Last viewed this session)';

    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
    quoteDisplay.appendChild(sessionIndicator);
  }
}

// Function to fetch quotes from server
async function fetchQuotesFromServer() {
  try {
    showNotification('Fetching data from server...', 2000);
    
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();
    
    // Simulate converting server data to quote format
    const serverQuotes = serverData.slice(0, 3).map((post, index) => ({
      text: post.title,
      category: index % 2 === 0 ? 'Server' : 'API'
    }));
    
    return serverQuotes;
  } catch (error) {
    console.error('Error fetching from server:', error);
    showNotification('Error fetching data from server', 3000);
    return null;
  }
}

// Function to post quotes to server
async function postQuotesToServer(quotesToPost) {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Synced Quotes',
        body: JSON.stringify(quotesToPost),
        userId: 1
      })
    });
    
    const result = await response.json();
    console.log('Posted to server:', result);
    return true;
  } catch (error) {
    console.error('Error posting to server:', error);
    return false;
  }
}

// Function to resolve conflicts (server data takes precedence)
function resolveConflicts(localQuotes, serverQuotes) {
  const conflicts = [];
  
  // Create a map of server quotes by text
  const serverQuotesMap = {};
  serverQuotes.forEach(sq => {
    serverQuotesMap[sq.text] = sq;
  });
  
  // Check for conflicts
  localQuotes.forEach(lq => {
    if (serverQuotesMap[lq.text] && serverQuotesMap[lq.text].category !== lq.category) {
      conflicts.push({
        text: lq.text,
        local: lq.category,
        server: serverQuotesMap[lq.text].category
      });
    }
  });
  
  return conflicts;
}

// Function to merge quotes (server takes precedence)
function mergeQuotes(localQuotes, serverQuotes) {
  const quoteMap = {};
  
  // Add all local quotes first
  localQuotes.forEach(quote => {
    quoteMap[quote.text] = quote;
  });
  
  // Server quotes override local ones
  serverQuotes.forEach(quote => {
    quoteMap[quote.text] = quote;
  });
  
  return Object.values(quoteMap);
}

// Function to sync with server
async function syncQuotes() {
  showNotification('Syncing with server...', 2000);
  
  // Fetch quotes from server
  const serverQuotes = await fetchQuotesFromServer();
  
  if (!serverQuotes) {
    showNotification('Sync failed - could not reach server', 3000);
    return;
  }
  
  // Check for conflicts
  const conflicts = resolveConflicts(quotes, serverQuotes);
  
  if (conflicts.length > 0) {
    showNotification(
      `Conflicts detected and resolved (${conflicts.length} conflicts). Server data took precedence.`,
      5000
    );
    
    console.log('Conflicts resolved:', conflicts);
  }
  
  // Merge quotes (server takes precedence)
  const mergedQuotes = mergeQuotes(quotes, serverQuotes);
  
  const oldCount = quotes.length;
  quotes = mergedQuotes;
  const newCount = quotes.length;
  
  // Save to local storage
  saveQuotes();
  
  // Update categories
  populateCategories();
  
  // Post current quotes to server
  await postQuotesToServer(quotes);
  
  // Update sync status
  const now = new Date().toLocaleTimeString();
  syncStatus.textContent = `Last sync: ${now}`;
  localStorage.setItem('lastSyncTime', now);
  
  // Show success notification
  alert('Quotes synced with server!');
  showNotification('Quotes synced with server!', 3000);
  
  const addedCount = newCount - oldCount;
  if (addedCount > 0) {
    console.log(`${addedCount} new quotes added from server.`);
  }
  if (conflicts.length > 0) {
    console.log(`${conflicts.length} conflicts resolved.`);
  }
  
  // Refresh display
  showRandomQuote();
}

// Function to load last sync time
function loadLastSyncTime() {
  const lastSync = localStorage.getItem('lastSyncTime');
  if (lastSync) {
    syncStatus.textContent = `Last sync: ${lastSync}`;
  }
}

// Function to setup periodic sync (every 5 minutes)
function setupPeriodicSync() {
  setInterval(async () => {
    console.log('Performing periodic sync...');
    await syncQuotes();
  }, 300000); // 5 minutes
}

// Event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
exportQuotesBtn.addEventListener('click', exportToJsonFile);
importFileInput.addEventListener('change', importFromJsonFile);
categoryFilter.addEventListener('change', filterQuotes);
syncQuotesBtn.addEventListener('click', syncQuotes);

// Initialize application
function initializeApp() {
  loadQuotes();
  populateCategories();
  createAddQuoteForm();
  displayLastViewedQuote();
  loadLastSyncTime();
  
  // Setup periodic sync
  setupPeriodicSync();
  
  showNotification('App initialized. Periodic sync enabled (every 5 minutes).', 3000);
}

// Initialize the app when DOM is ready
initializeApp();
