document.addEventListener("DOMContentLoaded", function() {

    // --- HS Code Demo Functionality ---
    const hsCodeSelect = document.getElementById('hs-code');
    const hsNameInput = document.getElementById('hs-name');

    // Demo data for HS Codes
   // HS Code mapping data - Comprehensive list for all HMV World products
    // ============================================
    // 2. PRODUCT DETAILS AUTO-FILL LOGIC
    // ============================================
    const productSelect = document.getElementById('product-req');
    const productTypeInput = document.getElementById('product-type'); // New
    const hsCodeInput = document.getElementById('hs-code-input'); // Renamed from hs-name
    const dgftDescriptionInput = document.getElementById('dgft-description'); // New
    
    // Comprehensive Product Data Map
    const productDataMap = {
        // SPICES
        'Coriander Powder': {
            type: 'Ground Spice (Coriandrum sativum)',
            hscode: '0909 22 90', // Corrected to 22 for crushed/ground
            description: 'Coriander seeds — crushed or ground'
        },
        'Cumin Powder': {
            type: 'Ground Spice (Cuminum cyminum)',
            hscode: '0909 32 90', // Corrected to 32 for crushed/ground
            description: 'Cumin seeds — crushed or ground'
        },
        'Coriander and Cumin Powder (Mix)': {
            type: 'Mixed Ground Spices',
            hscode: '0910 91 90',
            description: 'Mixtures of spices (other than curry powder)'
        },
        'Turmeric Powder': {
            type: 'Ground Spice (Curcuma longa)',
            hscode: '0910 30 30',
            description: 'Turmeric (curcuma) — crushed or ground'
        },
        'Onion Powder': {
            type: 'Dehydrated Vegetable Powder',
            hscode: '0712 20 00',
            description: 'Dried onions (whole, cut, sliced, broken, or powdered)'
        },
        'Garlic Powder': {
            type: 'Dehydrated Vegetable Powder',
            hscode: '0712 90 20',
            description: 'Dried garlic (whole, cut, sliced, or powdered)'
        },
        'Ginger Powder': {
            type: 'Ground Spice (Zingiber officinale)',
            hscode: '0910 11 10', // Assuming 'crushed or ground' for powder
            description: 'Ginger — crushed or ground'
        },

        // AROMATICS & JEWELLERY (Using previous codes as placeholders)
        'Incense Sticks': {
            type: 'Odoriferous Preparation',
            hscode: '3307 41 00',
            description: 'Agarbatti and other odoriferous preparations for perfuming rooms'
        },
        'Dhoop': {
            type: 'Odoriferous Preparation',
            hscode: '3307 41 00',
            description: 'Dhoop and other odoriferous preparations for perfuming rooms'
        },
        'Imitation Jewellery': {
            type: 'Fashion Accessories (Base Metal)',
            hscode: '7117 19 90',
            description: 'Imitation Jewellery, of base metal, plated or unplated'
        },
        
        // DEFAULT FOR UNSELECTED/OTHER
        'Other': {
            type: 'As specified by client',
            hscode: 'To be determined',
            description: 'Refer to client requirement details for classification'
        }
    };

    // Event listener for Product Name selection
    productSelect.addEventListener('change', () => {
        const selectedProduct = productSelect.value;
        const data = productDataMap[selectedProduct] || { type: '', hscode: '', description: '' };

        productTypeInput.value = data.type;
        hsCodeInput.value = data.hscode;
        dgftDescriptionInput.value = data.description;
    });

    hsCodeSelect.addEventListener('change', function() {
        const selectedCode = this.value;
        if (hsCodeData[selectedCode]) {
            hsNameInput.value = hsCodeData[selectedCode];
        } else {
            hsNameInput.value = "";
        }
    });

    // --- Terms & Conditions Modal ---
    const modal = document.getElementById('terms-modal');
    const openBtn = document.getElementById('open-terms');
    const closeBtn = document.getElementById('close-terms');

    openBtn.onclick = function() {
        modal.style.display = "block";
    }
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }
    // Close modal if user clicks outside of the content
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // --- Quotation Form Submission (mailto:) ---
    const quotationForm = document.getElementById('quotation-form');

    quotationForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Stop the form from submitting normally
        
        // Check if terms are agreed
        if (!document.getElementById('terms').checked) {
            alert("Please agree to the Terms and Conditions to send a quotation.");
            return;
        }

        // Get form data
        const formData = new FormData(quotationForm);
        const data = Object.fromEntries(formData.entries());

        // Show loading message
        const submitButton = quotationForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        try {
            // Prepare email parameters
            const emailParams = {
                to_email: 'HMVworld@outlook.com',
                from_name: `${data.first_name} ${data.last_name}`,
                subject: `Quotation Request: ${data.product_req} - ${data.company_name || (data.first_name + ' ' + data.last_name)}`,
                company_name: data.company_name || 'N/A',
                website: data.website || 'N/A',
                contact: `${data.country_code} ${data.contact_number}`,
                email: data.email,
                product: data.product_req,
                product_type: data.product_type || 'N/A',
                requirements: data.exact_req || 'N/A',
                hs_code: data.hs_code_input || 'N/A',
                dgft_description: data.dgft_description || 'N/A',
                submission_date: new Date().toLocaleDateString(),
                submission_time: new Date().toLocaleTimeString()
            };

            // Send email using EmailJS
            const response = await emailjs.send(
                'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
                'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
                emailParams
            );

            if (response.status === 200) {
                // Show success message
                alert('Quotation request sent successfully! We will get back to you soon.');
                
                // Clear the form
                quotationForm.reset();
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            console.error('EmailJS Error:', error);
            
            // Fallback to mailto
            try {
                const subject = `Quotation Request: ${data.product_req} - ${data.company_name || (data.first_name + ' ' + data.last_name)}`;
                const body = `
NEW QUOTATION REQUEST
===========================================

CONTACT INFORMATION
-------------------------------------------
Full Name: ${data.first_name} ${data.last_name}
Company: ${data.company_name || 'N/A'}
Website: ${data.website || 'N/A'}
Contact: ${data.country_code} ${data.contact_number}
Email: ${data.email}

PRODUCT DETAILS
-------------------------------------------
Product: ${data.product_req}
Type: ${data.product_type || 'N/A'}
Specific Requirements: ${data.exact_req || 'N/A'}

EXPORT INFORMATION
-------------------------------------------
HS Code: ${data.hs_code_input || 'N/A'}
DGFT Description: ${data.dgft_description || 'N/A'}

===========================================
Request submitted via HMV World Website
Terms & Conditions: Accepted
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}
                `;

                const mailtoLink = `mailto:HMVworld@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                const emailLink = document.createElement('a');
                emailLink.href = mailtoLink;
                emailLink.style.display = 'none';
                document.body.appendChild(emailLink);
                emailLink.click();
                document.body.removeChild(emailLink);
                
                alert('Opening your email client...\n\nIf your email client doesn\'t open automatically:\n1. Please check if Outlook is set as your default email client\n2. Try copying the form details and sending them manually to HMVworld@outlook.com');
            } catch (mailtoError) {
                alert('Unable to send email. Please contact HMVworld@outlook.com directly.');
                console.error('Mailto fallback error:', mailtoError);
            }
        } finally {
            // Reset button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    });

});