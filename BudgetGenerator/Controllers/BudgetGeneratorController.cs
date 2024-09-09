
using BudgetGenerator.Models;
using BudgetGenerator.Services;
using Microsoft.AspNetCore.Mvc;

using Rotativa.AspNetCore;

namespace BudgetGenerator.Controllers
{
    [Route("[controller]")]
    public class BudgetGeneratorController : Controller
    {

        private readonly ILogger<BudgetGeneratorController> _logger;

        public BudgetGeneratorController(ILogger<BudgetGeneratorController> logger)
        {
            _logger = logger;
        }
        [HttpGet]
        public IActionResult ShowReportPage()
        {
            return View();
        }

        [HttpPost]
        public IActionResult GenerateReport(ReportInputModel featureModel)
        {
            if (featureModel.Features == null || featureModel.Features.Count == 0)
            {
                ModelState.AddModelError("", "Nenhuma funcionalidade foi adicionada.");
                return View("ShowReportPage", featureModel);
            }

            // Gera o PDF com os dados fornecidos pelo usuário
            var reportModel = new ReportModel
            {
                ReportTitle = featureModel.ReportTitle,
                Features = featureModel.Features
            };

            return new ViewAsPdf("Report", reportModel)
            {
                FileName = "RelatorioBudgetGenerator.pdf"
            };
        }

    }
}