$(document).ready(function () {
    // Function to calculate and update the subtotal, tax, and total amounts
    function updateInvoiceSummary() {
        let totalSubtotal = 0;
        let totalTax = 0;
        let totalAmount = 0;
        
        $('#productTable tbody tr').each(function () {
            const quantity = parseFloat($(this).find('input[name="quantity[]"]').val()) || 0;
            const price = parseFloat($(this).find('input[name="price[]"]').val()) || 0;
            const tax = parseFloat($(this).find('input[name="tax[]"]').val()) || 0;

            const subtotal = quantity * price;
            const taxAmount = (subtotal * tax) / 100;
            const amount = subtotal + taxAmount;

            totalSubtotal += subtotal;
            totalTax += taxAmount;
            totalAmount += amount;

            $(this).find('.subtotal').text(subtotal.toFixed(2));
        });

        $('#totalSubtotal').val(totalSubtotal.toFixed(2));
        $('#totalTax').val(totalTax.toFixed(2));
        $('#totalAmount').val(totalAmount.toFixed(2));

        // Update balance due based on payment method
        updateBalanceDue();
    }

    // Function to update the balance due based on payment method
    function updateBalanceDue() {
        const paymentMethod = $('input[name="paymentMethod"]:checked').val();
        const totalAmount = parseFloat($('#totalAmount').val()) || 0;
        const balanceDueSection = $('#balanceDueSection');
        const cashAmount = parseFloat($('#cashAmount').val()) || 0;

        if (paymentMethod === 'cash') {
            balanceDueSection.show();
            const balanceDue = totalAmount - cashAmount;
            $('#balanceDue').val(balanceDue.toFixed(2));
        } else {
            balanceDueSection.hide();
            $('#balanceDue').val('');
        }
    }

    // Event listener for changes in input fields
    $('#productTable').on('input', 'input', function () {
        updateInvoiceSummary();
    });

    // Event listener for payment method radio buttons
    $('input[name="paymentMethod"]').change(function () {
        updateBalanceDue();
    });

    // Event listener for changes in cash amount
    $('#cashAmount').on('input', function () {
        updateBalanceDue();
    });

    // Function to add a new product row
    $('#addItemBtn').click(function () {
        const newRow = `<tr>
            <td><input type="text" class="form-control" name="itemName[]" placeholder="Enter item name" required></td>
            <td><input type="number" class="form-control" name="quantity[]" placeholder="0" required></td>
            <td><input type="number" class="form-control" name="price[]" placeholder="0.00" required></td>
            <td><input type="number" class="form-control" name="tax[]" value="0" placeholder="0"></td>
            <td class="subtotal">0.00</td>
            <td><button type="button" class="btn btn-danger remove-btn">Cancel</button></td>
        </tr>`;
        $('#productTable tbody').append(newRow);
    });

    // Function to remove a product row
    $('#productTable').on('click', '.remove-btn', function () {
        $(this).closest('tr').remove();
        updateInvoiceSummary();
    });

    // Event listener for file input to preview uploaded logo
    $('#uploadLogo').change(function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const canvas = document.getElementById('logoPreview');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.onload = function () {
                    // Set canvas size to fixed dimensions
                    canvas.width = 200;
                    canvas.height = 150;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Initialize invoice summary
    updateInvoiceSummary();
});

document.getElementById('downloadBtn').addEventListener('click', function() {
    // Gather form data
    const invoiceData = {
        companyName: document.getElementById('companyName').value,
        companyAddress: document.getElementById('companyAddress').value,
        companyEmail: document.getElementById('companyEmail').value,
        companyPhone: document.getElementById('companyPhone').value,
        clientName: document.getElementById('clientName').value,
        clientAddress: document.getElementById('clientAddress').value,
        clientEmail: document.getElementById('clientEmail').value,
        clientPhone: document.getElementById('clientPhone').value,
        invoiceNo: document.getElementById('invoiceNo').value,
        invoiceDate: document.getElementById('invoiceDate').value,
        totalSubtotal: document.getElementById('totalSubtotal').value,
        totalTax: document.getElementById('totalTax').value,
        totalAmount: document.getElementById('totalAmount').value,
        upiId: document.getElementById('upiId').value,
        gstNo: document.getElementById('gstNo').value,
        balanceAmount: document.getElementById('balanceDue').value,
        cashAmount: document.getElementById('cashAmount').value,
        note: document.getElementById('note').value,
        paymentCash: document.getElementById('paymentCash').value,
        paymentOnline: document.getElementById('paymentOnline').value,
        items: []
    };

    // Capture product details
    document.querySelectorAll('#productTable tbody tr').forEach(row => {
        invoiceData.items.push({
            itemName: row.querySelector('[name="itemName[]"]').value,
            quantity: row.querySelector('[name="quantity[]"]').value,
            price: row.querySelector('[name="price[]"]').value,
            tax: row.querySelector('[name="tax[]"]').value,
            subtotal: row.querySelector('.subtotal').textContent
        });
    });

    // Handle the uploaded logo
    const logoCanvas = document.getElementById('logoPreview');
    const logoDataURL = logoCanvas.toDataURL();
    invoiceData.logo = logoDataURL;

    // Store data in localStorage (or sessionStorage)
    localStorage.setItem('invoiceData', JSON.stringify(invoiceData));

    // Redirect to template.html
    window.location.href = 'template.html';
});

