// Firebase setup...
const db = firebase.firestore();

// Show tab logic
function showTab(tab) {
  document.getElementById('productsTab').style.display = tab === 'products' ? 'block' : 'none';
  document.getElementById('testimonialsTab').style.display = tab === 'testimonials' ? 'block' : 'none';
}

// Edit product
function editProduct(id, data) {
  document.getElementById('editProductForm').style.display = 'block';
  document.getElementById('editId').value = id;
  document.getElementById('editTitle').value = data.title;
  document.getElementById('editPrice').value = data.price;
  document.getElementById('editDescription').value = data.description;
  document.getElementById('editImage').value = data.image;
}

document.getElementById('editProductForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('editId').value;
  db.collection('products').doc(id).update({
    title: document.getElementById('editTitle').value,
    price: Number(document.getElementById('editPrice').value),
    description: document.getElementById('editDescription').value,
    image: document.getElementById('editImage').value
  }).then(() => {
    alert('Product updated!');
    document.getElementById('editProductForm').reset();
    document.getElementById('editProductForm').style.display = 'none';
    loadProducts(); // refresh product list
  });
});

// Testimonials CRUD
document.getElementById('testimonialForm').addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('testimonials').add({
    name: document.getElementById('testimonialName').value,
    message: document.getElementById('testimonialMessage').value
  }).then(() => {
    alert('Testimonial added!');
    loadTestimonials();
    e.target.reset();
  });
});

function loadTestimonials() {
  const container = document.getElementById('testimonialList');
  container.innerHTML = '';
  db.collection('testimonials').get().then(snapshot => {
    snapshot.forEach(doc => {
      const t = doc.data();
      const div = document.createElement('div');
      div.innerHTML = `
        <strong>${t.name}</strong><p>${t.message}</p>
        <button onclick="deleteTestimonial('${doc.id}')">Delete</button>
      `;
      container.appendChild(div);
    });
  });
}

function deleteTestimonial(id) {
  db.collection('testimonials').doc(id).delete().then(() => {
    alert('Deleted');
    loadTestimonials();
  });
}