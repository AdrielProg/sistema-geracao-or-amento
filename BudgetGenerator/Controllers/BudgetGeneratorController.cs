using BudgetGenerator.Models;
using Microsoft.AspNetCore.Mvc;
using Rotativa.AspNetCore;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using System.IO;

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
        public IActionResult GenerateReport(ReportInputModel featureModel, string format)
        {
            if (featureModel.Features == null || featureModel.Features.Count == 0)
            {
                ModelState.AddModelError("", "Nenhuma funcionalidade foi adicionada.");
                return View("ShowReportPage", featureModel);
            }

            var reportModel = new ReportModel
            {
                ReportTitle = featureModel.ReportTitle,
                Features = featureModel.Features
            };

            if (format == "pdf")
            {
                // Gera o PDF com os dados fornecidos pelo usuário
                return new ViewAsPdf("Report", reportModel)
                {
                    FileName = "RelatorioBudgetGenerator.pdf"
                };
            }
            else if (format == "docx")
            {
                // Gera o DOCX com os dados fornecidos pelo usuário usando o Open XML SDK
                var memoryStream = GenerateDocx(reportModel);
                return File(memoryStream.ToArray(), "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "RelatorioBudgetGenerator.docx");
            }

            return BadRequest("Formato inválido.");
        }

        private MemoryStream GenerateDocx(ReportModel reportModel)
        {
            var memoryStream = new MemoryStream();

            // Cria um novo documento Word
            using (var wordDocument = WordprocessingDocument.Create(memoryStream, WordprocessingDocumentType.Document, true))
            {
                // Adiciona as partes principais ao documento
                MainDocumentPart mainPart = wordDocument.AddMainDocumentPart();
                mainPart.Document = new Document();
                Body body = new Body();

                // Adiciona o título ao documento
                var titleParagraph = new Paragraph(new Run(new Text(reportModel.ReportTitle)));
                titleParagraph.ParagraphProperties = new ParagraphProperties
                {
                    Justification = new Justification { Val = JustificationValues.Center }
                };
                body.AppendChild(titleParagraph);

                // Adiciona as funcionalidades e serviços ao documento
                foreach (var feature in reportModel.Features)
                {
                    // Funcionalidade
                    var featureParagraph = new Paragraph(new Run(new Text("Funcionalidade: " + feature.Name)));
                    featureParagraph.ParagraphProperties = new ParagraphProperties
                    {
                        SpacingBetweenLines = new SpacingBetweenLines { Before = "200", After = "200" }
                    };
                    body.AppendChild(featureParagraph);

                    // Descrição da Funcionalidade
                    var descriptionParagraph = new Paragraph(new Run(new Text("Descrição: " + feature.Description)));
                    body.AppendChild(descriptionParagraph);

                    // Serviços dentro da Funcionalidade
                    foreach (var service in feature.Services)
                    {
                        var serviceParagraph = new Paragraph(new Run(new Text($"Serviço: {service.ServiceType}, Complexidade: {service.Complexity}, Horas: {service.Hours}")));
                        body.AppendChild(serviceParagraph);
                    }
                }

                // Fecha o corpo do documento e salva
                mainPart.Document.Append(body);
                mainPart.Document.Save();
            }

            // Retorna o MemoryStream com o documento
            memoryStream.Seek(0, SeekOrigin.Begin);
            return memoryStream;
        }
    }
}
