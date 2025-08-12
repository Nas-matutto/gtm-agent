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
            
            // The showTab function now handles the active state updates
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

// New function to update the analysis results with real data
function updateAnalysisResults(data) {
    // Update target audience section
    const targetAudienceSection = document.querySelector('#analysis-results .grid .bg-gray-50:first-child');
    if (targetAudienceSection && data.target_audience) {
        const audienceCard = targetAudienceSection.querySelector('.bg-white');
        if (audienceCard) {
            // Update primary audience
            audienceCard.querySelector('h4').textContent = data.target_audience.primary || 'Target Audience';
            
            // Update description
            const description = audienceCard.querySelector('p');
            if (description) {
                description.textContent = `Companies in the ${data.target_audience.industry} industry, typically ${data.target_audience.company_size}, facing challenges with ${data.target_audience.pain_points?.join(', ') || 'various operational issues'}.`;
            }
            
            // Update the details grid
            const detailDivs = audienceCard.querySelectorAll('.grid > div');
            if (detailDivs.length >= 4) {
                detailDivs[0].querySelector('p').textContent = data.target_audience.industry || 'Technology';
                detailDivs[1].querySelector('p').textContent = data.target_audience.company_size || '50-500 employees';
                detailDivs[2].querySelector('p').textContent = data.target_audience.roles?.[0] || 'Decision Makers';
                detailDivs[3].querySelector('p').textContent = data.target_audience.pain_points?.[0] || 'Operational Efficiency';
            }
        }
    }
    
    // Update recommended markets section
    const marketsSection = document.querySelector('#analysis-results .grid .bg-gray-50:last-child');
    if (marketsSection && data.recommended_markets) {
        const marketsContainer = marketsSection.querySelector('.space-y-4');
        if (marketsContainer) {
            // Clear existing markets
            marketsContainer.innerHTML = '';
            
            // Add new markets from AI response
            data.recommended_markets.forEach((market, index) => {
                const marketDiv = document.createElement('div');
                marketDiv.className = 'flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200';
                marketDiv.innerHTML = `
                    <div class="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm">${index + 1}</div>
                    <div>
                        <h4 class="font-bold mb-1 text-gray-800">${market.market}</h4>
                        <p class="text-gray-600 text-sm">${market.description}</p>
                    </div>
                `;
                marketsContainer.appendChild(marketDiv);
            });
        }
    }
    
    // Update regions section
    const regionsSection = document.querySelector('#analysis-results .bg-gray-50.border.border-gray-200.rounded-lg.p-6.mb-8');
    if (regionsSection && data.target_regions) {
        const regionsGrid = regionsSection.querySelector('.grid');
        if (regionsGrid) {
            // Clear existing regions
            regionsGrid.innerHTML = '';
            
            // Add new regions from AI response
            data.target_regions.forEach(region => {
                const regionDiv = document.createElement('div');
                regionDiv.className = 'bg-white border border-gray-200 rounded-lg p-4 text-center';
                
                // Simple flag emoji mapping
                const flags = {
                    'North America': '🇺🇸',
                    'Europe': '🇪🇺',
                    'Asia-Pacific': '🌏',
                    'Latin America': '🌎',
                    'Middle East': '🌍',
                    'Africa': '🌍'
                };
                
                regionDiv.innerHTML = `
                    <div class="text-2xl mb-2">${flags[region.region] || '🌍'}</div>
                    <h4 class="font-bold text-gray-800">${region.region}</h4>
                    <p class="text-gray-600 text-sm">${region.reasoning || `Score: ${region.score}`}</p>
                `;
                regionsGrid.appendChild(regionDiv);
            });
        }
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
    const selectAllCheckbox = document.getElementById('select-all-leads');
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
            const sequencesTabBtn = document.querySelector('[data-tab="sequences"]');
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            sequencesTabBtn.classList.add('active');
            
            showNotification(`Creating sequence for ${selectedLeads.length} selected leads...`, 'success');
        });
    }
    
    // Lead action buttons
    setupLeadActions();
}

function setupLeadActions() {
    const viewButtons = document.querySelectorAll('.view-lead-btn');
    const emailButtons = document.querySelectorAll('.email-lead-btn');
    
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
            createSequenceBtn.innerHTML = `<i class="fas fa-envelope mr-3"></i>Create Sequence (${selectedCount})`;
            createSequenceBtn.classList.remove('opacity-50');
            createSequenceBtn.disabled = false;
        } else {
            createSequenceBtn.innerHTML = '<i class="fas fa-envelope mr-3"></i>Create Sequence';
            createSequenceBtn.classList.add('opacity-50');
            createSequenceBtn.disabled = true;
        }
    }
}

// Sequences functionality
function setupSequences() {
    const previewBtn = document.querySelector('[data-action="preview"]');
    const sendBtn = document.querySelector('[data-action="send"]');
    const removeButtons = document.querySelectorAll('.fa-times');
    
    // Remove lead from sequence
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const leadTag = this.closest('div');
            leadTag.remove();
            showNotification('Lead removed from sequence', 'info');
        });
    });
    
    // Preview functionality
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            showNotification('Opening email preview...', 'info');
            // Here you would show a preview modal
        });
    }
    
    // Send sequence
    if (sendBtn) {
        sendBtn.addEventListener('click', function() {
            const subject = document.querySelector('input[type="text"]').value;
            const template = document.querySelector('textarea').value;
            
            if (!subject.trim() || !template.trim()) {
                showNotification('Please fill in both subject and email template', 'warning');
                return;
            }
            
            showLoadingState(this, 'Sending...');
            
            // Simulate sending
            setTimeout(() => {
                hideLoadingState(this, 'Send Sequence');
                showNotification('Sequence sent successfully!', 'success');
            }, 3000);
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
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg backdrop-blur-lg border fade-in`;
    
    // Set styles based on type
    switch (type) {
        case 'success':
            notification.classList.add('bg-green-500/20', 'border-green-500/30', 'text-green-300');
            break;
        case 'warning':
            notification.classList.add('bg-yellow-500/20', 'border-yellow-500/30', 'text-yellow-300');
            break;
        case 'error':
            notification.classList.add('bg-red-500/20', 'border-red-500/30', 'text-red-300');
            break;
        default:
            notification.classList.add('bg-blue-500/20', 'border-blue-500/30', 'text-blue-300');
    }
    
    notification.innerHTML = `
        <div class="flex items-center">
            <span>${message}</span>
            <button class="ml-3 text-white/60 hover:text-white" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
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
