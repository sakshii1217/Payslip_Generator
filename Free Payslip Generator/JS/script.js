const addRowBtn = document.getElementById('add-row-btn');
const employeeSummary = document.getElementById('employee-summary');
const imageInput = document.getElementById('image');
const previewImage = document.getElementById('previewImage');

// imageInput.addEventListener('change', function(event) {
//   const file = event.target.files[0];
//   if (file) {
//     const reader = new FileReader();

//     reader.onload = function(e) {
//       previewImage.src = e.target.result;
//       previewImage.style.display = 'block';
//     };

//     reader.readAsDataURL(file);
//   } else {
//     previewImage.src = '';
//     previewImage.style.display = 'none';
//   }
// });

function displayImage(event) {
  const file = event.target.files[0]; // Get the selected file
  if (file) {
      const reader = new FileReader(); // Create a FileReader instance
      reader.onload = function(e) {
          document.getElementById('imageDisplay').src = e.target.result; // Set the image source to the file content
      }
      reader.readAsDataURL(file); // Read the image as a data URL
  }
}

// Add a new row to the employee summary 

addRowBtn.addEventListener('click', () => {
    const newRow = document.createElement('div');
    newRow.classList.add('employee-summary'); // Add a class for proper styling

    newRow.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 10px; flex-direction:row; ">
            <input type="text" id="employee-name" placeholder="Name" style="margin-right:5px;">
            <input type="number" id="employee-id" placeholder="Value">
            <button class="remove-btn" style="background:#e8dbdb; border: none; color: red; font-size: 12px; cursor: pointer; margin:10px;">&times;</button>
        </div>    
    `;

    employeeSummary.appendChild(newRow);
    const removeBtn = newRow.querySelector(".remove-btn");
    removeBtn.addEventListener("click", function () {
      newRow.remove();
      updateTotals();
    });
});


// Update the total earnings and deductions

function updateTotals() {
    let grossEarnings = 0;
    let totalDeductions = 0;

    document.querySelectorAll('.earning').forEach(input => {
        grossEarnings += parseFloat(input.value) || 0;
    });

    document.querySelectorAll('.deduction').forEach(input => {
        totalDeductions += parseFloat(input.value) || 0;
    });

    const netPayable = grossEarnings - totalDeductions;
    document.getElementById('gross-earnings-final').textContent = `₹ ${grossEarnings}`;
    document.getElementById('total-deductions-final').textContent = `₹ ${totalDeductions}`;
    document.getElementById('net-payable-display').textContent = `₹ ${netPayable}`;
    document.getElementById('net-payable-words').textContent = `Amount in words: Indian Rupee ${netPayable} Only`;
}



function addRow(type) {
    const table = type === 'earning' ? 'earnings-table' : 'deductions-table';
    const container = document.getElementById(table);

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" placeholder="${type === 'earning' ? 'Earning Name' : 'Deduction Name'}"></td>
        <td><input type="number" class="${type}" value="0" onchange="updateTotals()"></td>
        <td><button class="remove-btn" style="background:#e8dbdb; border: none; color: red; font-size: 18px; cursor: pointer;">&times;</button></td>
    `;

    container.insertBefore(newRow, container.lastElementChild);
    const removeBtn = newRow.querySelector(".remove-btn");
    removeBtn.addEventListener("click", function () {
        newRow.remove();
        updateTotals();
    });
}

// Utility function to convert numbers to words
function numberToWords(num) {
    if (num === 0) return 'Zero';

    const belowTwenty = [
        'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousandUnits = ['', 'Thousand', 'Million', 'Billion'];

    function helper(n) {
        if (n < 20) return belowTwenty[n];
        else if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 === 0 ? '' : ' ' + belowTwenty[n % 10]);
        else
            return (
                belowTwenty[Math.floor(n / 100)] +
                ' Hundred' +
                (n % 100 === 0 ? '' : ' ' + helper(n % 100))
            );
    }

    let word = '';
    let unitIndex = 0;

    while (num > 0) {
        if (num % 1000 !== 0) {
            word = helper(num % 1000) + ' ' + thousandUnits[unitIndex] + ' ' + word;
        }
        num = Math.floor(num / 1000);
        unitIndex++;
    }

    return word.trim();
}

// Form Validation
function validateForm() {
    const requiredFields = document.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    requiredFields.forEach((field) => {
        if (!field.value.trim()) {
            field.style.border = '2px solid red'; // Highlight the invalid field
            isValid = false;
        } else {
            field.style.border = ''; // Remove highlighting if valid
        }
    });

    if (!isValid) {
        alert("Please fill out all required fields.");
    }

    return isValid;
}

// Generate PDF with validation
document.getElementById('generate-pdf-btn').addEventListener('click', () => {
    if (validateForm()) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        const container = document.getElementById('container');

        // Hide all buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => button.style.display = 'none');

        // Remove or hide span elements
        const spans = container.querySelectorAll('span');
        spans.forEach(span => span.style.display = 'none'); // Hides spans (alternative: use span.remove() to remove them)

        // Use html2canvas to capture the full content of the container
        html2canvas(container, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210; // PDF width in mm (A4)
            const pageHeight = 297; // PDF height in mm (A4)
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            // Add the first page
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Add additional pages if necessary
            while (heightLeft > 0) {
                position -= pageHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('Payslip.pdf');

            // Restore all buttons after generating the PDF
            buttons.forEach(button => button.style.display = '');

            // Restore span elements
            spans.forEach(span => span.style.display = ''); // If you used span.remove(), re-add the spans dynamically if needed
        });
    }
});


// Reset form validation styles on reset
function resetForm() {
    const requiredFields = document.querySelectorAll('input[required], textarea[required]');
    requiredFields.forEach((field) => {
        field.value = '';
        field.style.border = ''; // Remove the red border
    });

    // Reset other elements as before
    const numberInputs = document.querySelectorAll("input[type='number']");
    numberInputs.forEach(input => input.value = 0);

    const dateInputs = document.querySelectorAll("input[type='date'], input[type='month']");
    dateInputs.forEach(input => input.value = "");

    const earningsTable = document.getElementById("earnings-table");
    const deductionsTable = document.getElementById("deductions-table");

    Array.from(earningsTable.rows).forEach((row, index) => {
        if (index < earningsTable.rows.length - 1 && index > 1) {
            row.remove();
        }
    });

    Array.from(deductionsTable.rows).forEach((row, index) => {
        if (index < deductionsTable.rows.length - 1 && index > 1) {
            row.remove();
        }
    });

    document.getElementById("gross-earnings-final").textContent = "₹ 0";
    document.getElementById("total-deductions-final").textContent = "₹ 0";
    document.getElementById("net-payable-display").textContent = "₹ 0";
    document.getElementById("net-payable-words").textContent = "Amount in words: Indian Rupee Zero Only";

    document.getElementById("imageDisplay").src = "";
}

// Attach the reset function
document.querySelector(".reset-btn").addEventListener("click", resetForm);

