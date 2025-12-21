// 1. Select the container where we want to put the text
const container = document.getElementById('curriculum-container');

// 2. Fetch (Get) the JSON data
fetch('data.json')
    .then(response => response.json()) // Convert raw data to JSON format
    .then(data => {
        
        // 3. Loop through the "subjects" list (Chemistry, CS)
        data.subjects.forEach(subject => {
            
            // A. Create a Title for the Subject (e.g., <h3>Chemistry</h3>)
            const subjectTitle = document.createElement('h3');
            subjectTitle.innerText = subject.name;
            container.appendChild(subjectTitle);

            // B. Create a List for the Modules (<ul>)
            const moduleList = document.createElement('ul');

            // C. Loop through the modules inside this subject
            subject.modules.forEach(module => {
                const listItem = document.createElement('li');
                listItem.innerText = module.title;
                moduleList.appendChild(listItem); // Put <li> inside <ul>
            });

            // D. Add the list to the main container
            container.appendChild(moduleList);
        });

    })
    .catch(error => console.error('Error loading data:', error)); // Log errors if file not found