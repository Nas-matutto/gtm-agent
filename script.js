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
            
            // Update active state
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
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
}

// Product Analysis functionality
function setupProductAnalysis() {
    const analyzeBtn = document.getElementById('analyze-btn');
    const productForm = document.getElementById('product-form');
    const analysisResults = document.getElementById('analysis-results');
    const backBtn = document.getElementById('back-to-form');
    const generateLeadsBtn = document.getElementById('generate-leads-btn');
    
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', function() {
            const description = document.getElementById('product-description').value;
            
            if (!description.trim()) {
                showNotification('Please enter a product description', 'warning');
                return;
            }
            
            // Show loading state
            showLoadingState(analyzeBtn, 'Analyzing...');
            
            // Simulate API call
            setTimeout(() => {
                hideLoadingState(analyzeBtn, 'Analyze Product');
                showAnalysisResults();
            }, 2000);
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
            const leadsTabBtn = document.querySelector('[data-tab="leads"]');
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            leadsTabBtn.classList.add('active');
            
            showNotification('Generating leads based on your analysis...', 'info');
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
