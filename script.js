const BACKEND_PATH = "http://localhost:4000";

function populateFiltersOptions() {
  const typesSelect = document.getElementById("type");
  const brandSelect = document.getElementById("brand");

  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(`${BACKEND_PATH}/api/products/types`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      result.forEach((type) => {
        typesSelect.insertAdjacentHTML(
          "beforeend",
          `<option value=${type}>${type}</option>`
        );
      });
    })

    .catch((error) => console.error(error));

  fetch(`${BACKEND_PATH}/api/products/brands`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      result.forEach((brand) => {
        brandSelect.insertAdjacentHTML(
          "beforeend",
          `<option value=${brand}>${brand}</option>`
        );
      });
    })
    .catch((error) => console.error(error));
}

populateFiltersOptions();

// criar o formulario

const loginForm = document.getElementById("loginForm");

async function login(email, password) {
  try {
    const response = fetch(`${BACKEND_PATH}/auth/users/login`, {
      method: "POST",
      headers: {
        "Comtent-Type": "application/json"
      },
      body: JSON.stringify({email, password});
    });


  } catch (error) {
    console.log(error);
    }
}

loginForm.addEventListener("submit", async (event)=> {
event.preventDefault(); 
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;
try {
  await login(email, password);
  console.log("logged in sucessfully:");
} catch (error) {
  console.log("login failed: ", error);
}

});




// criar funcao do btn dos filtros
function handleFilterBtnClick() {
  const typeId = document.getElementById("type").value;
  const brandId = document.getElementById("brand").value;
  const queryParams = new URLSearchParams({
    type: typeId,
    brand: brandId,
  }).toString();
  // console.log(queryParams);

  // formar o url
  const url = `${BACKEND_PATH}/api/products?${queryParams}&limit=100`;
  console.log(url);

  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      const productContainer = document.querySelector(".product-list");
      productContainer.innerHTML = "";
      result.forEach((product) => {
        let productElement = `<div class="col-md-4 mb-4"><div class="card">
                <div class="card-body">
                  <img src="${product.image_url}" class= "card-img-top" alt= "${product.title}"/>
                  <h5 class="card-title">${product.title}</h5>
                  <p class="card-text"><small>${product.brand}, ${product.type}</p>
                  <p class="card-text">${product.price}</p>
                  <p class="card-text"><small>${product.description}</small></p>
                  <button data-id ="${product.id}" class="btn btn-danger delete-btn">Delete</button>
                </div>
                </div>`;

        productContainer.insertAdjacentHTML("beforeend", productElement);
      });
      const deleteBtns = document.querySelectorAll(".delete-btn");
      deleteBtns.forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", handleDeleteProduct);
      });
    })
    .catch((error) => console.error(error));
}

function handleDeleteProduct(event) {
  if(confirm("tem a ceretza que pretende apagar o seguinte produto")){
  const productId = event.target.dataset.id;

  const requestOptions = {
    method: "DELETE",
    redirect: "follow",
  };

  fetch(`${BACKEND_PATH}/api/products/${productId}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error deleting product");
      }
      return response.json();
    })
    .then(() => {
      event.target.parentElement.parentElement.parentElement.remove();
    })
    .catch((error) => console.error(error));
}}

handleFilterBtnClick();
