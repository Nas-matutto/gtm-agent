// Lead Agent Frontend JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Set up event listeners
    setupTabNavigation();
    setupProductAnalysis();
    setupLeadGeneration();
    setupSequences();
    
    // Initialize with product tab active
    showTab('product');
}

// Tab Navigation
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            showTab(tabName);
        });
    });
}

function showTab(tabName) {
    // Hide all tab contents
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => {
        tab.style.display = 'none';
        tab.classList.add('hidden');
    });
    
    // Show selected tab
    const targetTab = document.getElementById(tabName + '-tab');
    if (targetTab) {
        targetTab.style.display = 'block';
        targetTab.classList.remove('hidden');
        targetTab.classList.add('fade-in');
    }
    
    // Update tab button active states
    const allTabButtons = document.querySelectorAll('.tab-btn');
    allTabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.classList.add('border-transparent', 'text-gray-500');
        btn.classList.remove('border-indigo-500', 'text-indigo-600');
    });
    
    // Set active state for current tab
    const activeTabButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTabButton) {
        activeTabButton.classList.add('active');
        activeTabButton.classList.remove('border-transparent', 'text-gray-500');
        activeTabButton.classList.add('border-indigo-500', 'text-indigo-600');
    }
}

// Product Analysis functionality
function setupProductAnalysis() {
    const analyzeBtn = document.getElementById('analyze-btn');
    const productForm = document.getElementById('product-form');
    const analysisResults = document.getElementById('analysis-results');
    const backBtn = document.getElementById('back-to-form');
    const generateLeadsBtn = document.getElementById('generate-leads-btn');
    
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', async function() {
            const description = document.getElementById('product-description').value;
            
            if (!description.trim()) {
                showNotification('Please enter a product description', 'warning');
                return;
            }
            
            // Show loading state
            showLoadingState(analyzeBtn, 'Analyzing with AI...');
            
            try {
                // Make actual API call to your backend
                const response = await fetch('/api/analyze-product', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        description: description
                    })
                });
                
                const result = await response.json();
                
                if (!response.ok) {
                    throw new Error(result.detail || 'Analysis failed');
                }
                
                if (result.success) {
                    // Update the UI with real AI results
                    updateAnalysisResults(result.data);
                    showAnalysisResults();
                    showNotification('Analysis completed successfully!', 'success');
                } else {
                    throw new Error(result.error || 'Analysis failed');
                }
                
            } catch (error) {
                console.error('Analysis error:', error);
                showNotification(`Analysis failed: ${error.message}`, 'error');
            } finally {
                hideLoadingState(analyzeBtn, '<i class="fas fa-magic mr-2"></i>Analyze Product');
            }
        });
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            showProductForm();
        });
    }
    
    if (generateLeadsBtn) {
        generateLeadsBtn.addEventListener('click', function() {
            // Switch to leads tab
            showTab('leads');
            showNotification('Generating leads based on your analysis...', 'info');
        });
    }
}

// Enhanced function to update the analysis results with new data structure
function updateAnalysisResults(data) {
    console.log('Updating analysis results with data:', data);
    
    // Update target audience section with more detailed information
    const targetAudienceSection = document.querySelector('#analysis-results .grid .bg-gray-50:first-child');
    if (targetAudienceSection && data.target_audience) {
        const audienceCard = targetAudienceSection.querySelector('.bg-white');
        if (audienceCard) {
            // Update primary audience title
            const titleElement = audienceCard.querySelector('h4');
            if (titleElement) {
                titleElement.textContent = data.target_audience.primary_company_type || 'Target Company Type';
            }
            
            // Update description with more detailed info
            const description = audienceCard.querySelector('p');
            if (description) {
                const decisionMaker = data.target_audience.primary_decision_maker;
                const companyChar = data.target_audience.company_characteristics || 'Target companies';
                const companySize = data.target_audience.company_size || 'optimal size';
                const decisionMakerTitle = decisionMaker?.title || 'Key decision maker';
                const department = decisionMaker?.department || 'relevant department';
                
                description.textContent = `${companyChar} with ${companySize}. Primary decision maker: ${decisionMakerTitle} in ${department}.`;
            }
            
            // Update the details grid with new structure
            const detailDivs = audienceCard.querySelectorAll('.grid > div');
            if (detailDivs.length >= 4) {
                // Industry
                const industryLabel = detailDivs[0].querySelector('p.text-xs');
                const industryValue = detailDivs[0].querySelector('p.font-semibold');
                if (industryLabel && industryValue) {
                    industryLabel.textContent = 'INDUSTRY';
                    industryValue.textContent = data.target_audience.industry || 'Technology';
                }
                
                // Company Size
                const sizeLabel = detailDivs[1].querySelector('p.text-xs');
                const sizeValue = detailDivs[1].querySelector('p.font-semibold');
                if (sizeLabel && sizeValue) {
                    sizeLabel.textContent = 'COMPANY SIZE';
                    sizeValue.textContent = data.target_audience.company_size || '50-500 employees';
                }
                
                // Decision Maker
                const decisionLabel = detailDivs[2].querySelector('p.text-xs');
                const decisionValue = detailDivs[2].querySelector('p.font-semibold');
                if (decisionLabel && decisionValue) {
                    decisionLabel.textContent = 'DECISION MAKER';
                    decisionValue.textContent = data.target_audience.primary_decision_maker?.title || 'Key Executive';
                }
                
                // Revenue Range
                const revenueLabel = detailDivs[3].querySelector('p.text-xs');
                const revenueValue = detailDivs[3].querySelector('p.font-semibold');
                if (revenueLabel && revenueValue) {
                    revenueLabel.textContent = 'REVENUE RANGE';
                    revenueValue.textContent = data.target_audience.revenue_range || 'Mid-market';
                }
            }
        }
    }
    
    // Update Additional Target Audiences section
    const audiencesSection = document.querySelector('#additional-audiences-container');
    if (audiencesSection && data.additional_target_audiences) {
        // Clear existing content
        audiencesSection.innerHTML = '';
        
        // Add new audiences from AI response
        data.additional_target_audiences.forEach((audience, index) => {
            const audienceDiv = document.createElement('div');
            audienceDiv.className = 'flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200';
            audienceDiv.innerHTML = `
                <div class="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm">${audience.rank}</div>
                <div>
                    <h4 class="font-bold mb-1 text-gray-800">${audience.company_type}</h4>
                    <p class="text-gray-600 text-sm">${audience.why_target_them}</p>
                </div>
            `;
            audiencesSection.appendChild(audienceDiv);
        });
    }
    
    // Update Top Target Countries section (9 countries)
    const countriesSection = document.querySelector('#target-countries-container');
    if (countriesSection && data.top_target_countries) {
        // Clear existing content
        countriesSection.innerHTML = '';
        
        // Country flag mapping
        const countryFlags = {
            'United States': '🇺🇸', 'Canada': '🇨🇦', 'United Kingdom': '🇬🇧', 'Germany': '🇩🇪',
            'France': '🇫🇷', 'Australia': '🇦🇺', 'Japan': '🇯🇵', 'Singapore': '🇸🇬',
            'Netherlands': '🇳🇱', 'Sweden': '🇸🇪', 'Switzerland': '🇨🇭', 'Norway': '🇳🇴',
            'Denmark': '🇩🇰', 'Finland': '🇫🇮', 'New Zealand': '🇳🇿', 'Ireland': '🇮🇪',
            'Israel': '🇮🇱', 'South Korea': '🇰🇷', 'Taiwan': '🇹🇼', 'Hong Kong': '🇭🇰',
            'UAE': '🇦🇪', 'Saudi Arabia': '🇸🇦', 'Brazil': '🇧🇷', 'Mexico': '🇲🇽',
            'India': '🇮🇳', 'China': '🇨🇳', 'South Africa': '🇿🇦', 'Italy': '🇮🇹',
            'Spain': '🇪🇸', 'Poland': '🇵🇱', 'Czech Republic': '🇨🇿', 'Belgium': '🇧🇪',
            'Austria': '🇦🇹', 'Portugal': '🇵🇹', 'Greece': '🇬🇷', 'Turkey': '🇹🇷'
        };
        
        // Add countries from AI response
        data.top_target_countries.forEach((country, index) => {
            const countryDiv = document.createElement('div');
            countryDiv.className = 'bg-white border border-gray-200 rounded-lg p-4 text-center relative';
            
            // Add ranking badge with different colors for top 3
            let rankingBadge;
            if (country.rank <= 3) {
                rankingBadge = `<div class="absolute top-2 left-2 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">${country.rank}</div>`;
            } else if (country.rank <= 6) {
                rankingBadge = `<div class="absolute top-2 left-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">${country.rank}</div>`;
            } else {
                rankingBadge = `<div class="absolute top-2 left-2 w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-bold">${country.rank}</div>`;
            }
            
            countryDiv.innerHTML = `
                ${rankingBadge}
                <div class="text-2xl mb-2">${countryFlags[country.country] || '🌍'}</div>
                <h4 class="font-bold text-gray-800 text-sm">${country.country}</h4>
                <p class="text-gray-600 text-xs mt-2 leading-tight">${country.market_size_insight}</p>
            `;
            countriesSection.appendChild(countryDiv);
        });
    }
}

function showAnalysisResults() {
    const productForm = document.getElementById('product-form');
    const analysisResults = document.getElementById('analysis-results');
    
    if (productForm && analysisResults) {
        productForm.style.display = 'none';
        analysisResults.style.display = 'block';
        analysisResults.classList.remove('hidden');
        analysisResults.classList.add('fade-in');
    }
}

function showProductForm() {
    const productForm = document.getElementById('product-form');
    const analysisResults = document.getElementById('analysis-results');
    
    if (productForm && analysisResults) {
        analysisResults.style.display = 'none';
        analysisResults.classList.add('hidden');
        productForm.style.display = 'block';
        productForm.classList.add('fade-in');
    }
}

// Lead Generation functionality
function setupLeadGeneration() {
    const selectAllCheckbox = document.querySelector('thead input[type="checkbox"]');
    const leadCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    const createSequenceBtn = document.getElementById('create-sequence-btn');
    
    // Select all functionality
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            leadCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateSelectedCount();
        });
    }
    
    // Individual checkbox selection
    leadCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectedCount();
            
            // Update select all checkbox state
            const checkedCount = document.querySelectorAll('tbody input[type="checkbox"]:checked').length;
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = checkedCount === leadCheckboxes.length;
                selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < leadCheckboxes.length;
            }
        });
    });
    
    // Create sequence button
    if (createSequenceBtn) {
        createSequenceBtn.addEventListener('click', function() {
            const selectedLeads = document.querySelectorAll('tbody input[type="checkbox"]:checked');
            
            if (selectedLeads.length === 0) {
                showNotification('Please select at least one lead to create a sequence', 'warning');
                return;
            }
            
            // Switch to sequences tab
            showTab('sequences');
            showNotification(`Creating sequence for ${selectedLeads.length} selected leads...`, 'success');
        });
    }
    
    // Lead action buttons
    setupLeadActions();
}

function setupLeadActions() {
    const viewButtons = document.querySelectorAll('button[class*="text-blue-600"]');
    const emailButtons = document.querySelectorAll('button[class*="text-green-600"]');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const leadName = row.querySelector('td:nth-child(2)').textContent;
            showNotification(`Viewing details for ${leadName}`, 'info');
            // Here you would typically open a modal or navigate to a detail page
        });
    });
    
    emailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const leadName = row.querySelector('td:nth-child(2)').textContent;
            showNotification(`Creating email for ${leadName}`, 'info');
            // Here you would typically open an email composer
        });
    });
}

function updateSelectedCount() {
    const selectedCount = document.querySelectorAll('tbody input[type="checkbox"]:checked').length;
    const createSequenceBtn = document.getElementById('create-sequence-btn');
    
    if (createSequenceBtn) {
        if (selectedCount > 0) {
            createSequenceBtn.innerHTML = `<i class="fas fa-envelope mr-2"></i>Create Sequence (${selectedCount})`;
            createSequenceBtn.classList.remove('opacity-50');
            createSequenceBtn.disabled = false;
        } else {
            createSequenceBtn.innerHTML = '<i class="fas fa-envelope mr-2"></i>Create Sequence';
            createSequenceBtn.classList.add('opacity-50');
            createSequenceBtn.disabled = true;
        }
    }
}

// Sequences functionality
function setupSequences() {
    const previewBtn = document.querySelector('button[class*="bg-gray-100"]');
    const sendBtn = document.querySelector('button[class*="bg-green-600"]');
    const removeButtons = document.querySelectorAll('.fa-times');
    
    // Remove lead from sequence
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const leadTag = this.closest('div.flex');
            if (leadTag && leadTag.classList.contains('bg-indigo-50')) {
                leadTag.remove();
                showNotification('Lead removed from sequence', 'info');
            }
        });
    });
    
    // Preview functionality
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            if (buttonText.includes('Preview')) {
                showNotification('Opening email preview...', 'info');
                // Here you would show a preview modal
            }
        });
    }
    
    // Send sequence
    if (sendBtn) {
        sendBtn.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            if (buttonText.includes('Send')) {
                const subjectInput = document.querySelector('#sequences-tab input[type="text"]');
                const templateTextarea = document.querySelector('#sequences-tab textarea');
                
                if (!subjectInput || !templateTextarea) {
                    showNotification('Email form not found', 'error');
                    return;
                }
                
                const subject = subjectInput.value;
                const template = templateTextarea.value;
                
                if (!subject.trim() || !template.trim()) {
                    showNotification('Please fill in both subject and email template', 'warning');
                    return;
                }
                
                showLoadingState(this, 'Sending...');
                
                // Simulate sending
                setTimeout(() => {
                    hideLoadingState(this, '<i class="fas fa-paper-plane mr-2"></i>Send Sequence');
                    showNotification('Sequence sent successfully!', 'success');
                }, 3000);
            }
        });
    }
}

// Utility functions
function showLoadingState(button, text) {
    button.disabled = true;
    button.innerHTML = `<i class="fas fa-spinner loading-spin mr-2"></i>${text}`;
    button.classList.add('opacity-75');
}

function hideLoadingState(button, originalText) {
    button.disabled = false;
    button.innerHTML = originalText;
    button.classList.remove('opacity-75');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg border fade-in max-w-sm`;
    
    // Set styles based on type for light theme
    switch (type) {
        case 'success':
            notification.classList.add('bg-green-100', 'border-green-200', 'text-green-800');
            break;
        case 'warning':
            notification.classList.add('bg-yellow-100', 'border-yellow-200', 'text-yellow-800');
            break;
        case 'error':
            notification.classList.add('bg-red-100', 'border-red-200', 'text-red-800');
            break;
        default:
            notification.classList.add('bg-blue-100', 'border-blue-200', 'text-blue-800');
    }
    
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <span class="text-sm font-medium">${message}</span>
            <button class="ml-3 text-gray-500 hover:text-gray-700 text-lg" onclick="this.parentElement.parentElement.remove()">
                ×
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// API placeholder functions (to be replaced with actual API calls)
async function analyzeProduct(description) {
    // This will be replaced with actual API call to your Python backend
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                targetAudience: "Mid-sized Technology Companies",
                markets: ["Software Development", "Marketing Agencies", "E-commerce"],
                regions: ["North America", "Europe", "Asia-Pacific"]
            });
        }, 2000);
    });
}

async function generateLeads(criteria) {
    // This will be replaced with actual API call to your Python backend
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    name: "Sarah Johnson",
                    company: "TechFlow Solutions",
                    title: "Project Manager",
                    email: "sarah.j@techflow.io",
                    insight: "Scaling remote team operations"
                }
                // More leads...
            ]);
        }, 3000);
    });
}

async function sendSequence(leads, subject, template) {
    // This will be replaced with actual API call to your Python backend
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                sent: leads.length,
                message: "Sequence sent successfully"
            });
        }, 3000);
    });
}
