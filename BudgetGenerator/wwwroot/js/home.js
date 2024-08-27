async function fetchServiceMatrix() {
  const response = await fetch("/data/matriz_horas.json");
  const matrixData = await response.json();
  console.log("Matriz de Horas Carregada:", matrixData);
  return matrixData;
}

// Funções para popular os campos de serviço
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

async function initializeForm() {
  console.log("Iniciando formulário");
  const serviceMatrix = await fetchServiceMatrix();

  document
    .getElementById("startReportBtn")
    .addEventListener("click", function () {
      console.log("Iniciar Novo Relatório clicado");
      document.getElementById("formFuncionalidades").style.display = "block";
      document.getElementById("addFuncionalidadeBtn").style.display = "block";
      document.getElementById("startReportBtn").style.display = "none";

      const funcionalidadeContainer = document.getElementById(
        "funcionalidadesContainer"
      );
      const funcionalidadeDiv = document.createElement("div");
      funcionalidadeDiv.className = "funcionalidade";
      funcionalidadeDiv.innerHTML = `
            <label>Nome da Funcionalidade:</label>
            <input type="text" id="nomeFuncionalidade" />
            <label>Descrição:</label>
            <textarea id="descricaoFuncionalidade" rows="3" cols="40"></textarea>
        `;
      funcionalidadeContainer.appendChild(funcionalidadeDiv);

      console.log("Campos para cadastrar nova funcionalidade exibidos");
      document.getElementById("addFuncionalidadeBtn").style.display = "block";
    });

  let funcionalidadeIndex = 0;
  document
    .getElementById("addFuncionalidadeBtn")
    .addEventListener("click", function () {
      const nomeFuncionalidade =
        document.getElementById("nomeFuncionalidade").value;
      const descricaoFuncionalidade = document.getElementById(
        "descricaoFuncionalidade"
      ).value;

      console.log(
        "Tentando cadastrar funcionalidade:",
        nomeFuncionalidade,
        descricaoFuncionalidade
      );

      if (!nomeFuncionalidade) {
        alert("Por favor, insira o nome da funcionalidade.");
        console.log("Falha: Nome da funcionalidade não inserido");
        return;
      }

      // Substituir o campo de nome da funcionalidade para permitir adicionar serviços
      const container = document.getElementById("funcionalidadesContainer");
      const funcionalidadeDiv = document.createElement("div");
      funcionalidadeDiv.className = "funcionalidade";
      funcionalidadeDiv.setAttribute(
        "data-funcionalidade-index",
        funcionalidadeIndex
      );
      funcionalidadeDiv.innerHTML = `
            <h3>Funcionalidade ${
              funcionalidadeIndex + 1
            }: ${nomeFuncionalidade}</h3>
            <p>Descrição: ${descricaoFuncionalidade}</p>
            <div class="servicesContainer" data-service-index="0"></div>
            <button type="button" class="addServiceBtn">Adicionar Serviço</button>
        `;
      container.appendChild(funcionalidadeDiv);

      console.log("Funcionalidade adicionada:", funcionalidadeDiv);

      document.getElementById("addFuncionalidadeBtn").style.display = "none";
      document.getElementById("addNovaFuncionalidadeBtn").style.display =
        "block";

      funcionalidadeIndex++;

      const addServiceBtn = funcionalidadeDiv.querySelector(".addServiceBtn");
      addServiceBtn.addEventListener("click", function () {
        const servicesContainer =
          funcionalidadeDiv.querySelector(".servicesContainer");
        let serviceIndex = parseInt(
          servicesContainer.getAttribute("data-service-index")
        );

        console.log(
          "Adicionando serviço para a funcionalidade",
          funcionalidadeIndex - 1
        );

        const serviceDiv = document.createElement("div");
        serviceDiv.className = "service";
        serviceDiv.innerHTML = `
                <label>Categoria:</label>
                <select name="Features[${
                  funcionalidadeIndex - 1
                }].Services[${serviceIndex}].Category" class="categorySelect">
                    <option value="">Selecione</option>
                    <option value="Operacoes">Operações</option>
                    <option value="Integracoes">Integrações</option>
                    <option value="Testes">Testes</option>
                </select>

                <label>Área:</label>
                <select name="Features[${
                  funcionalidadeIndex - 1
                }].Services[${serviceIndex}].Area" class="areaSelect">
                    <option value=""></option>
                </select>

                <label>Tipo de Serviço:</label>
                <select name="Features[${
                  funcionalidadeIndex - 1
                }].Services[${serviceIndex}].ServiceType" class="serviceTypeSelect">
                    <option value="">Selecione</option>
                </select>

                <label>Complexidade:</label>
                <select name="Features[${
                  funcionalidadeIndex - 1
                }].Services[${serviceIndex}].Complexity">
                    <option value="facil">Fácil</option>
                    <option value="medio">Médio</option>
                    <option value="complexo">Complexo</option>
                </select>
            `;
        servicesContainer.appendChild(serviceDiv);

        console.log("Serviço adicionado:", serviceDiv);

        serviceIndex++;
        servicesContainer.setAttribute("data-service-index", serviceIndex);

        const newCategorySelect = serviceDiv.querySelector(".categorySelect");
        const newAreaSelect = serviceDiv.querySelector(".areaSelect");
        const newServiceTypeSelect =
          serviceDiv.querySelector(".serviceTypeSelect");

        newCategorySelect.addEventListener("change", function () {
          const selectedCategory = newCategorySelect.value;
          console.log("Categoria de serviço selecionada:", selectedCategory);
          if (selectedCategory) {
            populateAreaSelect(newAreaSelect, serviceMatrix, selectedCategory);
          }
        });

        newAreaSelect.addEventListener("change", function () {
          const selectedCategory = newCategorySelect.value;
          const selectedArea = newAreaSelect.value;
          console.log("Área de serviço selecionada:", selectedArea);
          if (selectedCategory && selectedArea) {
            populateServiceTypeSelect(
              newServiceTypeSelect,
              serviceMatrix,
              selectedCategory,
              selectedArea
            );
          }
        });
      });

      document.querySelector('button[type="submit"]').style.display = "block";
    });

  // Botão para cadastrar uma nova funcionalidade
  document
    .getElementById("addNovaFuncionalidadeBtn")
    .addEventListener("click", function () {
      const funcionalidadeContainer = document.getElementById(
        "funcionalidadesContainer"
      );
      const funcionalidadeDiv = document.createElement("div");
      funcionalidadeDiv.className = "funcionalidade";
      funcionalidadeDiv.innerHTML = `
            <label>Nome da Funcionalidade:</label>
            <input type="text" id="nomeFuncionalidade" />
            <label>Descrição:</label>
            <textarea id="descricaoFuncionalidade" rows="3" cols="40"></textarea>
        `;
      funcionalidadeContainer.appendChild(funcionalidadeDiv);

      console.log("Pronto para cadastrar nova funcionalidade");

      document.getElementById("addFuncionalidadeBtn").style.display = "block";
      document.getElementById("addNovaFuncionalidadeBtn").style.display =
        "none";
    });
}

initializeForm();
