 /**
 * Search Suggestions Functionality
 * Handles the search input, suggestions display, and search execution
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('searchInput');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const suggestionsGrid = document.getElementById('suggestionsGrid');
    const searchQueryDisplay = document.getElementById('searchQuery');
    
    // API endpoint for search
    const SEARCH_API_URL = 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/search';
    
    // Minimum characters before triggering search
    const MIN_SEARCH_LENGTH = 2;
    
    // Debounce timer
    let debounceTimer;
    
    /**
     * Fetch search suggestions from API
     * @param {string} query - The search query
     * @returns {Promise} - Promise resolving to search results
     */
    async function fetchSearchSuggestions(query) {
        try {
            const response = await fetch(`${SEARCH_API_URL}?q=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Search API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching search suggestions:', error);
            return { results: [] }; // Return empty results on error
        }
    }
    
    /**
     * Display search suggestions in the UI
     * @param {Array} suggestions - Array of suggestion objects
     */
    function displaySearchSuggestions(suggestions) {
        // Clear previous suggestions
        suggestionsGrid.innerHTML = '';
        
        if (suggestions.length === 0) {
            suggestionsGrid.innerHTML = '<div class="no-results">No results found</div>';
            return;
        }
        
        // Create suggestion elements
        suggestions.forEach(suggestion => {
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'suggestion-item';
            suggestionElement.innerHTML = `
                <div class="suggestion-content" onclick="selectSuggestion('${suggestion.name || suggestion.title}')">
                    ${suggestion.name || suggestion.title}
                </div>
            `;
            suggestionsGrid.appendChild(suggestionElement);
        });
    }
    
    /**
     * Handle input in search box
     */
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.trim();
        
        // Update the search query display
        searchQueryDisplay.textContent = query || 'results';
        
        // Clear previous timer
        clearTimeout(debounceTimer);
        
        if (query.length > MIN_SEARCH_LENGTH) {
            // Show suggestions container
            searchSuggestions.classList.add('active');
            
            // Add loading indicator
            suggestionsGrid.innerHTML = '<div class="loading-suggestions">Loading suggestions...</div>';
            
            // Debounce API calls
            debounceTimer = setTimeout(async () => {
                const data = await fetchSearchSuggestions(query);
                displaySearchSuggestions(data.results || []);
            }, 300);
        } else {
            // Hide suggestions if query is too short
            searchSuggestions.classList.remove('active');
        }
    });
    
    /**
     * Handle form submission
     */
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const query = searchInput.value.trim();
        
        if (query) {
            // Hide suggestions
            searchSuggestions.classList.remove('active');
            
            // Perform search (redirect to search page or show results)
            performSearch(query);
        }
    });
    
    /**
     * Perform the actual search
     * @param {string} query - The search query
     */
    function performSearch(query) {
        // Redirect to search results page
        window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
    }
    
    /**
     * Select a suggestion and perform search
     * @param {string} suggestion - The selected suggestion text
     */
    window.selectSuggestion = function(suggestion) {
        searchInput.value = suggestion;
        searchSuggestions.classList.remove('active');
        performSearch(suggestion);
    };
    
    /**
     * Close suggestions when clicking outside
     */
    document.addEventListener('click', function(e) {
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer && !searchContainer.contains(e.target)) {
            searchSuggestions.classList.remove('active');
        }
    });
    
    // Add some basic styles for the loading indicator
    const style = document.createElement('style');
    style.textContent = `
        .loading-suggestions {
            padding: 10px;
            text-align: center;
            color: #666;
        }
        
        .no-results {
            padding: 10px;
            text-align: center;
            color: #666;
        }
        
        .suggestion-item {
            padding: 8px 12px;
            cursor: pointer;
            border-radius: 6px;
            transition: all 0.2s ease;
        }
        
        .suggestion-item:hover {
            background-color: #f0f0f0;
        }
    `;
    document.head.appendChild(style);
});