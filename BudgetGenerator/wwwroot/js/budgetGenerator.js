// Função para buscar a matriz de serviços
async function fetchServiceMatrix() {
  try {
    const response = await fetch("/data/matriz_horas.json");
    const matrixData = await response.json();
    console.log("Matriz de Horas Carregada:", matrixData);
    return matrixData;
  } catch (error) {
    console.error("Erro ao carregar a Matriz de Horas:", error);
  }
}

// Funções para popular os campos de serviço com base na matriz
function populateAreaSelect(selectElement, serviceMatrix, category) {
  console.log("Populando áreas com base na categoria:", category);
  selectElement.innerHTML = '<option value="">Selecione</option>';
  const areas = serviceMatrix[category.toLowerCase()];
  for (let area in areas) {
    const option = document.createElement("option");
    option.value = area;
    option.textContent = area.charAt(0).toUpperCase() + area.slice(1);
    selectElement.appendChild(option);
  }
  console.log("Áreas populadas:", selectElement);
}

function populateServiceTypeSelect(
  selectElement,
  serviceMatrix,
  category,
  area
) {
  console.log(
    "Populando tipos de serviço para a área:",
    area,
    "na categoria:",
    category
  );
  selectElement.innerHTML = '<option value="">Selecione</option>';
  const services = serviceMatrix[category.toLowerCase()][area.toLowerCase()];
  for (let service in services) {
    const option = document.createElement("option");
    option.value = service;
    option.textContent = service.charAt(0).toUpperCase() + service.slice(1);
    selectElement.appendChild(option);
  }
  console.log("Tipos de serviço populados:", selectElement);
}

function populateComplexitySelect(
  selectElement,
  serviceMatrix,
  category,
  area,
  serviceType
) {
  console.log(
    "Populando níveis de complexidade para o tipo de serviço:",
    serviceType
  );
  selectElement.innerHTML = '<option value="">Selecione</option>';
  const complexities =
    serviceMatrix[category.toLowerCase()][area.toLowerCase()][
      serviceType.toLowerCase()
    ];
  for (let complexity in complexities) {
    const option = document.createElement("option");
    option.value = complexity;
    option.textContent =
      complexity.charAt(0).toUpperCase() + complexity.slice(1);
    selectElement.appendChild(option);
  }
  console.log("Complexidades populadas:", selectElement);
}

async function initializeForm() {
  console.log("Iniciando formulário");

  // Carregar matriz de serviços
  const serviceMatrix = await fetchServiceMatrix();

  // Função auxiliar para adicionar campos de funcionalidades
  function adicionarFuncionalidadeCampos(funcionalidadeIndex) {
    const funcionalidadeContainer = document.createElement("div");
    funcionalidadeContainer.className = "feature";
    funcionalidadeContainer.setAttribute(
      "data-funcionalidade-index",
      funcionalidadeIndex
    );

    funcionalidadeContainer.innerHTML = `
          <h2>Funcionalidade ${funcionalidadeIndex + 1}</h2>
          <div>
              <label for="nomeFuncionalidade">Nome:</label>
              <input type="text" name="Features[${funcionalidadeIndex}].Name" required autocomplete="off"/>
          </div>
          <div>
              <label for="descricaoFuncionalidade">Descrição:</label>
              <textarea name="Features[${funcionalidadeIndex}].Description" rows="3" required autocomplete="off"></textarea>
          </div>
          <div class="servicesContainer" data-service-index="0">
          <button type="button" class="add-service-btn">Adicionar Serviço</button>
              <h3>Serviços:</h3>
          </div>
      `;

    document
      .getElementById("feature-container")
      .appendChild(funcionalidadeContainer);

    // Adicionar evento de adicionar serviço
    funcionalidadeContainer
      .querySelector(".add-service-btn")
      .addEventListener("click", function () {
        adicionarServicos(
          funcionalidadeContainer,
          funcionalidadeIndex,
          serviceMatrix
        );
      });
  }

  // Função para adicionar serviços à funcionalidade
  function adicionarServicos(
    funcionalidadeDiv,
    funcionalidadeIndex,
    serviceMatrix
  ) {
    const servicesContainer =
      funcionalidadeDiv.querySelector(".servicesContainer");
    let serviceIndex = parseInt(
      servicesContainer.getAttribute("data-service-index")
    );

    const serviceDiv = document.createElement("div");
    serviceDiv.className = "service";
    serviceDiv.innerHTML = `
          <div class="flex-col">
              <label>Categoria:</label>
              <select name="Features[${funcionalidadeIndex}].Services[${serviceIndex}].Category" class="categorySelect" required>
                  <option value="">Selecione</option>
                  <option value="operacoes">Operações</option>
                  <option value="integracoes">Integrações</option>
                  <option value="testes">Testes</option>
              </select>
          </div>
          <div class="flex-col">
          <label>Área</label>
          <select name="Features[${funcionalidadeIndex}].Services[${serviceIndex}].Area" class="areaSelect" required>
          <option value="">Selecione</option>
          </select>
          </div>
          <div class="flex-col">
          <label>Serviço</label>
          <select name="Features[${funcionalidadeIndex}].Services[${serviceIndex}].ServiceType" class="serviceTypeSelect" required>
          <option value="">Selecione</option>
          </select>
          </div>
          <div class="flex-col">
          <label>Complexidade</label>
          <select name="Features[${funcionalidadeIndex}].Services[${serviceIndex}].Complexity" class="complexitySelect" required>
          <option value="">Selecione</option>
          </select>
          </div>
          <div class="flex-col">
          <label>Horas</label>
          <input type="number" name="Features[${funcionalidadeIndex}].Services[${serviceIndex}].Hours" min="1" readonly />
          </div>
          `;

    const prevLastService = servicesContainer.querySelector(
      ".last-added-service"
    );
    if (prevLastService) {
      prevLastService.classList.remove("last-added-service");
    }

    // Adicionar o novo serviço e marcar como 'last-added-service'
    servicesContainer.appendChild(serviceDiv);
    serviceDiv.classList.add("last-added-service");

    servicesContainer.setAttribute("data-service-index", ++serviceIndex);
    const categorySelect = serviceDiv.querySelector(".categorySelect");
    const areaSelect = serviceDiv.querySelector(".areaSelect");
    const serviceTypeSelect = serviceDiv.querySelector(".serviceTypeSelect");
    const complexitySelect = serviceDiv.querySelector(".complexitySelect");
    const hoursInput = serviceDiv.querySelector("input[name$='.Hours']");

    categorySelect.addEventListener("change", function () {
      const selectedCategory = categorySelect.value;
      if (selectedCategory) {
        populateAreaSelect(areaSelect, serviceMatrix, selectedCategory);
      }
    });

    areaSelect.addEventListener("change", function () {
      const selectedCategory = categorySelect.value;
      const selectedArea = areaSelect.value;
      if (selectedCategory && selectedArea) {
        populateServiceTypeSelect(
          serviceTypeSelect,
          serviceMatrix,
          selectedCategory,
          selectedArea
        );
      }
    });

    serviceTypeSelect.addEventListener("change", function () {
      const selectedCategory = categorySelect.value;
      const selectedArea = areaSelect.value;
      const selectedServiceType = serviceTypeSelect.value;
      if (selectedCategory && selectedArea && selectedServiceType) {
        populateComplexitySelect(
          complexitySelect,
          serviceMatrix,
          selectedCategory,
          selectedArea,
          selectedServiceType
        );
      }
    });

    complexitySelect.addEventListener("change", function () {
      const selectedCategory = categorySelect.value;
      const selectedArea = areaSelect.value;
      const selectedServiceType = serviceTypeSelect.value;
      const selectedComplexity = complexitySelect.value;
      if (
        selectedCategory &&
        selectedArea &&
        selectedServiceType &&
        selectedComplexity
      ) {
        const horas =
          serviceMatrix[selectedCategory][selectedArea][selectedServiceType][
            selectedComplexity
          ].horas;
        hoursInput.value = horas;
      }
    });
  }

  let funcionalidadeIndex = 0;
  document
    .getElementById("addFeatureBtn")
    .addEventListener("click", function () {
      adicionarFuncionalidadeCampos(funcionalidadeIndex);
      funcionalidadeIndex++;
    });
}

initializeForm();
