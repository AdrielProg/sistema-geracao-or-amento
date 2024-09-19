using BudgetGenerator.Models;
using Microsoft.AspNetCore.Mvc;
using BudgetGenerator.Services;

namespace BudgetGenerator.Controllers
{
    [Route("[controller]")]
    public class BudgetGeneratorController : Controller
    {
        private readonly ILogger<BudgetGeneratorController> _logger;
        private readonly IReportService _reportService;

        public BudgetGeneratorController(ILogger<BudgetGeneratorController> logger, IReportService reportService)
        {
            _logger = logger;
            _reportService = reportService;
        }

        [HttpGet("Footer")]
        public IActionResult Footer()
        {
            return PartialView("_Footer");  // Ajusta o caminho da view
        }

        [HttpGet]
        public IActionResult ShowReportPage()
        {
            return View();
        }

        [HttpPost]
        public IActionResult GenerateReport(ReportInputModel featureModel, string format)
        {
            // Verifica se o ModelState é válido
            if (!ModelState.IsValid)
            {
                // Retorna à view com os erros
                return View("ShowReportPage", featureModel);
            }

            if (featureModel.Features == null || featureModel.Features.Count == 0)
            {
                ModelState.AddModelError("", "Nenhuma funcionalidade foi adicionada.");
                return View("ShowReportPage", featureModel);
            }

            // Gera o modelo do relatório
            var reportModel = _reportService.GenerateReportModel(featureModel);

            // Geração do PDF
            if (format == "pdf")
            {
                var pdfBytes = _reportService.GeneratePdf(reportModel, ControllerContext);
                return File(pdfBytes, "application/pdf", "RelatorioBudgetGenerator.pdf");
            }
            // Geração do DOCX
            else if (format == "docx")
            {
                var memoryStream = _reportService.GenerateDocx(reportModel);
                return File(memoryStream.ToArray(), "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "RelatorioBudgetGenerator.docx");
            }

            // Caso o formato seja inválido
            return BadRequest("Formato inválido.");
        }

    }
}
