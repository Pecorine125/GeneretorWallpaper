const input = document.getElementById('imgReference');
const preview = document.getElementById('previewImg');

input.addEventListener('change', () => {
  const file = input.files[0];
  if (!file) {
    preview.style.display = 'none';
    preview.src = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    preview.src = e.target.result;
    preview.style.display = 'block';
  };
  reader.readAsDataURL(file);
});
