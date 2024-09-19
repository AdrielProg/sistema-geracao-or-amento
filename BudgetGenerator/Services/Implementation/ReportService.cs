using BudgetGenerator.Models;
using Rotativa.AspNetCore;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using DocumentFormat.OpenXml;
using A = DocumentFormat.OpenXml.Drawing;
using DW = DocumentFormat.OpenXml.Drawing.Wordprocessing;
using PIC = DocumentFormat.OpenXml.Drawing.Pictures;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace BudgetGenerator.Services.Implementation
{
    public class ReportService : IReportService
    {
        private readonly IWebHostEnvironment _hostingEnvironment;

        public ReportService(IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;

        }

        public byte[] GeneratePdf(ReportModel reportModel, ControllerContext controllerContext)
        {

            string footerPath = Path.Combine(_hostingEnvironment.ContentRootPath, "Views", "Shared", "Footer.html");

            string customSwitches = $"--footer-html \"file:///{footerPath}\"";


            var pdf = new ViewAsPdf("Report", reportModel)
            {
                FileName = "RelatorioBudgetGenerator.pdf",
                CustomSwitches = customSwitches
            };

            return pdf.BuildFile(controllerContext).Result;
        }
        public JObject LoadReferenceMatrix()
        {
            string matrixFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "data", "matriz_horas.json");
            string jsonContent = File.ReadAllText(matrixFilePath);


            JObject referenceMatrix = JObject.Parse(jsonContent);

            return referenceMatrix;
        }

        public ReportModel GenerateReportModel(ReportInputModel featureModel)
        {
            var referenceMatrix = LoadReferenceMatrix();

            var reportModel = new ReportModel
            {
                ReportTitle = featureModel.ReportTitle,
                Features = featureModel.Features,
                AnalysisHours = featureModel.AnalysisHours,
                ReferenceMatrix = referenceMatrix
            };

            return reportModel;
        }



        public MemoryStream GenerateDocx(ReportModel reportModel)
        {
            var memoryStream = new MemoryStream();
            using (var wordDocument = WordprocessingDocument.Create(memoryStream,
                                                                    WordprocessingDocumentType.Document,
                                                                     true))
            {
                MainDocumentPart mainPart = wordDocument.AddMainDocumentPart();
                mainPart.Document = new Document();
                Body body = new Body();

                // Chama o método que formata o documento
                FormatDOCX(reportModel, body, mainPart);

                mainPart.Document.Append(body);
                mainPart.Document.Save();
            }

            memoryStream.Seek(0, SeekOrigin.Begin);
            return memoryStream;
        }

        private void FormatDOCX(ReportModel reportModel, Body body, MainDocumentPart mainPart)
        {
            // Adiciona o logo ao documento
            AddLogo(body, mainPart);

            // Título do relatório
            var titleParagraph = new DocumentFormat.OpenXml.Wordprocessing.Paragraph(
                new Run(new Text(reportModel.ReportTitle))
            );
            titleParagraph.ParagraphProperties = new ParagraphProperties
            {
                Justification = new Justification { Val = JustificationValues.Center },
                SpacingBetweenLines = new SpacingBetweenLines { After = "200" }
            };
            body.AppendChild(titleParagraph);

            // Seção de funcionalidades e serviços
            int featureCounter = 1;
            foreach (var feature in reportModel.Features)
            {
                // Nome da funcionalidade e total de horas
                var featureParagraph = new DocumentFormat.OpenXml.Wordprocessing.Paragraph(
                    new Run(new Text($"Funcionalidade {featureCounter}: {feature.Name} ({feature.AmountHours} Horas)"))
                );
                featureParagraph.ParagraphProperties = new ParagraphProperties
                {
                    SpacingBetweenLines = new SpacingBetweenLines { Before = "200", After = "100" }
                };
                body.AppendChild(featureParagraph);

                // Serviços listados
                var serviceList = feature.Services.Select(s => $"{s.ServiceType} {s.Complexity}").ToList();
                var serviceListParagraph = new DocumentFormat.OpenXml.Wordprocessing.Paragraph(
                    new Run(new Text(string.Join(" + ", serviceList)))
                );
                serviceListParagraph.ParagraphProperties = new ParagraphProperties
                {
                    Indentation = new Indentation { Left = "720" } // Indenta os serviços
                };
                body.AppendChild(serviceListParagraph);

                // Descrição da funcionalidade
                var descriptionParagraph = new DocumentFormat.OpenXml.Wordprocessing.Paragraph(
                    new Run(new Text($"Descrição: {feature.Description}"))
                );
                descriptionParagraph.ParagraphProperties = new ParagraphProperties
                {
                    SpacingBetweenLines = new SpacingBetweenLines { Before = "100", After = "200" }
                };
                body.AppendChild(descriptionParagraph);

                featureCounter++;
            }

            // Total de horas do projeto
            var totalHoursParagraph = new DocumentFormat.OpenXml.Wordprocessing.Paragraph(
                new Run(new Text($"Total de Horas do Projeto: {reportModel.GetBudgetedDevelopmentHours}"))
            );
            totalHoursParagraph.ParagraphProperties = new ParagraphProperties
            {
                Justification = new Justification { Val = JustificationValues.Right },
                SpacingBetweenLines = new SpacingBetweenLines { Before = "300" }
            };
            body.AppendChild(totalHoursParagraph);
        }

        private void AddLogo(Body body, MainDocumentPart mainPart)
        {
            // Caminho para a imagem do logo no diretório wwwroot/images/logo-report.jpg
            string imagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "logo-report.jpg");

            // Adiciona a imagem ao documento
            ImagePart imagePart = mainPart.AddImagePart(ImagePartType.Jpeg);
            using (FileStream stream = new FileStream(imagePath, FileMode.Open))
            {
                imagePart.FeedData(stream);
            }

            // Obtém as dimensões reais da imagem
            using (System.Drawing.Image image = System.Drawing.Image.FromFile(imagePath))
            {
                long imageWidthEmus = (long)(image.Width * 4500);
                long imageHeightEmus = (long)(image.Height * 4500);

                // Relaciona a imagem no documento
                string relationshipId = mainPart.GetIdOfPart(imagePart);

                // Adiciona a imagem ao parágrafo
                var drawing = new Drawing(
                    new DW.Inline(
                        new DW.Extent { Cx = imageWidthEmus, Cy = imageHeightEmus }, // Mantém o tamanho original
                        new DW.EffectExtent
                        {
                            LeftEdge = 0L,
                            TopEdge = 0L,
                            RightEdge = 0L,
                            BottomEdge = 0L
                        },
                        new DW.DocProperties
                        {
                            Id = (UInt32Value)1U,
                            Name = "Picture 1"
                        },
                        new DW.NonVisualGraphicFrameDrawingProperties(new A.GraphicFrameLocks { NoChangeAspect = true }),
                        new A.Graphic(new A.GraphicData(
                            new PIC.Picture(
                                new PIC.NonVisualPictureProperties(
                                    new PIC.NonVisualDrawingProperties
                                    {
                                        Id = (UInt32Value)0U,
                                        Name = "logo-report.jpg"
                                    },
                                    new PIC.NonVisualPictureDrawingProperties()),
                                new PIC.BlipFill(
                                    new A.Blip
                                    {
                                        Embed = relationshipId,
                                        CompressionState = A.BlipCompressionValues.Print
                                    },
                                    new A.Stretch(new A.FillRectangle())),
                                new PIC.ShapeProperties(
                                    new A.Transform2D(
                                        new A.Offset { X = 0L, Y = 0L },
                                        new A.Extents { Cx = imageWidthEmus, Cy = imageHeightEmus }),
                                    new A.PresetGeometry(new A.AdjustValueList())
                                    { Preset = A.ShapeTypeValues.Rectangle })))
                        { Uri = "http://schemas.openxmlformats.org/drawingml/2006/picture" })
                    )
                    { DistanceFromTop = (UInt32Value)0U, DistanceFromBottom = (UInt32Value)0U, DistanceFromLeft = (UInt32Value)0U, DistanceFromRight = (UInt32Value)0U });

                // Cria o parágrafo para inserir a imagem
                var logoParagraph = new Paragraph(new Run(drawing))
                {
                    ParagraphProperties = new ParagraphProperties
                    {
                        Justification = new Justification { Val = JustificationValues.Center },
                        SpacingBetweenLines = new SpacingBetweenLines { After = "2450" } // Espaçamento pequeno após a imagem
                    }
                };

                body.AppendChild(logoParagraph);

                // Adiciona a linha e o texto "DOCUMENTAÇÃO FUNCIONAL DO SISTEMA"
                AddFooter(body);
            }
        }

        private void AddFooter(Body body)
        {
            // Adiciona a linha logo abaixo da imagem
            var lineParagraph = new DocumentFormat.OpenXml.Wordprocessing.Paragraph(new Run(new Text("")));

            // Cria o objeto de propriedades de parágrafo
            var paragraphProperties = new ParagraphProperties();

            // Cria a borda superior (linha)
            var paragraphBorders = new ParagraphBorders();
            var topBorder = new TopBorder
            {
                Val = BorderValues.Single,
                Size = 7,
                Color = "d2d2d2"
            };

            // Adiciona a borda superior ao objeto ParagraphBorders
            paragraphBorders.TopBorder = topBorder;

            // Adiciona a borda e o espaçamento ao parágrafo
            paragraphProperties.Append(paragraphBorders);
            paragraphProperties.SpacingBetweenLines = new SpacingBetweenLines { After = "1" }; // Pequeno espaçamento após a linha

            // Adiciona as propriedades ao parágrafo
            lineParagraph.ParagraphProperties = paragraphProperties;

            // Adiciona o parágrafo ao body
            body.AppendChild(lineParagraph);

            // Adiciona o texto "DOCUMENTAÇÃO FUNCIONAL DO SISTEMA" logo abaixo da linha
            var footerParagraph = new DocumentFormat.OpenXml.Wordprocessing.Paragraph(new Run())
            {
                ParagraphProperties = new ParagraphProperties
                {
                    Justification = new Justification { Val = JustificationValues.Right }, // Centraliza o texto
                    SpacingBetweenLines = new SpacingBetweenLines { After = "500" } // Pequeno espaçamento após o texto
                }
            };

            // Propriedades do texto do rodapé
            RunProperties footerRunProperties = new RunProperties { FontSize = new FontSize() { Val = "30" } };
            footerParagraph.AppendChild(new Run(footerRunProperties, new Text("DOCUMENTAÇÃO FUNCIONAL DO SISTEMA")));

            body.AppendChild(footerParagraph);
        }
    }
}
