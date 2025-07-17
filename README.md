# Payslip Generator

A free and easy-to-use application for generating employee payslips. This tool allows you to input employee details, salary information, and automatically generates a formatted payslip for download or printing.

## Features

- Input employee and salary details
- Automatic calculation of gross and net salary
- Download or print payslips in a professional format
- User-friendly interface

## Installation

1. Clone or download this repository.
2. Install dependencies (if applicable):
   ```
   npm install
   ```
3. Start the application:
   ```
   npm start
   ```
   or open the HTML file directly in your browser if it's a static project.

## Usage

1. Enter the required employee and salary details in the form.
2. Click "Generate Payslip".
3. Download or print the generated payslip.

## Technologies Used

- HTML, CSS, JavaScript
- jsPDF library for PDF generation
- html2canvas library for rendering HTML to canvas

## License

This project is free to use for personal and commercial purposes.

---

*Developed by Sakshi Bhoirkar*
Total Deductions (sum of all deductions)
Net Payable (Gross Earnings - Total Deductions)
Generate PDF

Click the "Generate Payslip" button to create a PDF of the payslip. The PDF will include all the information entered in the form.
Notes
All calculations are updated in real time when input values are changed.
Amounts in the "Net Payable" section are displayed in both numeric and word formats.
Customization
Modify Styles
To customize the appearance of the tool, edit the styles/styles.css file.

Extend Functionality
To add additional features, modify the js/script.js file. For example, you can add new input fields or enhance the PDF generation logic.

Libraries Used
jsPDF: For creating PDF documents.
html2canvas: For converting HTML elements to canvas images.
Browser Compatibility
This project is compatible with modern web browsers such as Chrome, Firefox, Edge, and Safari.

Known Issues
Long content may overflow in the PDF. Ensure that the input data is concise.
The tool does not support responsive design for mobile screens.
Contributing
Feel free to fork the repository and submit pull requests for new features or bug fixes.


