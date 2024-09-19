using BudgetGenerator.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.IO;

namespace BudgetGenerator.Services
{
    public interface IReportService
    {
        byte[] GeneratePdf(ReportModel reportModel, ControllerContext controllerContext);
        MemoryStream GenerateDocx(ReportModel reportModel);
        ReportModel GenerateReportModel(ReportInputModel featureModel);
        public JObject LoadReferenceMatrix();
    }
}
