document.addEventListener('DOMContentLoaded', function () {
    let invoiceItems = []; // Initialize invoiceItems as an empty array
    
    function saveInvoiceItemsToStorage(items) {
        localStorage.setItem('invoiceItems', JSON.stringify(items));
    }

    function addInvoiceItems(items) {
        const invoiceItemsContainer = document.getElementById('invoice-items');

        items.forEach((item, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td data-label="No.">${item.no}</td>
                <td data-label="Item Description" class="item-description"><a href="#" data-index="${index}">${item.description}</a></td>
                <td data-label="Price" class="editable" data-field="price" contenteditable="true">${item.price}</td>
                <td data-label="Student" class="editable" data-field="student" contenteditable="true">${item.student}</td>
                <td data-label="Total" class="editable" data-field="total">${item.total}</td>
            `;

            invoiceItemsContainer.appendChild(row);
        });

        document.querySelectorAll('.item-description a').forEach(element => {
            element.addEventListener('click', function(event) {
                event.preventDefault();
                const index = parseInt(this.getAttribute('data-index'));
                toggleCourseDetails(index);
            });
        });

        // Use querySelectorAll for efficiency
        const editableCells = document.querySelectorAll('.editable');
        editableCells.forEach(cell => {
            cell.addEventListener('input', function() {
                updateTotalPrice();
                saveInvoiceItemsToStorage(invoiceItems);
            });
        });
    }

    function updateTotalPrice() {
        const priceCells = document.querySelectorAll('.editable[data-field="price"]');
        const studentCells = document.querySelectorAll('.editable[data-field="student"]');
        const totalCells = document.querySelectorAll('.editable[data-field="total"]');

        priceCells.forEach((priceCell, index) => {
            const price = parseFloat(priceCell.textContent.trim()) || 0; 
            const student = parseFloat(studentCells[index].textContent.trim()) || 0; 
            const total = price * student;
            totalCells[index].textContent = total.toFixed(2);
            invoiceItems[index] = { 
                no: index + 1, 
                description: 'Rivya Ravs', 
                price: price, 
                student: student, 
                total: total 
            };
        });
    }

    function toggleCourseDetails(index) {
        const courseDetailsSection = document.getElementById('course-details');
        if (courseDetailsSection.style.display === 'block') {
            courseDetailsSection.style.display = 'none';
            document.getElementById('navigate-back').style.display = 'none';
        } else {
            displayCourseDetails(index);
        }
    }

    function displayCourseDetails(index) {
        const courseDescription = document.getElementById('course-description');
        const coursePriceElement = document.getElementById('course-price');
        const courseStudentElement = document.getElementById('course-student');
        const courseGSTElement = document.getElementById('course-gst');
        const courseTotalPriceElement = document.getElementById('course-total-price');

        const basePrice = invoiceItems[index].price;
        const student = invoiceItems[index].student;
        const gst = 0.18; 
        const totalPrice = basePrice * student * (1 + gst);
        coursePriceElement.textContent = basePrice.toFixed(2);
        courseStudentElement.textContent = student; 
        courseGSTElement.textContent = (basePrice * student * gst).toFixed(2);
        courseTotalPriceElement.textContent = totalPrice.toFixed(2);

        document.getElementById('course-details').style.display = 'block';
        document.getElementById('customer-details1').style.display = 'none';
        document.getElementById('navigate-back').style.display = 'block';
        document.getElementById('next-item-section').style.display = 'block';

        const nextIndex = (index + 1) % invoiceItems.length;
        const nextItemLink = document.getElementById('next-item');
        nextItemLink.setAttribute('data-next-index', nextIndex);

        nextItemLink.replaceWith(nextItemLink.cloneNode(true));
        document.getElementById('next-item').addEventListener('click', function(event) {
            event.preventDefault();
            displayCourseDetails(nextIndex);
        });
    }

    document.getElementById('back-to-items').addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('course-details').style.display = 'none';
        document.getElementById('customer-details1').style.display = 'block';
        document.getElementById('navigate-back').style.display = 'none';
        document.getElementById('next-item-section').style.display = 'none';
    });

    
    for (let i = 0; i < 5; i++) {
        invoiceItems.push({
            no: i + 1,
            description: '<input type="text" value="Rivya Ravs">',
            price: 0,
            student: 0,
            total: 0
        });
    }
    
    console.log(invoiceItems);
    
    addInvoiceItems(invoiceItems);
    updateTotalPrice();
});