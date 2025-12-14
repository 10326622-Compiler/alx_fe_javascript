// Initial quotes array with text and category
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Motivation" }
];

// Get references to DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');

// Function to display a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = '<p>No quotes available</p>';
    return;
  }

  // Get random index
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Clear existing content
  quoteDisplay.innerHTML = '';

  // Create quote text element
  const quoteText = document.createElement('p');
  quoteText.textContent = quote.text;

  // Create category element
  const quoteCategory = document.createElement('p');
  quoteCategory.textContent = `Category: ${quote.category}`;

  // Append elements to quote display
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// Function to create the add quote form
function createAddQuoteForm() {
  // Create form container
  const formContainer = document.createElement('div');

  // Create input for quote text
  const quoteInput = document.createElement('input');
  quoteInput.type = 'text';
  quoteInput.id = 'newQuoteText';
  quoteInput.placeholder = 'Enter a new quote';

  // Create input for category
  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';

  // Create add button
  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.onclick = addQuote;

  // Append inputs and button to form container
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  // Append form container to body
  document.body.appendChild(formContainer);
}

// Function to add a new quote
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

  // Validate inputs
  if (!quoteText || !quoteCategory) {
    alert('Please enter both quote text and category');
    return;
  }

  // Create new quote object
  const newQuote = {
    text: quoteText,
    category: quoteCategory
  };

  // Add to quotes array
  quotes.push(newQuote);

  // Clear input fields
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';

  // Display the newly added quote
  showRandomQuote();

  alert('Quote added successfully!');
}

// Event listener for new quote button
newQuoteBtn.addEventListener('click', showRandomQuote);

// Create the add quote form on page load
createAddQuoteForm();
```

## **Project Structure:**
```
alx_fe_javascript/
└── dom-manipulation/
    ├── index.html
    └── script.js
