/**
 * CLEANFOX — BOOKING & ESTIMATOR MODULE
 * Interactive pricing/time estimator, form validation, and confirmation
 */

document.addEventListener('DOMContentLoaded', () => {
  initBookingEstimator();
  initBookingForm();
});

function initBookingEstimator() {
  const serviceSelect = document.getElementById('serviceSelect');
  const propertySelect = document.getElementById('propertySelect');
  const estimateService = document.getElementById('estimateService');
  const estimateProperty = document.getElementById('estimateProperty');
  const estimateDuration = document.getElementById('estimateDuration');
  const estimateTeam = document.getElementById('estimateTeam');

  if (!serviceSelect || !propertySelect) return;

  const durationData = {
    '1bhk': { deep: '3.5 - 4.5 Hours', team: '2 Certified Specialists' },
    '2bhk': { deep: '4.5 - 6.0 Hours', team: '3 Certified Specialists' },
    '3bhk': { deep: '6.0 - 8.0 Hours', team: '4 Certified Specialists' },
    '4bhk': { deep: '7.5 - 9.5 Hours', team: '4 - 5 Certified Specialists' },
    'villa': { deep: '8.0+ Hours / Custom', team: 'Full Specialized Crew' },
    'office': { deep: 'Custom Assessment', team: 'Commercial Team' }
  };

  function updateEstimate() {
    const selectedServiceText = serviceSelect.options[serviceSelect.selectedIndex]?.text || 'Deep Home Cleaning';
    const propKey = propertySelect.value || '2bhk';
    const selectedPropText = propertySelect.options[propertySelect.selectedIndex]?.text || '2 BHK Apartment';

    if (estimateService) estimateService.textContent = selectedServiceText;
    if (estimateProperty) estimateProperty.textContent = selectedPropText;

    const data = durationData[propKey] || durationData['2bhk'];
    if (estimateDuration) estimateDuration.textContent = data.deep;
    if (estimateTeam) estimateTeam.textContent = data.team;
  }

  serviceSelect.addEventListener('change', updateEstimate);
  propertySelect.addEventListener('change', updateEstimate);

  // Set default min date to tomorrow
  const dateInput = document.getElementById('preferredDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  updateEstimate();
}

function initBookingForm() {
  const form = document.getElementById('cleanfoxBookingForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#fullName')?.value.trim();
    const phone = form.querySelector('#phoneNumber')?.value.trim();
    const email = form.querySelector('#emailAddress')?.value.trim();
    const serviceEl = form.querySelector('#serviceSelect');
    const service = serviceEl ? serviceEl.options[serviceEl.selectedIndex]?.text : 'Home Deep Cleaning';
    const propertyEl = form.querySelector('#propertySelect');
    const property = propertyEl ? propertyEl.options[propertyEl.selectedIndex]?.text : '2 BHK Apartment';
    const date = form.querySelector('#preferredDate')?.value;
    const timeEl = form.querySelector('#preferredTime');
    const time = timeEl ? timeEl.options[timeEl.selectedIndex]?.text : 'Morning Slot';
    const address = form.querySelector('#addressArea')?.value.trim();
    const notes = form.querySelector('#additionalNotes')?.value.trim();

    if (!name || !phone) {
      alert('Please fill in your name and phone number so our team can assist you.');
      return;
    }

    // Build structured WhatsApp message
    let msg = `*New Cleaning Enquiry — Cleanfox*\n\n`;
    msg += `👤 *Name:* ${name}\n`;
    msg += `📞 *Phone:* ${phone}\n`;
    if (email) msg += `✉️ *Email:* ${email}\n`;
    msg += `🧹 *Service:* ${service}\n`;
    msg += `🏠 *Property:* ${property}\n`;
    if (date) msg += `📅 *Preferred Date:* ${date}\n`;
    if (time) msg += `⏰ *Preferred Slot:* ${time}\n`;
    if (address) msg += `📍 *Location:* ${address}\n`;
    if (notes) msg += `📝 *Notes/Focus:* ${notes}\n`;
    msg += `\nPlease confirm slot availability and share the best quotation.`;

    const encodedMsg = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/918369437974?text=${encodedMsg}`;

    // Show confirmation toast
    if (window.showToast) {
      window.showToast(`Thank you, ${name}! Redirecting your booking enquiry to Cleanfox WhatsApp...`, 5000);
    }

    // Open WhatsApp in a new tab
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 400);

    // Reset form fields
    form.reset();

    // Re-initialize default estimate
    if (propertyEl) propertyEl.dispatchEvent(new Event('change'));
  });
}
