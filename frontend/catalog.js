const laptops = [
    { id: 1, name: "Dell XPS 15", specs: "16GB RAM, 512GB SSD", image: "dell.jpg" },
    { id: 2, name: "MacBook Pro 14", specs: "32GB RAM, 1TB SSD", image: "macbook.jpg" },
    { id: 3, name: "HP Pavilion", specs: "16GB RAM, 256GB SSD", image: "hp.jpg" }
];

const listElement = document.getElementById('laptop-list');

laptops.forEach(laptop => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <img src="${laptop.image}" alt="${laptop.name}" style="width: 150px; height: auto;">
        <h2>${laptop.name}</h2>
        <p>${laptop.specs}</p>
        <a href="rental_form.html?laptop_name=${encodeURIComponent(laptop.name)}" class="rent-now">Rent Now</a>
    `;
    listElement.appendChild(listItem);
});
