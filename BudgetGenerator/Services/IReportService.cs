using BudgetGenerator.Models;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace BudgetGenerator.Services
{
    public interface IReportService
    {
        byte[] GeneratePdf(ReportModel reportModel, ControllerContext controllerContext);
        MemoryStream GenerateDocx(ReportModel reportModel);
    }
}
