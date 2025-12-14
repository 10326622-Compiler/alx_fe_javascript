<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dynamic Quote Generator</title>
</head>
<body>
  <h1>Dynamic Quote Generator</h1>
  <div id="quoteDisplay"></div>
  <button id="newQuote">Show New Quote</button>

  <script>
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

    // Function to display a random quote
    function showRandomQuote() {
      if (quotes.length === 0) {
        quoteDisplay.innerHTML = '<p>No quotes available</p>';
        return;
      }

      // Get random index
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const quote = quotes[randomIndex];

      // Save to session storage
      saveLastViewedQuote(quote);

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

    // Function to create import/export controls
    function createImportExportControls() {
      const controlsContainer = document.createElement('div');

      // Create export button
      const exportButton = document.createElement('button');
      exportButton.textContent = 'Export Quotes as JSON';
      exportButton.onclick = exportToJsonFile;

      // Create import file input
      const importInput = document.createElement('input');
      importInput.type = 'file';
      importInput.id = 'importFile';
      importInput.accept = '.json';
      importInput.onchange = importFromJsonFile;

      // Create label for import
      const importLabel = document.createElement('label');
      importLabel.textContent = 'Import Quotes: ';
      importLabel.appendChild(importInput);

      // Append controls
      controlsContainer.appendChild(exportButton);
      controlsContainer.appendChild(document.createElement('br'));
      controlsContainer.appendChild(document.createElement('br'));
      controlsContainer.appendChild(importLabel);

      // Append to body
      document.body.appendChild(document.createElement('br'));
      document.body.appendChild(controlsContainer);
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

      // Save to local storage
      saveQuotes();

      // Clear input fields
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';

      // Display the newly added quote
      showRandomQuote();

      alert('Quote added successfully!');
    }

    // Function to export quotes to JSON file
    function exportToJsonFile() {
      // Convert quotes array to JSON string
      const dataStr = JSON.stringify(quotes, null, 2);
      
      // Create a Blob with the JSON data
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      // Create a download link
      const url = URL.createObjectURL(dataBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'quotes.json';
      
      // Trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
      
      alert('Quotes exported successfully!');
    }

    // Function to import quotes from JSON file
    function importFromJsonFile(event) {
      const fileReader = new FileReader();
      fileReader.onload = function(event) {
        try {
          const importedQuotes = JSON.parse(event.target.result);
          
          // Validate that imported data is an array
          if (!Array.isArray(importedQuotes)) {
            alert('Invalid file format. Please upload a valid JSON array of quotes.');
            return;
          }
          
          // Add imported quotes to existing quotes
          quotes.push(...importedQuotes);
          
          // Save to local storage
          saveQuotes();
          
          alert('Quotes imported successfully!');
          
          // Optionally show a random quote from the imported set
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
        
        // Clear existing content
        quoteDisplay.innerHTML = '';

        // Create quote text element
        const quoteText = document.createElement('p');
        quoteText.textContent = quote.text;

        // Create category element
        const quoteCategory = document.createElement('p');
        quoteCategory.textContent = `Category: ${quote.category}`;
        
        // Create session indicator
        const sessionIndicator = document.createElement('p');
        sessionIndicator.textContent = '(Last viewed this session)';

        // Append elements to quote display
        quoteDisplay.appendChild(quoteText);
        quoteDisplay.appendChild(quoteCategory);
        quoteDisplay.appendChild(sessionIndicator);
      }
    }

    // Event listener for new quote button
    newQuoteBtn.addEventListener('click', showRandomQuote);

    // Initialize application
    function initializeApp() {
      // Load quotes from local storage
      loadQuotes();
      
      // Create the add quote form
      createAddQuoteForm();
      
      // Create import/export controls
      createImportExportControls();
      
      // Display last viewed quote if available
      displayLastViewedQuote();
    }

    // Initialize the app when DOM is ready
    initializeApp();
  </script>
</body>
</html>
