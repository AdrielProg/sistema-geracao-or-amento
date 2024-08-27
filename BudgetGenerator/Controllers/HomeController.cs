using BudgetGenerator.Models;
using BudgetGenerator.Services;
using Microsoft.AspNetCore.Mvc;
using Rotativa.AspNetCore;
using Newtonsoft.Json.Linq;

namespace BudgetGenerator.Controllers
{
    public class HomeController : Controller
    {
        private readonly MatrixService _matrixService;

        public HomeController()
        {
            _matrixService = new MatrixService();
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public IActionResult GenerateReport(ReportInputModel input)
        {
            if (input.Features == null || !input.Features.Any())
            {
                ModelState.AddModelError("", "Nenhuma funcionalidade foi adicionada.");
                return View("Index", input);
            }

            // Carregar a matriz de horas do JSON
            var matrixData = _matrixService.LoadMatrixData();
            if (matrixData == null)
            {
                throw new Exception("Matriz de horas não foi carregada.");
            }

            // Vamos iterar por cada funcionalidade
            var features = new List<FeatureModel>();
            foreach (var feature in input.Features)
            {
                if (feature.Services == null || !feature.Services.Any())
                {
                    continue;
                }

                var services = new List<ServiceModel>();
                foreach (var service in feature.Services)
                {
                    string category = service.Category.ToLower();
                    string area = service.Area.ToLower();
                    string serviceType = service.ServiceType.ToLower();
                    string complexity = service.Complexity.ToString().ToLower();

                    // Navegar na estrutura do JSON para encontrar as horas
                    var categoryToken = matrixData.SelectToken(category);
                    if (categoryToken == null)
                    {
                        throw new Exception($"A categoria '{category}' não foi encontrada na matriz de horas.");
                    }

                    var areaToken = categoryToken.SelectToken(area);
                    if (areaToken == null)
                    {
                        throw new Exception($"A área '{area}' não foi encontrada na categoria '{category}'.");
                    }

                    var serviceToken = areaToken.SelectToken(serviceType);
                    if (serviceToken == null)
                    {
                        throw new Exception($"O tipo de serviço '{serviceType}' não foi encontrado na área '{area}'.");
                    }

                    var complexityToken = serviceToken.SelectToken(complexity);
                    if (complexityToken == null)
                    {
                        throw new Exception($"A complexidade '{complexity}' não foi encontrada no tipo de serviço '{serviceType}'.");
                    }

                    // Buscar horas na matriz de horas
                    int hours = (int)complexityToken["horas"];

                    // Adicionar o serviço com as horas calculadas
                    services.Add(new ServiceModel
                    {
                        ServiceType = service.ServiceType,
                        Complexity = service.Complexity,
                        Category = service.Category,
                        Area = service.Area,
                        Hours = hours
                    });
                }

                // Adicionar a funcionalidade à lista
                features.Add(new FeatureModel
                {
                    Name = feature.Name,
                    Description = feature.Description,
                    Services = services
                });
            }

            // Preparar o modelo de dados para a View
            var reportModel = new ReportModel
            {
                Features = features
            };

            // Retornar o PDF gerado
            return new ViewAsPdf("Report", reportModel)
            {
                FileName = "RelatorioBudgetGenerator.pdf"
            };
        }
    }
}
