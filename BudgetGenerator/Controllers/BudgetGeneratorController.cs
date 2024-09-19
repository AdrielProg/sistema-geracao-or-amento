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
            if (featureModel.Features == null || featureModel.Features.Count == 0)
            {
                ModelState.AddModelError("", "Nenhuma funcionalidade foi adicionada.");
                return View("ShowReportPage", featureModel);
            }

            var reportModel = _reportService.GenerateReportModel(featureModel);

            if (format == "pdf")
            {
                var pdfBytes = _reportService.GeneratePdf(reportModel, ControllerContext);
                return File(pdfBytes, "application/pdf", "RelatorioBudgetGenerator.pdf");
            }
            else if (format == "docx")
            {
                var memoryStream = _reportService.GenerateDocx(reportModel);
                return File(memoryStream.ToArray(), "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "RelatorioBudgetGenerator.docx");
            }
            return BadRequest("Formato inválido.");
        }

    }
}
