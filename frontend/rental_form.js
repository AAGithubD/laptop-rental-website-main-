$(document).ready(function () {
    $("#rent-form").submit(function (e) {
        e.preventDefault(); // Prevent the form from submitting traditionally

        // Assume username is stored in a variable or retrieved from local storage/session storage
        const username = "example_user"; // Replace this with the actual username
        const laptopName = $("#laptop_name").val();
        const days = $("#days").val();

        // Send data to the backend
        $.ajax({
            url: "http://127.0.0.1:5000/api/rent", // Flask API endpoint
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                username: username,
                laptop_name: laptopName,
                days: parseInt(days, 10) // Ensure 'days' is an integer
            }),
            success: function (response) {
                // Display success message
                $("#success-message").text(response.message).fadeIn();

                // Hide the message after 3 seconds
                setTimeout(function () {
                    $("#success-message").fadeOut();
                }, 3000);

                $("#error-message").text(""); // Clear any error messages
            },
            error: function (xhr) {
                // Display error message
                const errorMessage = xhr.responseJSON ? xhr.responseJSON.message : "An error occurred.";
                $("#error-message").text(errorMessage).fadeIn();

                // Hide the message after 3 seconds
                setTimeout(function () {
                    $("#error-message").fadeOut();
                }, 3000);

                $("#success-message").text(""); // Clear any success messages
            }
        });
    });
});
