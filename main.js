jQuery(document).ready(function ($) {
    // Get the popup element
    var popup = $("#popup");
    var openPopupBtn = $("#openPopupBtn");
    var closeBtn = $(".close-btn");

    $(".registrationquoteForm_success").hide();

    openPopupBtn.on("click", function (event) {
        // Prevent the form from submitting
        event.preventDefault();
        // Check if the registration input is not empty
        var registrationValue = $('input[name="registration"]').val();
        if (registrationValue) {
            $('input[name="car_registration"]').val(registrationValue);
            // Trigger the keyup event to auto-execute the existing logic
            $('input[name="car_registration"]').trigger('keyup');
            popup.addClass("show"); // Show the popup
            $('body,html').css('overflow', 'hidden');
            $(".registrationquoteForm_success").hide();
        } else {
            $(".registrationquoteForm_success").show();
            $('body,html').css('overflow', 'auto');
        }
    });

    closeBtn.on("click", function () {
        popup.removeClass("show");
        $('body,html').css('overflow', 'auto');
    });

    $(window).on("click", function (event) {
        if ($(event.target).is(popup)) {
            popup.removeClass("show");
            $('body,html').css('overflow', 'auto');
        }
    });

    document.getElementById('quoteForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting
    });

    ////////////////////////
    // Bind submit event to the Fluent Form
    ////////////////////////

    // Hide the result and loading spinner initially
    $('.car_registration_result').hide();
    $('.car_registration .ff-el-input--content').removeClass('loading'); // Ensure spinner is hidden at start

    let typingTimer;
    const doneTypingInterval = 1000;

    $('input[name="car_registration"]').on('keyup', function () {
        clearTimeout(typingTimer);
        const carRegistration = $(this).val();
        const inputContent = $('.car_registration .ff-el-input--content');
        const carInput = $(this); // Store a reference to the input field

        // Change border color if input is not empty
        if (carRegistration.length > 0) {
            carInput.css('border-color', '#0050ec'); // Change border color to blue
            $('.car_registration_result').hide(); // Hide the result
            $('#no_car_message').remove(); // Remove previous error message
            inputContent.addClass('loading'); // Show loading spinner
        } else {
            carInput.css('border-color', ''); // Reset border color
            $('.car_registration_result').hide(); // Hide result if input is empty
            inputContent.removeClass('loading'); // Hide spinner
        }

        if (carRegistration.length > 0) {
            typingTimer = setTimeout(function () {
                $.ajax({
                    url: ajax_object.ajaxurl, // Ensure ajax_object is localized
                    method: 'POST',
                    data: {
                        action: 'get_vehicle_data',
                        registrationNumber: carRegistration
                    },
                    success: function (response) {
                        inputContent.removeClass('loading'); // Hide spinner

                        if (response.success && response.data) {
                            const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

                            // Check if all fields exist before displaying them
                            if (data.make && data.engineCapacity && data.yearOfManufacture) {
                                $('.car_registration_result').show(); // Show result
                                $('.step-nav.ff_step_nav_last').show();
                                $('#registration_result_title').html(`
                                       <span data-make="car-name">${data.make}</span>
                                       <span data-cc="engine-capacity">, ${data.engineCapacity}cc</span>
                                       <span data-model="year-manufacture">, ${data.yearOfManufacture}</span>
                                   `);
                                // Set the hidden input fields
                                var makeeng = data.make + ', ' + data.engineCapacity + 'cc, ' + data.yearOfManufacture;
                                $('input[name="car_name"]').val(makeeng);
                                // $('input[name="engine_capacity"]').val(data.engineCapacity);
                                // $('input[name="year_manufacture"]').val(data.yearOfManufacture);

                            } else {
                                // If any data is missing, hide result and show error message
                                $('.car_registration_result').hide();
                                $('<p id="no_car_message">Sorry we couldn\'t find your car.</p>')
                                    .insertAfter('.car_registration .ff-el-input--content'); // Insert error message
                                carInput.css('border-color', '#fe4a49'); // Change border color to red
                                $('.step-nav.ff_step_nav_last').hide();
                            }
                        } else {
                            // If no vehicle data found or response indicates failure, show error message
                            $('.car_registration_result').hide(); // Hide result if not found
                            $('#registration_result_title').html(''); // Clear previous content
                            carInput.css('border-color', '#fe4a49'); // Change border color to red
                            $('<p id="no_car_message">Sorry we couldn\'t find your car.</p>')
                                .insertAfter('.car_registration .ff-el-input--content'); // Insert error message
                            $('.step-nav.ff_step_nav_last').hide();
                        }
                    },
                    error: function (xhr) {
                        inputContent.removeClass('loading'); // Hide spinner on error
                        console.log('Error: ' + xhr.responseText);
                        carInput.css('border-color', '#fe4a49'); // Change border color to red
                        $('<p id="no_car_message">Sorry we couldn\'t find your car.</p>')
                            .insertAfter('.car_registration .ff-el-input--content'); // Insert error message on request failure
                        $('.step-nav.ff_step_nav_last').hide();
                    }
                });
            }, doneTypingInterval);
        }
    });

    $('#fluentform_3').on('submit', function (e) {
        e.preventDefault(); // Prevent default form submission

        // Assuming the form submission is done via AJAX
        $.ajax({
            url: $(this).attr('action'), // Use form's action attribute
            method: $(this).attr('method'), // Use form's method attribute
            data: $(this).serialize(), // Serialize form data
            success: function (response) {

                $('#fluentform_3').hide();
                setTimeout(function () {
                    $("#popup").removeClass("show");
                }, 3000);
            },
            error: function () {

            }
        });
    });

});

////////////////////////
// postcode Fluent Form
////////////////////////
document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.querySelector(".postcode-input"); // Select the input field by class
    const suggestionsList = document.createElement('ul'); // Create the suggestions list
    suggestionsList.setAttribute("id", "postcode-suggestions"); // Set the id for the <ul>

    // Insert the <ul> element after the input field
    inputField.insertAdjacentElement("afterend", suggestionsList); 

    // Add event listener for postcode input
    inputField.addEventListener("input", function () {
        const query = inputField.value.trim();

        if (query.length >= 1) { // Start search after 1 character
            fetch(`https://api.postcodes.io/postcodes?q=${query}`)
                .then(response => response.json())
                .then(data => {
                    suggestionsList.innerHTML = ""; // Clear previous suggestions

                    if (data.status === 200 && data.result.length > 0) {
                        data.result.forEach(postcode => {
                            const listItem = document.createElement("li");
                            listItem.textContent = postcode.postcode;
                            suggestionsList.appendChild(listItem);

                            listItem.addEventListener("click", function () {
                                inputField.value = postcode.postcode;
                                suggestionsList.innerHTML = ""; // Clear suggestions after selection
                            });
                        });
                    }
                })
                .catch(error => console.error("Error fetching postcodes:", error));
        } else {
            suggestionsList.innerHTML = ""; // Clear suggestions if input is empty
        }
    });
});
