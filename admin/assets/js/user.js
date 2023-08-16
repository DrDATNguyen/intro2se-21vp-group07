var selectedImage = false; 

function previewImage(event) {
    var input = event.target;
    var preview = document.getElementById('image-preview');
    var deleteButton = document.getElementById('delete-button');

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            preview.innerHTML = '<img src="' + e.target.result + '" class="preview" alt="Preview" />';
            selectedImage = true;
            deleteButton.style.display = 'inline-block';
        };

        reader.readAsDataURL(input.files[0]);
    } else {
        preview.innerHTML = '';
        selectedImage = false;
        deleteButton.style.display = 'none';
    }
}

function deletePreview() {
    var preview = document.getElementById('image-preview');
    var deleteButton = document.getElementById('delete-button');

    preview.innerHTML = '';
    selectedImage = false;
    deleteButton.style.display = 'none';

    var inputFile = document.getElementById('file');
    inputFile.value = '';
}