let idsArray = [1];
let time_zone_name = (Intl.DateTimeFormat().resolvedOptions().timeZone);
let time_zone_offset = new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2];
let user_time_zone = `${time_zone_name} ${time_zone_offset}`;
console.log(user_time_zone);
document.addEventListener('DOMContentLoaded', () => {

    // Reference the "Add More Event" button
    const addMoreEventButton = document.querySelector('.huddle_add_more button');

    // Disable the "Add More Event" button initially
    if (addMoreEventButton) {
        disableAddMoreButton();
    }
    // Function to disable the "Add More Event" button
    function disableAddMoreButton() {
        if (addMoreEventButton) {
            addMoreEventButton.disabled = true;
            addMoreEventButton.style.opacity = "0.5";
            addMoreEventButton.style.cursor = "not-allowed";
            addMoreEventButton.title = "Please first save details of the event by clicking the Save Details button."; // hover message
        }
    }

    // Function to enable the "Add More Event" button
    function enableAddMoreButton() {
        if (addMoreEventButton) {
            addMoreEventButton.disabled = false;
            addMoreEventButton.style.opacity = "1";
            addMoreEventButton.style.cursor = "pointer";
            addMoreEventButton.title = "";
        }
    }
    // To get Current time in date time field
    const input_date_time = document.querySelector('input[type=datetime-local]');
    const current_time = new Date();

    // Format the date to local time in 'YYYY-MM-DDTHH:mm' format
    const year = current_time.getFullYear();
    const month = String(current_time.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(current_time.getDate()).padStart(2, '0');
    const hours = String(current_time.getHours()).padStart(2, '0');
    const minutes = String(current_time.getMinutes()).padStart(2, '0');

    // Combine the parts into 'YYYY-MM-DDTHH:mm'
    const localFormattedTime = `${year}-${month}-${day}T${hours}:${minutes}`;

    input_date_time.value = localFormattedTime;


    let clonedEventDetailsContainer = null;

    // Function to clone the "event_details_container" element on page load
    setTimeout(() => {
        function storeClonedElement(selector) {
            const elementToClone = document.querySelector(selector);
            if (elementToClone) {
                clonedEventDetailsContainer = elementToClone.cloneNode(true);
                console.log('Cloned element stored successfully.');
            } else {
                console.error(`Element with selector "${selector}" not found.`);
            }
        }
        // Call the function to store the clone
        storeClonedElement('.event_details_container');
    }, 1000); // add some delay so that current date and time can update on date and time input before cloning element





    const icsContainer = document.querySelector('.ics_form_container');
    let eventDetailsCounter = 2; // Counter to ensure unique IDs

    // Function to append the cloned element
    function appendClonedElement() {
        if (!clonedEventDetailsContainer) {
            console.error('Cloned element not available.');
            return;
        }

        const clonedSection = clonedEventDetailsContainer.cloneNode(true);
        const inputs = clonedSection.querySelectorAll('input, textarea, select, form');
        inputs.forEach(input => {
            const baseId = input.id.replace(/_\d+$/, "") || 'input'; // Extract base ID or fallback
            input.id = `${baseId}_${eventDetailsCounter}`; // Assign unique ID
            input.name = `${baseId}_${eventDetailsCounter}`;
        });
        idsArray.push(eventDetailsCounter);

        // Add a close button to the cloned section
        const crossIcon = document.createElement('span');
        crossIcon.id = `remove_event_container_${eventDetailsCounter}`;
        crossIcon.classList.add('remove_event_container');
        crossIcon.innerHTML = '&#10006;';
        crossIcon.style.cssText = `
            position: absolute;
            top: 7px;
            right: 15px;
            cursor: pointer;
            font-size: 18px;
            color: #000000;
        `;
        crossIcon.addEventListener('click', (event) => {
            const clickedElementId = event.target.id;
            const match = clickedElementId.match(/\d+$/); // Extract the number at the end
            const lastNumber = match ? parseInt(match[0], 10) : null; // Convert to number
            // console.log('lastNumber---', lastNumber);

            let index = idsArray.indexOf(lastNumber); // Find index of the number

            if (index !== -1) {
                idsArray.splice(index, 1); // Remove 1 item at the found index
                // console.log('Updated Array:', idsArray);
            }

            clonedSection.remove();
            enableAddMoreButton();
        });

        clonedSection.appendChild(crossIcon);

        icsContainer.appendChild(clonedSection);
        eventDetailsCounter++;
        // Disable the "Add More Event" button after adding a new container
        disableAddMoreButton();
    }








    // Function to clone the "huddle_row_2" section
    function cloneHuddleRow(button) {
        const parentContainer = button.closest('.event_details_container'); // Get the parent container
        const huddleRow = parentContainer.querySelector('.huddle_row_2'); // Target the element to clone

        if (!huddleRow) return;

        const clonedHuddleRow = huddleRow.cloneNode(true);
        const inputs = clonedHuddleRow.querySelectorAll('input, textarea, select');
        const currentCounter = parseInt(parentContainer.getAttribute('data-counter'), 10) || 0;

        inputs.forEach(input => {
            const originalId = input.id || 'input'; // Fallback for elements without IDs
            const originalName = input.name || 'input';
            input.id = `${originalId}_${currentCounter}`; // Assign unique ID
            input.name = `${originalName}_${currentCounter}`;
        });

        parentContainer.setAttribute('data-counter', currentCounter + 1);

        const crossIcon = document.createElement('span');
        crossIcon.id = `remove_huddle_row_${currentCounter}`;
        crossIcon.classList.add('remove_huddle_row');
        crossIcon.innerHTML = '&#10006;';
        crossIcon.style.cssText = `
            position: absolute;
            top: 0;
            right: -2px;
            cursor: pointer;
            font-size: 18px;
            color: #000000;
        `;
        // Add event listener to remove the specific cloned row
        crossIcon.addEventListener('click', (event) => {
            const rowToRemove = event.target.closest('.huddle_row_2'); // Find the closest parent with the row class
            if (rowToRemove) rowToRemove.remove(); // Remove that specific row
        });

        clonedHuddleRow.style.position = 'relative';
        clonedHuddleRow.style.borderTop = "1px solid #03080f";
        clonedHuddleRow.style.paddingTop = "20px";
        clonedHuddleRow.appendChild(crossIcon);

        huddleRow.parentNode.appendChild(clonedHuddleRow);
    }







    // Minimize huddle event function
    function minimizeHuddleEvent(button) {
        const parentContainer = button.closest('.event_details_container'); // Ensure scoping to the correct container

        // Validation: Check if any required input fields are blank or invalid
        const inputs = parentContainer.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            const errorId = `${input.name || input.id}-error`;

            // Locate the parent element of the input to position the error correctly
            let parentElement = input.parentElement;

            // If there's no parent or a specific wrapper, default to input's parentNode
            if (!parentElement) {
                parentElement = input.parentNode;
            }

            // Check if an error message already exists
            let errorElement = parentElement.querySelector(`#${errorId}`);

            // Reset border and remove existing error message for this field
            input.style.border = "";
            if (errorElement) {
                errorElement.remove();
            }

            // Validation logic
            if (!input.value.trim()) {
                isValid = false;

                // Highlight the empty field
                input.style.border = "1px solid red";

                // Add an error message if not already present
                if (!errorElement) {
                    errorElement = document.createElement('div');
                    errorElement.id = errorId;
                    errorElement.className = 'input-error-message';
                    errorElement.style.cssText = `
                color: red;
                font-size: 12px;
                margin-top: 4px;
            `;
                    errorElement.innerText = "This field is required.";

                    // Append the error message after the input field
                    parentElement.insertBefore(errorElement, input.nextSibling);
                }
            } else if (input.type === 'email') {
                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value.trim())) {
                    isValid = false;

                    // Highlight invalid email field
                    input.style.border = "1px solid red";

                    // Add an error message for invalid email
                    if (!errorElement) {
                        errorElement = document.createElement('div');
                        errorElement.id = errorId;
                        errorElement.className = 'input-error-message';
                        errorElement.style.cssText = `
                    color: red;
                    font-size: 12px;
                    margin-top: 4px;
                `;
                        errorElement.innerText = "Please enter a valid email address.";

                        // Append the error message after the input field
                        parentElement.insertBefore(errorElement, input.nextSibling);
                    }
                }
            }
        });

        if (!isValid) {
            return; // Stop further execution if validation fails
        }



        const minimizedContainer = parentContainer.querySelector('.huddle_minimized');
        if (minimizedContainer) {
            minimizedContainer.style.display = "flex";
        } else {
            console.error('Minimized container not found.');
        }

        const eventForm = parentContainer.querySelector('form');
        if (eventForm) {
            eventForm.style.display = "none";
            eventForm.style.height = "0";
            eventForm.style.overflow = "hidden";
        } else {
            console.error('Event form not found in container.');
        }

        // Enable the "Add More Event" button after saving details
        enableAddMoreButton();

        const titles = parentContainer.querySelectorAll('.huddle_title input[type=text]');
        const minimizedTitle = parentContainer.querySelector('.minimized_title');
        if (minimizedTitle) {
            minimizedTitle.innerHTML = Array.from(titles).map(input => input.value).join(', ');
        } else {
            console.error('Minimized title not found in container.');
        }

        const dates = parentContainer.querySelectorAll('.event_date_time_div input[type=datetime-local]');

        const minimizedDate = parentContainer.querySelector('.minimized_date');

        if (minimizedDate) {
            minimizedDate.innerHTML = ''; // Clear previous content if any
            Array.from(dates).forEach(dateInput => {
                const dateValue = dateInput.value;
                const specificDate = new Date(dateValue);
                const formatted_date = new Intl.DateTimeFormat('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                }).format(specificDate);
                const formatted_time = new Date(dateValue);
                const hours = formatted_time.getHours();

                const minutes = formatted_time.getMinutes();
                let zero_minutes = String(minutes); // Convert to string for padding
                if (minutes < 10) {
                    zero_minutes = zero_minutes.padStart(2, "0");

                }
                const AmOrPM = hours >= 12 ? 'PM' : 'AM';
                const hours_12hrs = (hours % 12) || 12;


                const formatted_time_12hrs = hours_12hrs + ":" + zero_minutes + AmOrPM;

                const span = document.createElement('span');
                span.classList.add('minimized_date_span');
                span.innerHTML = `${formatted_date} ( ${formatted_time_12hrs} )`;
                minimizedDate.appendChild(span);
            });
        } else {
            console.error('Minimized date not found in container.');
        }

        // Enable the "Add More Event" button
        if (addMoreEventButton) {
            addMoreEventButton.disabled = false;
            addMoreEventButton.style.opacity = "1"; // Restore styling
            addMoreEventButton.style.cursor = "pointer"; // Restore cursor
        }

        // Add a pencil button to allow editing
        let editButton = parentContainer.querySelector('.edit_details_btn');
        if (!editButton) {
            editButton = document.createElement('button');
            editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
            editButton.classList.add('edit_details_btn');
            editButton.style.cssText = `
            background-color: transparent;
            border: none;
            cursor: pointer;
            font-size: 16px;
            color: #333;
        `;
            editButton.title = "Edit Details";

            // Toggle the visibility of the form
            editButton.addEventListener('click', () => {
                if (eventForm.style.height === "0px") {
                    // Expand the form
                    eventForm.style.display = "block";
                    eventForm.style.height = "auto";
                    eventForm.style.overflow = "visible";
                } else {
                    // Collapse the form
                    eventForm.style.display = "none";
                    eventForm.style.height = "0";
                    eventForm.style.overflow = "hidden";

                }
            });

            // Append the button below the minimized container
            minimizedContainer.appendChild(editButton);
        }
    }


    // Event delegation for dynamically added elements
    document.addEventListener('click', (event) => {
        if (event.target.matches('.huddle_add_more button')) {
            appendClonedElement();
        } else if (event.target.matches('.date_time_add_btn button')) {
            cloneHuddleRow(event.target);
        } else if (event.target.matches('.event_save_details button')) {
            minimizeHuddleEvent(event.target); // Pass the clicked button to scope logic
        }
    });

});



function getFormData() {
    let allFormData = []; // Store data from all forms here

    idsArray.forEach((input) => {
        const form = document.getElementById(`form_${input}`); // Get the form element
        if (!form) {
            console.error(`Form with ID form_${input} not found.`);
            return; // Skip this form if not found
        }

        const formData = new FormData(form); // Create a FormData object
        let formObj = {}; // Store key-value pairs for this form

        // Convert FormData to a regular object
        formData.forEach((value, key) => {
            if (key.startsWith('event_date_time')) {
                // Convert to user's local time
                const userLocalDate = new Date(value); // Assume value is a timestamp
                const userOffset = userLocalDate.getTimezoneOffset(); // Offset in minutes
                userLocalDate.setMinutes(userLocalDate.getMinutes() - userOffset); // Adjust to user's local timezone
                formObj[key] = userLocalDate.toISOString(); // Store the adjusted value
            } else {
                formObj[key] = value; // Keep other values as-is
            }
        });

        allFormData.push({ eventId: `${input}`, data: formObj }); // Add this form's data to the array
    });

    console.log('All Forms Data (Adjusted to User Local Time):', allFormData);

    const keyPattern = /^event_date_time/;
    let occurrenceCountArray = [];

    allFormData.forEach(item => {
        let occurrenceCount = 0;
        if (item.data) { // Check if 'data' object exists
            Object.keys(item.data).forEach(key => {
                if (key.startsWith('event_date_time')) { // Check for keys matching the pattern
                    occurrenceCount++;
                }
            });
        }
        occurrenceCountArray.push({ 'eventId': item.eventId, 'count': occurrenceCount });
    });

    let lastArray = [];
    console.log('occurrenceCount::::::', occurrenceCountArray);
    allFormData.forEach((item, index) => {
        if (item.eventId == occurrenceCountArray[index].eventId) {
            const length = occurrenceCountArray[index].count; // Get the count of occurrences
            for (let ind = 0; ind < length; ind++) {
                if (ind == 0) {
                    // For the first occurrence, use "_1" keys
                    const dateStart = new Date(item.data[`event_date_time_${index + 1}`]);
                    lastArray.push({
                        title: item.data[`event_name_${index + 1}`],
                        description: item.data[`event_description_${index + 1}`],
                        start: [dateStart.getFullYear(), dateStart.getMonth() + 1, dateStart.getDate(), dateStart.getHours(), dateStart.getMinutes()],
                        location: item.data[`event_location_${index + 1}`],
                        duration: { hours: Number(item.data[`event_hour_${index + 1}`]), minutes: Number(item.data[`event_min_${index + 1}`]) }
                    });
                } else {
                    // Dynamically construct keys for other occurrences
                    const dateStart = new Date(item.data[`event_date_time_${index + 1}_${ind}`]);
                    lastArray.push({
                        title: item.data[`event_name_${index + 1}`],
                        description: item.data[`event_description_${index + 1}_${ind}`],
                        start: [dateStart.getFullYear(), dateStart.getMonth() + 1, dateStart.getDate(), dateStart.getHours(), dateStart.getMinutes()],
                        location: item.data[`event_location_${index + 1}_${ind}`],
                        duration: { hours: Number(item.data[`event_hour_${index + 1}_${ind}`]), minutes: Number(item.data[`event_min_${index + 1}_${ind}`]) }
                    });
                }
            }
        }
    });

    console.log('lastArray (Adjusted):', lastArray);

    function _save(event) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        fetch('https://events-merged-in-one-ics-file-1.onrender.com/saveICS', {
            method: "POST",
            headers: myHeaders,
            redirect: "follow",
            body: JSON.stringify(event)
        })
            .then((response) => {
                return response.text();
            })
            .then((result) => {
                console.log(result);
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = fileURL;

                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
                
            })
            .catch((error) => {
                console.error(error);
            });
    }

    try {
        let event = { email: "deepak.gaud@growthnatives.com", data: lastArray };
        console.log('event to save::::::', event);
        _save(event);
    } catch (e) {
        console.error(e);
    }
}





// Add event listener to the button
document.getElementById('submitButton').addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default action (if any)
    getFormData(); // Call the function to get form data
});