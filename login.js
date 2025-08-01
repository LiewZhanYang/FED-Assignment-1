// script.js

document.getElementById("myForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Create an object to represent the form data
  var formData = {
    fullName: document.getElementById("full-name").value,
    email: document.getElementById("email").value,
    birthDate: document.getElementById("birth-date").value,
    // Add other form fields as needed
  };

  // Convert the form data object to JSON
  var formDataJSON = JSON.stringify(formData);

  // Log the JSON data (you can send it to the server or perform other actions)
  console.log(formDataJSON);

  // Your custom logic goes here
  // For example, show an alert
  alert("Submit button clicked!");
  alert("Form Data:\n" + formDataJSON);
});
