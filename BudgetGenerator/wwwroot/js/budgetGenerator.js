let featuresList = []; // Lista global para armazenar as features e serviços
let serviceMatrix = {};

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
  featuresList = [];

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
      <span class="remove-feature-btn">&times;</span>
    </div>
    <div>
      <label for="nomeFuncionalidade">Nome:</label>
      <input type="text" name="Features[${funcionalidadeIndex}].Name"  
             data-val="true" 
             data-val-required="O nome é obrigatório." />
      <span class="error-message" data-valmsg-for="Features[${funcionalidadeIndex}].Name"></span>
    </div>
    <div>
      <label for="descricaoFuncionalidade">Descrição:</label>
      <textarea name="Features[${funcionalidadeIndex}].Description" rows="3" 
                data-val="true"
                data-val-required="A descrição é obrigatória."></textarea>
      <span class="error-message" data-valmsg-for="Features[${funcionalidadeIndex}].Description"></span>
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
      saveFormState(); // Salva o estado após remover a funcionalidade
    });

  funcionalidadeContainer
    .querySelector(".add-service-btn")
    .addEventListener("click", function () {
      adicionarServicos(funcionalidadeContainer, funcionalidadeIndex);
    });

  reindexFeaturesAndServices();
  saveFormState(); // Salva o estado logo após adicionar a funcionalidade

  // Reaplica a validação unobtrusive para os novos campos adicionados dinamicamente
}
// Função para salvar o estado do formulário no localStorage
function saveFormState() {
  reindexFeaturesAndServices(); // Atualiza a lista de features e serviços

  const formState = {
    reportTitle: document.getElementById("reportTitle").value,
    analysisHours: document.getElementById("analysisHours").value,
    features: featuresList,
  };

  // Salva os dados no localStorage
  localStorage.setItem("formState", JSON.stringify(formState));
}

// Função para salvar periodicamente
function autoSaveForm() {
  setInterval(saveFormState, 5000); // Salva a cada 5 segundos
}

// Função para restaurar o estado do formulário do localStorage

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

// Chama a função para restaurar o estado ao carregar a página
window.onload = function () {
  restoreFormState();
  autoSaveForm(); // Inicia o autosave
};

// Event listeners para adicionar funcionalidades e gerar relatório
document.getElementById("addFeatureBtn").addEventListener("click", function () {
  const funcionalidadeIndex = featuresList.length;
  adicionarFuncionalidadeCampos(funcionalidadeIndex);
});

document
  .getElementById("generatePdfButton")
  .addEventListener("click", function (e) {
    e.preventDefault();
    exportarRelatorio();
  });

document
  .getElementById("generateDocxButton")
  .addEventListener("click", function (e) {
    e.preventDefault();
    exportarRelatorio();
  });

// Carrega a matriz de horas ao iniciar
fetchServiceMatrix();

$(document).ready(function () {
  // Inicializa a validação unobtrusive para garantir que os campos sejam validados corretamente

  // Função para verificar se o formulário está válido antes de submeter
  function validarFormularioAntesDeSubmeter(e) {
    const form = $("#formReport");

    // Verifica se o formulário é válido
    if (!form.valid()) {
      e.preventDefault(); // Impede a submissão do formulário se houver erros
      alert("Há campos que precisam ser preenchidos corretamente."); // Alerta opcional
    }
  }

  $("#generatePdfButton").click(function (e) {
    if (!validarCamposFuncionalidades()) {
      e.preventDefault();
      exportarRelatorio();
    } else {
      document.getElementById("formatInput").value = "pdf";
    }
  });

  $("#generateDocxButton").click(function (e) {
    if (!validarCamposFuncionalidades()) {
      e.preventDefault();
      exportarRelatorio();
    } else {
      document.getElementById("formatInput").value = "docx";
    }
  });

  // Event listener para o botão de reset
  $("#resetButton").click(function () {
    if (
      confirm(
        "Tem certeza que deseja resetar o formulário? Todos os dados serão perdidos."
      )
    ) {
      resetForm();
    }
  });

  function validarCamposFuncionalidades() {
    let camposValidos = true;
    $(".feature").each(function () {
      const nomeFuncionalidade = $(this).find("input[name*='Name']").val();
      const descricaoFuncionalidade = $(this)
        .find("textarea[name*='Description']")
        .val();

      if (!nomeFuncionalidade || !descricaoFuncionalidade) {
        camposValidos = false;
        alert(
          "Todos os campos de 'Nome' e 'Descrição' das funcionalidades devem ser preenchidos."
        );
        $(this).find("input[name*='Name']").focus(); // Foca no primeiro campo inválido
        return false; // Para o loop assim que encontrar um campo inválido
      }
    });
    return camposValidos;
  }

  // Função para resetar o formulário e limpar o localStorage
  function resetForm() {
    console.log("fui clicado'");
    // Remove os dados salvos no localStorage
    localStorage.removeItem("formState");

    // Reseta os campos do formulário
    document.getElementById("formReport").reset();

    // Limpa o container de funcionalidades
    document.getElementById("feature-container").innerHTML = "";

    // Reseta a lista de funcionalidades
    featuresList = [];
  }

  // Carrega a matriz de horas ao iniciar
  fetchServiceMatrix();
  autoSaveForm(); // Inicia o autosave
});

function restoreFormState() {
  const savedState = localStorage.getItem("formState");
  reindexFeaturesAndServices();

  if (savedState) {
    const formState = JSON.parse(savedState);

    // Restaura o título do relatório e horas de análise
    document.getElementById("reportTitle").value = formState.reportTitle;
    document.getElementById("analysisHours").value = formState.analysisHours;

    // Restaura as funcionalidades e serviços
    formState.features.forEach((feature, index) => {
      adicionarFuncionalidadeCampos(index); // Adiciona a funcionalidade

      const featureContainer = document.querySelector(
        `.feature[data-funcionalidade-index="${index}"]`
      );

      // Preenche os campos de cada funcionalidade
      featureContainer.querySelector("input[name^='Features']").value =
        feature.name;
      featureContainer.querySelector("textarea[name^='Features']").value =
        feature.description;

      // Preenche os serviços
      feature.services.forEach((service, serviceIndex) => {
        adicionarServicos(featureContainer, index); // Adiciona os serviços corretamente

        const serviceDiv =
          featureContainer.querySelectorAll(".service")[serviceIndex]; // Pega o serviço correto
        if (serviceDiv) {
          serviceDiv.querySelector("select[name$='.Category']").value =
            service.category;
          serviceDiv.querySelector("select[name$='.Area']").value =
            service.area;
          serviceDiv.querySelector("select[name$='.ServiceType']").value =
            service.serviceType;
          serviceDiv.querySelector("select[name$='.Complexity']").value =
            service.complexity;
          serviceDiv.querySelector("input[name$='.Hours']").value =
            service.hours;
        }
      });

      // Atualiza o índice de serviços após a restauração
      featureContainer
        .querySelector(".servicesContainer")
        .setAttribute("data-service-index", feature.services.length);
    });

    // Reindexa as funcionalidades e serviços após restaurar
    reindexFeaturesAndServices();
  }
}
