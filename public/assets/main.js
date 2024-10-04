


// Get all amount buttons and the input field
const amountButtons = document.querySelectorAll('.amount-btn');
const donationInput = document.getElementById('donationAmount');

// Function to handle amount button clicks
amountButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Get the selected amount
        const selectedAmount = this.getAttribute('data-amount');
        
        // Set the input field value to the selected amount
        donationInput.value = selectedAmount;
        
        // Remove 'selected' class from all buttons
        amountButtons.forEach(btn => btn.classList.remove('selected'));
        
        // Add 'selected' class to the clicked button
        this.classList.add('selected');
    });
});

// Optional: Handle input changes to remove the selected state from buttons
donationInput.addEventListener('input', () => {
    amountButtons.forEach(btn => btn.classList.remove('selected'));
});















const divisionSelect = document.getElementById('division-search');
const districtSelect = document.getElementById('district-search');
const upazilaSelect = document.getElementById('upazila-search');

const divisionOpt = document.getElementById('division');
const districtOpt = document.getElementById('district');
const upazilaOpt = document.getElementById('upazila');

const pastDonationRadios = document.querySelectorAll('input[name="past-donation"]');
const lastDonationContainer = document.getElementById('last-donation-container');

const bloodGroupDropdown = document.getElementById('blood-group-search');

const tableBody = document.getElementById('donor-table-body');
const hamburgerMenu = document.querySelector('.hamburger-menu');
const mobileNav = document.querySelector('.mobile-nav');
let divisions = [];
let districts = [];
let upazilas = [];

// Fetch JSON data
async function fetchData(url) {
  try {
    console.log(`Fetching data from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Fetched data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
async function initializeDivisions() {
  const data = await fetchData('/data/division.json');
  if (data && data.divisions) {
    divisions = data.divisions;
    console.log('Divisions loaded:', divisions);

    // Clear existing options
    divisionSelect.innerHTML = '<option value="">Choose Division</option>';
    divisionOpt.innerHTML = '<option value="">Choose Division</option>';

    // Get the division from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const selectedDivision = urlParams.get('division');

    divisions.forEach(division => {
      // Create separate option elements for each dropdown
      const optionForSelect = document.createElement('option');
      optionForSelect.value = division.id;
      optionForSelect.textContent = division.bn_name;
      optionForSelect.setAttribute('data-division', division.name);

      const optionForOpt = document.createElement('option');
      optionForOpt.value = division.id;
      optionForOpt.textContent = division.bn_name;
      optionForOpt.setAttribute('data-division', division.name); 
      // Append to respective dropdowns
      divisionSelect.appendChild(optionForSelect);
      divisionOpt.appendChild(optionForOpt);

      // Check if the division matches and set as selected
      if (division.name === selectedDivision) {
        divisionSelect.value = division.id; // Set the select value
        divisionOpt.value = division.id;     // Set the opt value
      }
    });

    // Optionally, fetch districts based on the selected division
    if (divisionSelect.value) {
      updateDistricts(divisionSelect.value);
    }
  }
}


// Update district options based on selected division
async function updateDistricts() {
  const selectedDivisionId = divisionSelect.value;
  console.log('Selected division ID:', selectedDivisionId);

  // Reset district and upazila options
  districtSelect.innerHTML = '<option value="">Choose District</option>';
  upazilaSelect.innerHTML = '<option value="">Choose City/Upazila</option>';

  if (selectedDivisionId) {
    // Fetch districts based on the selected division ID
    const data = await fetchData(`/data/district.json`);
    if (data && data.districts) {
      districts = data.districts.filter(d => d.division_id === selectedDivisionId);
      console.log('Districts for selected division:', districts);

      // Get the district from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const selectedDistrict = urlParams.get('district');

      districts.forEach(district => {
        // Create option element for each district
        const optionForSelect = document.createElement('option');
        optionForSelect.value = district.id;
        optionForSelect.textContent = district.bn_name;
        optionForSelect.setAttribute('data-district', district.name);

        // Append to district dropdown
        districtSelect.appendChild(optionForSelect);

        // Check if the district matches and set as selected
        if (district.name === selectedDistrict) {
          districtSelect.value = district.id; // Set the select value
        }
      });

      // Optionally, fetch upazilas based on the selected district
      if (districtSelect.value) {
        updateUpazilas();
      }
    }
  }
}


// Update upazila options based on selected district
async function updateUpazilas() {
  const selectedDistrictId = districtSelect.value;
  console.log('Selected district ID:', selectedDistrictId);

  // Reset upazila options
  upazilaSelect.innerHTML = '<option value="">Choose City/Upazila</option>';

  if (selectedDistrictId) {
    // Fetch upazilas based on the selected district ID
    const data = await fetchData(`/data/upazila.json`);
    if (data && data.upazilas) {
      upazilas = data.upazilas.filter(u => u.district_id === selectedDistrictId);
      console.log('Upazilas for selected district:', upazilas);

      // Get the upazila from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const selectedUpazila = urlParams.get('upazila');

      upazilas.forEach(upazila => {
        // Create option element for each upazila
        const optionForSelect = document.createElement('option');
        optionForSelect.value = upazila.id;
        optionForSelect.textContent = upazila.bn_name;
        optionForSelect.setAttribute('data-upazila', upazila.name);
        // Append to upazila dropdown
        upazilaSelect.appendChild(optionForSelect);

        // Check if the upazila matches and set as selected
        if (upazila.name === selectedUpazila) {
          upazilaSelect.value = upazila.id; // Set the select value
        }
      });
    }
  }
}





// Update district options based on selected division
async function updateDistrictsOpt() {
const selectedDivisionIdOpt = divisionOpt.value;
console.log('Selected division ID:', selectedDivisionIdOpt);


// Clear existing options in modal dropdown
districtOpt.innerHTML = '<option value="">Choice District</option>';
upazilaOpt.innerHTML = '<option value="">Choice City/Upazila</option>';

if (selectedDivisionIdOpt) {
  // Fetch districts based on the selected division ID
  const data = await fetchData(`/data/district.json`);
  if (data && data.districts) {
    districts = data.districts.filter(d => d.division_id === selectedDivisionIdOpt);
    console.log('Districts for selected division:', districts);
    
    districts.forEach(district => {
 
      const optionForOpt = document.createElement('option');
      optionForOpt.value = district.id;
      optionForOpt.textContent = district.bn_name;
      optionForOpt.setAttribute('data-district', district.name);

      districtOpt.appendChild(optionForOpt);
    });
  }
}
}


function updateBloodGroup() {
  const selectedBloodGroup = new URLSearchParams(window.location.search).get('bloodGroup');
  if (selectedBloodGroup) {
    document.getElementById('blood-group-search').value = selectedBloodGroup;
  }
}
updateBloodGroup();




async function updateUpazilasOpt() {
const selectedDistrictIdOpt = districtOpt.value;
console.log('Selected district ID:', selectedDistrictIdOpt);

// Clear existing options in modal dropdown
upazilaOpt.innerHTML = '<option value="">Choice City/Upazila</option>';

if (selectedDistrictIdOpt) {
  // Fetch upazilas based on the selected district ID
  const data = await fetchData(`/data/upazila.json`);
  if (data && data.upazilas) {
    upazilas = data.upazilas.filter(u => u.district_id === selectedDistrictIdOpt);
    console.log('Upazilas for selected district:', upazilas);
    
    upazilas.forEach(upazila => {
      const optionForOpt = document.createElement('option');
      optionForOpt.value = upazila.id;
      optionForOpt.textContent = upazila.bn_name;
      optionForOpt.setAttribute('data-upazila', upazila.name);
      upazilaOpt.appendChild(optionForOpt);
    });
  }
}
}




// Handle past donation radio change
function handlePastDonationChange(event) {
console.log('Past donation radio changed:', event.target.value);
if (event.target.value === 'Yes') {
  lastDonationContainer.classList.remove('hidden');
  lastDonationContainer.classList.add('show');
} else {
  lastDonationContainer.classList.remove('show');
  lastDonationContainer.classList.add('hidden');
}
}

pastDonationRadios.forEach(radio => {
radio.addEventListener('change', handlePastDonationChange);
});



document.getElementById('donor-form').addEventListener('submit', function(event) {
event.preventDefault(); // Prevent the default form submission


// Create FormData object
const formData = new FormData(this);
let data = Object.fromEntries(formData.entries());

// Get text values of division, district, and upazila
data['division'] = document.getElementById('division').options[document.getElementById('division').selectedIndex].text;
data['district'] = document.getElementById('district').options[document.getElementById('district').selectedIndex].text;
data['upazila'] = document.getElementById('upazila').options[document.getElementById('upazila').selectedIndex].text;


// Get option values directly for _en fields
data['division_id'] = document.getElementById('division').value;
data['district_id'] = document.getElementById('district').value;
data['upazila_id'] = document.getElementById('upazila').value;

// Get data-* attribute values for ids
data['division_en'] = document.getElementById('division').options[document.getElementById('division').selectedIndex].getAttribute('data-division');
data['district_en'] = document.getElementById('district').options[document.getElementById('district').selectedIndex].getAttribute('data-district');
data['upazila_en'] = document.getElementById('upazila').options[document.getElementById('upazila').selectedIndex].getAttribute('data-upazila');



if (data['past-donation'] === 'Yes' && data['last-donation']) {
  const lastDonationDate = new Date(data['last-donation']);
  data['last-donation'] = lastDonationDate.toISOString();
  
  data['donated'] = data['donated'] || ''; // Default to empty string if not provided

  document.getElementById('last-donation').required = true;
  document.getElementById('donated').required = true;

} else {
  data['last-donation'] = '';
  data['donated'] = '';
  
  document.getElementById('last-donation').required = false;
  document.getElementById('donated').required = false;
}

const overlay = this.querySelector('.loading-overlay');
const jsonData = JSON.stringify(data);

console.log('Submitting form data:', data);

overlay.style.display = 'flex';

fetch('/save-donor', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: jsonData
})
.then(response => response.json())
.then(result => {
  console.log('Form submission successful:', result);
  setTimeout(() => {
    overlay.style.display = 'none';
    window.location.href = "/";
  }, 2000); 
})
.catch(error => {
  console.error('Error submitting form:', error);
});
});

// Update table based on filters
function updateTable() {
// Get the real value (the value attribute) from the select elements
const selectedDivision = divisionSelect.options[divisionSelect.selectedIndex].getAttribute('data-division');
const selectedDistrict = districtSelect.options[districtSelect.selectedIndex].getAttribute('data-district');
const selectedUpazila = upazilaSelect.options[upazilaSelect.selectedIndex].getAttribute('data-upazila');
const selectedBloodGroup = bloodGroupDropdown.value;

console.log(selectedBloodGroup, selectedDivision);


  let queryParams = '';

  console.log('Selected Division:', selectedDivision);
  console.log('Selected District:', selectedDistrict);
  console.log('Selected Upazila:', selectedUpazila);
  console.log('Selected Blood Group:', selectedBloodGroup);

  // Build query parameters based on the user selections
  if (selectedBloodGroup && selectedDivision && selectedDistrict && selectedUpazila) {
    queryParams = `bloodGroup=${encodeURIComponent(selectedBloodGroup)}&division=${encodeURIComponent(selectedDivision)}&district=${encodeURIComponent(selectedDistrict)}&upazila=${encodeURIComponent(selectedUpazila)}`;
  } else if (selectedDivision && selectedDistrict && selectedUpazila) {
    queryParams = `division=${encodeURIComponent(selectedDivision)}&district=${encodeURIComponent(selectedDistrict)}&upazila=${encodeURIComponent(selectedUpazila)}`;
  } else if (selectedDivision && selectedDistrict && selectedBloodGroup) {
    queryParams = `bloodGroup=${encodeURIComponent(selectedBloodGroup)}&division=${encodeURIComponent(selectedDivision)}&district=${encodeURIComponent(selectedDistrict)}`;
  } else if (selectedDivision && selectedDistrict) {
    queryParams = `division=${encodeURIComponent(selectedDivision)}&district=${encodeURIComponent(selectedDistrict)}`;
  } else if (selectedDivision && selectedBloodGroup) {
    queryParams = `bloodGroup=${encodeURIComponent(selectedBloodGroup)}&division=${encodeURIComponent(selectedDivision)}`;
  } else if (selectedBloodGroup) {
    queryParams = `bloodGroup=${encodeURIComponent(selectedBloodGroup)}`;
  } else if (selectedDivision) {
    queryParams = `division=${encodeURIComponent(selectedDivision)}`;
  } else {
    // If no selections are made, fetch all data
    queryParams = 'fetchAll=true';
  }

  console.log('Query Parameters:', queryParams);


  
  let newUrl;

if (queryParams !== 'fetchAll=true') {
  newUrl = `${window.location.pathname}?${queryParams}`; 
} else {
  newUrl = `${window.location.pathname}`;  
}
 history.replaceState(null, '', newUrl);

  const overlay = document.querySelector('.loading-overlay');
  overlay.style.display = 'flex';

  console.log('Im0running')
  // Fetch the filtered data
  fetch(`/search-blood?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log('Data fetched for table:', data);
    setTimeout(() => {
      overlay.style.display = 'none';
      tableBody.innerHTML = '';  // Clear the table

      if (data.length === 0) {
        // Create a new row with a "No data found" message
        const row = document.createElement('tr');
        row.innerHTML = `
          <td colspan="8" style="text-align: center; font-size: 20px; padding:40px; margin-top:20px" ><img src="/images/logo.png" alt="Logo" style="width: 100px; height: auto;"><h3>কোন ডোনার পাওয়া যায়নি।</h3>
<h4>ডোনার রেজিস্ট্রেশন চলমান, আমাদের সাথেই থাকুন।</h4></td>
        `;
        tableBody.appendChild(row);
      } else {
        // Populate the table with data
        data.forEach(donor => {

          function calculateTimeDifference(lastDonationDate) {
            const today = new Date();
            const donationDate = new Date(lastDonationDate);
          
            // Calculate the difference in years, months, and days
            let monthsDiff = today.getMonth() - donationDate.getMonth() + (12 * (today.getFullYear() - donationDate.getFullYear()));
            let daysDiff = today.getDate() - donationDate.getDate();
          
            // Adjust for negative days difference
            if (daysDiff < 0) {
              monthsDiff--;
              const daysInMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
              daysDiff += daysInMonth; // Adjust days for the previous month
            }
          
            return monthsDiff > 0 ? `${monthsDiff} মাস ${daysDiff} দিন আগে` : `${daysDiff} দিন আগে`;
          }

          // Format the registration date
          const registrationDate = new Date(donor.registration);
          const formattedRegistrationDate = registrationDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

          const row = document.createElement('tr');
          row.innerHTML = `
          <td>${donor['blood-group']}</td>
          <td>${donor.upazila}, ${donor.district}</td>
          <td>
            <a href="tel:${donor.phone}" class="view-number" style="display: flex; justify-content: space-between; align-items: center;">
              <span class="hidden-number">${donor.phone.slice(0, -1) + '***'}</span>
              <span class="real-number">${donor.phone}</span>
              <button class="phn-call" style="border-radius: 15px; padding: 5px 7px; font-size: 0.75rem; background-color: #3978ff; color: white; border: none; display: inline-flex; cursor: pointer; align-items: center; justify-content: center;">
                <i class="fa-solid fa-phone"></i> &nbsp;&nbsp;&nbsp;<span>Call</span>
              </button>
            </a>
          </td>
          <td>${donor.name}</td>
          <td>${donor.age}</td>
          <td>${donor['last-donation'] ? calculateTimeDifference(donor['last-donation']) : 'Never Donated'}</td>
          <td>${formattedRegistrationDate}</td>
        `;
        
          tableBody.appendChild(row);
        });
      }
    }, 100);
  })
  .catch(error => {
    console.error('Error fetching table data:', error);
  });
}

// Initial load
initializeDivisions();

// Add event listeners to update table when selections change
divisionSelect.addEventListener('change', () => {
  console.log('Division dropdown changed');
  updateDistricts();
  updateTable();
});
districtSelect.addEventListener('change', () => {
  console.log('District dropdown changed');
  updateUpazilas();
  updateTable();
});
upazilaSelect.addEventListener('change', () => {
  console.log('Upazila dropdown changed');
  updateTable();
});
bloodGroupDropdown.addEventListener('change', () => {
  console.log('Blood group dropdown changed');
  updateTable();
});


divisionOpt.addEventListener('change', () => {
  console.log('Division dropdown changed');
  updateDistrictsOpt();
});
districtOpt.addEventListener('change', () => {
  console.log('District dropdown changed');
  updateUpazilasOpt();
});
upazilaOpt.addEventListener('change', () => {
  console.log('Upazila dropdown changed');
});


// Toggle mobile navigation menu
hamburgerMenu.addEventListener('click', () => {
  console.log('Hamburger menu clicked');
  mobileNav.classList.toggle('show');
});

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    console.log("Calling updateTable after 3 seconds");
    updateTable();
  }, 1000);
  
});







document.addEventListener('DOMContentLoaded', function() {
  // Select the parent element that will contain the .view-number links
  const container = document.getElementById('donor-table-body'); // Replace with the actual container ID

  // Function to handle the click event
  function handleClick(link) {
      // Show the real number and hide the hidden number for the clicked link
      const realNumber = link.querySelector('.real-number');
      const hiddenNumber = link.querySelector('.hidden-number');

      if (realNumber && hiddenNumber) {
          realNumber.style.display = 'block';
          hiddenNumber.style.display = 'none';
      }

      // Hide real numbers and show hidden numbers for all other links
      const phoneLinks = container.querySelectorAll('.view-number');
      phoneLinks.forEach(otherLink => {
          if (otherLink !== link) {
              const otherRealNumber = otherLink.querySelector('.real-number');
              const otherHiddenNumber = otherLink.querySelector('.hidden-number');

              if (otherRealNumber && otherHiddenNumber) {
                  otherRealNumber.style.display = 'none';
                  otherHiddenNumber.style.display = 'block';
              }
          }
      });

      // Detect if the user is on a mobile device
      const isMobile = /Mobi|Android/i.test(navigator.userAgent) || /iPad|iPhone|iPod/.test(navigator.userAgent);

      if (isMobile) {
          const telLink = link.getAttribute('href');
          setTimeout(() => {
              window.location.href = telLink;
          }, 100);
      }

      // AJAX call to update the last-clicked and attempts_count using pure JavaScript
      const phoneNumber = realNumber.innerText; // Assuming the real number contains the phone number
      updateDonorAttempt(phoneNumber);
  }

  // Function to perform the AJAX call
  function updateDonorAttempt(phoneNumber) {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/update-donor-attempt', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
              if (xhr.status === 200) {
                  console.log('Donor data updated:', xhr.responseText);
              } else {
                  console.error('Error updating donor:', xhr.responseText);
              }
          }
      };

      const data = `phoneNumber=${encodeURIComponent(phoneNumber)}`;
      xhr.send(data);
  }

  // Event delegation: listen for clicks on the container
  container.addEventListener('click', function(event) {
      if (event.target.closest('.view-number')) {
          event.preventDefault();
          handleClick(event.target.closest('.view-number'));
      }
  });

  // Initialize the display state for dynamically added content
  function initializeDisplay() {
      const phoneLinks = container.querySelectorAll('.view-number');
      if (phoneLinks.length > 0) {
          const firstLink = phoneLinks[0];
          const firstRealNumber = firstLink.querySelector('.real-number');
          const firstHiddenNumber = firstLink.querySelector('.hidden-number');

          if (firstRealNumber && firstHiddenNumber) {
              firstRealNumber.style.display = 'block';
              firstHiddenNumber.style.display = 'none';
          }
      }
  }

  // Call initializeDisplay when the content is dynamically added
  initializeDisplay();
});
