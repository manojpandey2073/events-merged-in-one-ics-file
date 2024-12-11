document.addEventListener("DOMContentLoaded", function () {
    const huddleAddMoreBtn = document.querySelector('.huddle_add_more button');
    const icsContainer = document.querySelector('.ics_form_container');

    let eventDetailsCounter = 1; // Counter for cloneEventDetailsContainer IDs

    // Function to clone the "event_details_container" section
    function cloneEventDetailsContainer() {
        const eventDetailsContainer = document.querySelector('.event_details_container'); // Target the element to clone
        const clonedSection = eventDetailsContainer.cloneNode(true); // Clone the element

        // Ensure only one "huddle_row_2" exists in the cloned section
        const huddleRows = clonedSection.querySelectorAll('.huddle_row_2');
        if (huddleRows.length > 1) {
            huddleRows.forEach((row, index) => {
                if (index > 0) row.remove(); // Remove all but the first "huddle_row_2"
            });
        }

        // Reset all input fields and textarea values in the cloned section
        const inputs = clonedSection.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.value = ''; // Clear input value
            const baseId = input.id || 'input'; // Extract base ID or fallback
            input.id = `${baseId}_${eventDetailsCounter}`; // Assign unique ID
        });

        // Set a unique counter for "huddle_row_2" in this container
        clonedSection.setAttribute('data-counter', '1'); // Initialize counter for this container

        // Increment unique ID counter for this function
        eventDetailsCounter++;

        // Add a close ("×") button to delete the cloned "event_details_container"
        const crossIcon = document.createElement('span');
        crossIcon.classList.add('remove_event_container');
        crossIcon.innerHTML = '&#10006;'; // Unicode for '×' symbol
        crossIcon.style.cssText = `
            position: absolute;
            top: 7px;
            right: 15px;
            cursor: pointer;
            font-size: 18px;
            color: #000000;
        `;
        crossIcon.addEventListener('click', function () {
            clonedSection.remove();
        });

        clonedSection.style.position = 'relative'; // Ensure the cross icon is properly positioned
        clonedSection.appendChild(crossIcon);

        // Attach event listener to the "+" button within the cloned section
        const addMoreBtn = clonedSection.querySelector('.date_time_add_btn');
        if (addMoreBtn) {
            addMoreBtn.addEventListener('click', cloneHuddleRow);
        }

        // Append the cloned section to the container
        icsContainer.appendChild(clonedSection);
    }

    // Add event listener to the "Add More Huddle" button to clone the "event_details_container"
    huddleAddMoreBtn.addEventListener('click', cloneEventDetailsContainer);

    // Function to clone the "huddle_row_2" section
    function cloneHuddleRow(event) {
        const parentContainer = event.target.closest('.event_details_container'); // Get the parent container
        const huddleRow = parentContainer.querySelector('.huddle_row_2'); // Target the element to clone

        if (!huddleRow) return; // Exit if no "huddle_row_2" exists

        const clonedHuddleRow = huddleRow.cloneNode(true); // Clone the element

        // Reset and assign unique IDs to all input fields and textarea within the cloned section
        const inputs = clonedHuddleRow.querySelectorAll('input, textarea, select');
        console.log(inputs);
        const currentCounter = parseInt(parentContainer.getAttribute('data-counter'), 10); // Get the current counter
        console.log(currentCounter);
        
        inputs.forEach(input => {
            input.value = ''; // Clear input value
            const originalId = input.id || 'input'; // Fallback for elements without IDs
            input.id = `${originalId}_${currentCounter}`; // Assign unique ID
        });
        
        // Increment the counter for this container
        parentContainer.setAttribute('data-counter', currentCounter + 1);

        // Add a close ("×") button to remove the cloned row
        const crossIcon = document.createElement('span');
        crossIcon.classList.add('remove_huddle_row');
        crossIcon.innerHTML = '&#10006;'; // Unicode for '×' symbol
        crossIcon.style.cssText = `
            position: absolute;
            top: -10px;
            right: -2px;
            cursor: pointer;
            font-size: 18px;
            color: #000000;
        `;
        crossIcon.addEventListener('click', function () {
            clonedHuddleRow.remove();
           
        });

        clonedHuddleRow.style.position = 'relative'; // Ensure the cross icon is properly positioned
        clonedHuddleRow.appendChild(crossIcon);

        // Append the cloned row to the parent container
        huddleRow.parentNode.appendChild(clonedHuddleRow);
    }

    // Attach initial event listener to the "+" button for the first "ics_form_container"
    const addMoreBtn = document.querySelector('.date_time_add_btn');
    addMoreBtn.addEventListener('click', cloneHuddleRow);
});



