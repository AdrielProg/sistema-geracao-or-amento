let featuresList = []; // Lista global para armazenar as features e serviços
let serviceMatrix = {}; // Matriz de horas carregada

// Carrega a matriz de horas ao iniciar a página
async function fetchServiceMatrix() {
  try {
    const response = await fetch("/data/matriz_horas.json");
    serviceMatrix = await response.json();
    console.log("Matriz de Horas Carregada:", serviceMatrix);
  } catch (error) {
    console.error("Erro ao carregar a Matriz de Horas:", error);
  }
}

// Popula os selects dinamicamente
function populateAreaSelect(selectElement, category) {
  selectElement.innerHTML = '<option value="">Selecione</option>';
  const areas = serviceMatrix[category.toLowerCase()];
  for (let area in areas) {
    const option = document.createElement("option");
    option.value = area;
    option.textContent = area.charAt(0).toUpperCase() + area.slice(1);
    selectElement.appendChild(option);
  }
}

function populateServiceTypeSelect(selectElement, category, area) {
  selectElement.innerHTML = '<option value="">Selecione</option>';
  const services = serviceMatrix[category.toLowerCase()][area.toLowerCase()];
  for (let service in services) {
    const option = document.createElement("option");
    option.value = service;
    option.textContent = service.charAt(0).toUpperCase() + service.slice(1);
    selectElement.appendChild(option);
  }
}

function populateComplexitySelect(selectElement, category, area, serviceType) {
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
}

// Atualiza a lista de features e serviços com base nos campos do formulário
function reindexFeaturesAndServices() {
  const allFeatures = document.querySelectorAll(".feature");
  featuresList = []; // Resetar a lista de features

  allFeatures.forEach((featureDiv, featureIndex) => {
    // Atualiza os índices das funcionalidades no DOM
    featureDiv.querySelector("h2").textContent = `Funcionalidade ${
      featureIndex + 1
    }`;
    featureDiv.querySelector(
      "input[name^='Features']"
    ).name = `Features[${featureIndex}].Name`;
    featureDiv.querySelector(
      "textarea[name^='Features']"
    ).name = `Features[${featureIndex}].Description`;

    const featureName = featureDiv.querySelector(
      "input[name^='Features']"
    ).value;
    const featureDescription = featureDiv.querySelector(
      "textarea[name^='Features']"
    ).value;

    const feature = {
      name: featureName,
      description: featureDescription,
      services: [],
    };

    // Reindexar os serviços dentro dessa feature
    const allServices = featureDiv.querySelectorAll(".service");
    allServices.forEach((serviceDiv, serviceIndex) => {
      // Atualiza os índices dos serviços no DOM
      serviceDiv.querySelector(
        "select[name$='.Category']"
      ).name = `Features[${featureIndex}].Services[${serviceIndex}].Category`;
      serviceDiv.querySelector(
        "select[name$='.Area']"
      ).name = `Features[${featureIndex}].Services[${serviceIndex}].Area`;
      serviceDiv.querySelector(
        "select[name$='.ServiceType']"
      ).name = `Features[${featureIndex}].Services[${serviceIndex}].ServiceType`;
      serviceDiv.querySelector(
        "select[name$='.Complexity']"
      ).name = `Features[${featureIndex}].Services[${serviceIndex}].Complexity`;
      serviceDiv.querySelector(
        "input[name$='.Hours']"
      ).name = `Features[${featureIndex}].Services[${serviceIndex}].Hours`;

      const serviceCategory = serviceDiv.querySelector(
        "select[name$='.Category']"
      ).value;
      const serviceArea = serviceDiv.querySelector(
        "select[name$='.Area']"
      ).value;
      const serviceType = serviceDiv.querySelector(
        "select[name$='.ServiceType']"
      ).value;
      const serviceComplexity = serviceDiv.querySelector(
        "select[name$='.Complexity']"
      ).value;
      const serviceHours = serviceDiv.querySelector(
        "input[name$='.Hours']"
      ).value;

      const service = {
        category: serviceCategory,
        area: serviceArea,
        serviceType: serviceType,
        complexity: serviceComplexity,
        hours: serviceHours,
      };

      feature.services.push(service);
    });

    featuresList.push(feature);
  });
}

// Função para adicionar funcionalidade
function adicionarFuncionalidadeCampos(funcionalidadeIndex) {
  const funcionalidadeContainer = document.createElement("div");
  funcionalidadeContainer.className = "feature";
  funcionalidadeContainer.setAttribute(
    "data-funcionalidade-index",
    funcionalidadeIndex
  );

  funcionalidadeContainer.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h2>Funcionalidade ${funcionalidadeIndex + 1}</h2>
      <button type="button" class="remove-feature-btn">&times;</button>
    </div>
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

  funcionalidadeContainer
    .querySelector(".remove-feature-btn")
    .addEventListener("click", function () {
      funcionalidadeContainer.remove();
      reindexFeaturesAndServices();
    });

  funcionalidadeContainer
    .querySelector(".add-service-btn")
    .addEventListener("click", function () {
      adicionarServicos(funcionalidadeContainer, funcionalidadeIndex);
    });

  reindexFeaturesAndServices();
}

// Função para adicionar serviços
function adicionarServicos(funcionalidadeDiv, funcionalidadeIndex) {
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
      <input type="number" name="Features[${funcionalidadeIndex}].Services[${serviceIndex}].Hours" min="1" />
    </div>
    <div class="remove-btn-container">
      <button type="button" class="remove-service-btn">Remover Serviço</button>
    </div>
  `;

  const prevLastService = servicesContainer.querySelector(
    ".last-added-service"
  );
  if (prevLastService) {
    prevLastService.classList.remove("last-added-service");
  }

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
      populateAreaSelect(areaSelect, selectedCategory);
    }
  });

  areaSelect.addEventListener("change", function () {
    const selectedCategory = categorySelect.value;
    const selectedArea = areaSelect.value;
    if (selectedCategory && selectedArea) {
      populateServiceTypeSelect(
        serviceTypeSelect,
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

  serviceDiv
    .querySelector(".remove-service-btn")
    .addEventListener("click", function () {
      serviceDiv.remove();
      reindexLastAddedService(servicesContainer);
      reindexFeaturesAndServices();
    });

  reindexFeaturesAndServices();
}

function reindexLastAddedService(servicesContainer) {
  const allServices = servicesContainer.querySelectorAll(".service");
  if (allServices.length > 0) {
    const lastService = allServices[allServices.length - 1];
    lastService.classList.add("last-added-service");
  }
}
// Função para exportar o relatório
function exportarRelatorio() {
  reindexFeaturesAndServices();
  const form = document.getElementById("formReport");

  const reportInputModel = {
    ReportTitle: document.getElementById("reportTitle").value,
    Features: featuresList,
  };

  if (featuresList.length === 0) {
    alert("Nenhuma funcionalidade foi adicionada.");
    return;
  }

  console.log(
    "Dados do relatório antes da submissão:",
    JSON.stringify(reportInputModel, null, 2)
  );

  const hiddenInput = document.createElement("input");
  hiddenInput.type = "hidden";
  hiddenInput.name = "inputModel";
  hiddenInput.value = JSON.stringify(reportInputModel);

  form.appendChild(hiddenInput);
  form.submit();
}

// Event listeners para adicionar funcionalidades e gerar relatório
document.getElementById("addFeatureBtn").addEventListener("click", function () {
  const funcionalidadeIndex = featuresList.length;
  adicionarFuncionalidadeCampos(funcionalidadeIndex);
});

document
  .getElementById("generatePdfButton")
  .addEventListener("click", function (e) {
    e.preventDefault(); // Previne o comportamento padrão
    exportarRelatorio();
  });

document
  .getElementById("generateDocxButton")
  .addEventListener("click", function (e) {
    e.preventDefault(); // Previne o comportamento padrão
    exportarRelatorio();
  });

// Carrega a matriz de horas ao iniciar
fetchServiceMatrix();
