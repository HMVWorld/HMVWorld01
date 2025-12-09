// ==============================
// HMV WORLD MAIN SCRIPT
// ==============================
document.addEventListener("DOMContentLoaded", function() {

  // ==============================
  // 1. PRODUCT AUTO-FILL LOGIC
  // ==============================
  const productSelect = document.getElementById('product-req');
  const productTypeInput = document.getElementById('product-type');
  const hsCodeInput = document.getElementById('hs-code-input');
  const dgftDescriptionInput = document.getElementById('dgft-description');

  // Product Data Map
  const productDataMap = {
    'Coriander Powder': {
      type: 'Ground Spice (Coriandrum sativum)',
      hscode: '0909 22 90',
      description: 'Coriander seeds — crushed or ground'
    },
    'Cumin Powder': {
      type: 'Ground Spice (Cuminum cyminum)',
      hscode: '0909 32 90',
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
      hscode: '0910 11 10',
      description: 'Ginger — crushed or ground'
    },
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
    'Other': {
      type: 'As specified by client',
      hscode: 'To be determined',
      description: 'Refer to client requirement details for classification'
    }
  };

  // Auto-fill listener
  productSelect.addEventListener('change', () => {
    const selectedProduct = productSelect.value;
    const data = productDataMap[selectedProduct] || { type: '', hscode: '', description: '' };
    productTypeInput.value = data.type;
    hsCodeInput.value = data.hscode;
    dgftDescriptionInput.value = data.description;
  });


  // ==============================
  // 2. TERMS MODAL
  // ==============================
  const modal = document.getElementById('terms-modal');
  const openBtn = document.getElementById('open-terms');
  const closeBtn = document.getElementById('close-terms');

  openBtn.onclick = () => modal.style.display = "block";
  closeBtn.onclick = () => modal.style.display = "none";
  window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
  };
// ==============================
  // 3. CUSTOM MOUSE CURSOR
  // ==============================
  const cursorOuter = document.querySelector(".cursor-outer");
  const cursorInner = document.querySelector(".cursor-inner");

  // SAFETY CHECK: Only run if cursor elements exist in HTML
  if (cursorOuter && cursorInner) {
    let mouseX = 0;
    let mouseY = 0;
    let isMoving = false;

    // Track mouse position
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Make visible immediately on first move
      if (!isMoving) {
        cursorOuter.style.visibility = "visible";
        cursorInner.style.visibility = "visible";
        isMoving = true;
      }
    });

    // Use requestAnimationFrame for smooth animation without lag
    function animateCursor() {
      // Outer ring (centered)
      cursorOuter.style.transform = `translate(${mouseX - 15}px, ${mouseY - 15}px)`;
      // Inner dot (centered)
      cursorInner.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
      
      requestAnimationFrame(animateCursor);
    }
    
    // Start animation loop
    requestAnimationFrame(animateCursor);

    // Hover effects
    const links = document.querySelectorAll("a, button, .cursor-pointer, input, select, textarea");
    links.forEach(link => {
      link.addEventListener("mouseenter", () => {
        cursorOuter.classList.add("cursor-hover");
        cursorInner.classList.add("cursor-hover");
      });
      link.addEventListener("mouseleave", () => {
        cursorOuter.classList.remove("cursor-hover");
        cursorInner.classList.remove("cursor-hover");
      });
    });
  }

  // ==============================
  // 3. QUOTATION FORM SUBMISSION
  // ==============================
  const quotationForm = document.getElementById('quotation-form');
  const popupMessage = document.getElementById('popup-message');
  const closePopup = document.getElementById('close-popup');

  quotationForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    if (!document.getElementById('terms').checked) {
      alert("Please agree to the Terms and Conditions to send a quotation.");
      return;
    }

    const formData = new FormData(quotationForm);
    const data = Object.fromEntries(formData.entries());

    const submitButton = quotationForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    try {
      // Replace YOUR IDs with actual EmailJS IDs
      const response = await emailjs.send(
        'HMVWORLD_service',
        'Contactus',
        {
          to_email: 'HMVworld@outlook.com',
          from_name: `${data.first_name} ${data.last_name}`,
          subject: `Quotation Request: ${data.product_req}`,
          company_name: data.company_name || 'N/A',
          contact: `${data.country_code} ${data.contact_number}`,
          email: data.email,
          website:data.website,
          product: data.product_req,
          product_type: data.product_type || 'N/A',
          requirements: data.exact_req || 'N/A',
          hs_code: data.hs_code || 'N/A',
          dgft_description: data.dgft_description || 'N/A',
          submission_date: new Date().toLocaleDateString(),
          submission_time: new Date().toLocaleTimeString()
        }
      );

      if (response.status === 200) {
        quotationForm.reset();
        popupMessage.style.display = "flex";
      } else {
        alert('Failed to send quotation. Please try again.');
      }

    } catch (error) {
      console.error('EmailJS Error:', error);
      alert('There was an issue sending your request. Please try again later.');
    } finally {
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
    }
  });

  // Close popup
  closePopup.addEventListener('click', () => {
    popupMessage.style.display = "none";
  });

});






