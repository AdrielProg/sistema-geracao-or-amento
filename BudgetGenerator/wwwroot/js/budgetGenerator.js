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
    funcionalidadeContainer.className = "funcionalidade";
    funcionalidadeContainer.setAttribute(
      "data-funcionalidade-index",
      funcionalidadeIndex
    );

    funcionalidadeContainer.innerHTML = `
          <h3>Funcionalidade ${funcionalidadeIndex + 1}</h3>
          <div>
              <label for="nomeFuncionalidade">Nome da Funcionalidade:</label>
              <input type="text" name="Features[${funcionalidadeIndex}].Name" required />
          </div>
          <div>
              <label for="descricaoFuncionalidade">Descrição:</label>
              <textarea name="Features[${funcionalidadeIndex}].Description" rows="3" required></textarea>
          </div>
          <div class="servicesContainer" data-service-index="0">
              <h4>Serviços:</h4>
              <button type="button" class="addServiceBtn">Adicionar Serviço</button>
          </div>
      `;

    document
      .getElementById("funcionalidadesContainer")
      .appendChild(funcionalidadeContainer);

    // Adicionar evento de adicionar serviço
    funcionalidadeContainer
      .querySelector(".addServiceBtn")
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
       <div class="service">
          <div>
              <label>Categoria:</label>
              <select name="Features[${funcionalidadeIndex}].Services[${serviceIndex}].Category" class="categorySelect" required>
                  <option value="">Selecione</option>
                  <option value="operacoes">Operações</option>
                  <option value="integracoes">Integrações</option>
                  <option value="testes">Testes</option>
              </select>
          </div>
          <div>
          <label>Área:</label>
          <select name="Features[${funcionalidadeIndex}].Services[${serviceIndex}].Area" class="areaSelect" required>
          <option value="">Selecione</option>
          </select>
          </div>
          <div>
          <label>Tipo de Serviço:</label>
          <select name="Features[${funcionalidadeIndex}].Services[${serviceIndex}].ServiceType" class="serviceTypeSelect" required>
          <option value="">Selecione</option>
          </select>
          </div>
          <div>
          <label>Complexidade:</label>
          <select name="Features[${funcionalidadeIndex}].Services[${serviceIndex}].Complexity" class="complexitySelect" required>
          <option value="">Selecione</option>
          </select>
          </div>
          <div class="service-hours">
          <label>Horas:</label>
          <input type="number" name="Features[${funcionalidadeIndex}].Services[${serviceIndex}].Hours" min="1" readonly />
          </div>
        </div>
          `;

    servicesContainer.appendChild(serviceDiv);
    servicesContainer.setAttribute("data-service-index", ++serviceIndex);

    const categorySelect = serviceDiv.querySelector(".categorySelect");
    const areaSelect = serviceDiv.querySelector(".areaSelect");
    const serviceTypeSelect = serviceDiv.querySelector(".serviceTypeSelect");
    const complexitySelect = serviceDiv.querySelector(".complexitySelect");
    const hoursInput = serviceDiv.querySelector("input[name$='.Hours']");

    // Preencher áreas quando a categoria for selecionada
    categorySelect.addEventListener("change", function () {
      const selectedCategory = categorySelect.value;
      if (selectedCategory) {
        populateAreaSelect(areaSelect, serviceMatrix, selectedCategory);
      }
    });

    // Preencher tipos de serviço quando a área for selecionada
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

    // Preencher complexidade e horas quando o tipo de serviço for selecionado
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

    // Definir horas automaticamente quando a complexidade for selecionada
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

  // Evento de adicionar funcionalidade
  let funcionalidadeIndex = 0;
  document
    .getElementById("addFuncionalidadeBtn")
    .addEventListener("click", function () {
      adicionarFuncionalidadeCampos(funcionalidadeIndex);
      funcionalidadeIndex++;
    });
}

initializeForm();
