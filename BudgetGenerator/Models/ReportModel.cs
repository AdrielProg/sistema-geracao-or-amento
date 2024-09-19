using System.ComponentModel.DataAnnotations;

namespace BudgetGenerator.Models
{
    public class ReportModel
    {

        public required string ReportTitle { get; set; }
        public List<FeatureModel> Features { get; set; } = new();
        public int AnalysisHours { get; set; }
        public required dynamic ReferenceMatrix { get; set; }


        public string CalculateTotalHoursPerItem(string category, string area, string serviceType)
        {
            var easyCount = Features.SelectMany(f => f.Services)
                .Count(s => s.Area.ToLower() == area.ToLower() && s.ServiceType.ToLower() == serviceType.ToLower() &&
                            s.Complexity.ToLower() == "facil" && s.Category.ToLower() == category.ToLower());

            var mediumCount = Features.SelectMany(f => f.Services)
                .Count(s => s.Area.ToLower() == area.ToLower() && s.ServiceType.ToLower() == serviceType.ToLower() &&
                            s.Complexity.ToLower() == "medio" && s.Category.ToLower() == category.ToLower());

            var complexCount = Features.SelectMany(f => f.Services)
                .Count(s => s.Area.ToLower() == area.ToLower() && s.ServiceType.ToLower() == serviceType.ToLower() &&
                            s.Complexity.ToLower() == "complexo" && s.Category.ToLower() == category.ToLower());

            var easyHours = (int?)ReferenceMatrix.SelectToken($"{category.ToLower()}.{area.ToLower()}.{serviceType.ToLower()}.facil.horas") ?? 0;
            var mediumHours = (int?)ReferenceMatrix.SelectToken($"{category.ToLower()}.{area.ToLower()}.{serviceType.ToLower()}.medio.horas") ?? 0;
            var complexHours = (int?)ReferenceMatrix.SelectToken($"{category.ToLower()}.{area.ToLower()}.{serviceType.ToLower()}.complexo.horas") ?? 0;

            int result = (easyCount * easyHours) + (mediumCount * mediumHours) + (complexCount * complexHours);
            return result > 0 ? result.ToString() : "";
        }
        public int GetBudgetedDevelopmentHours => Features
                .SelectMany(f => f.Services)
                .Where(s => s.Category.ToLower() != "testes")
                .Sum(s => s.Hours);

        public bool HasOperationServices()
        {
            foreach (var feature in Features)
            {
                if (feature.Services.Any(s => s.Category.ToLower() == "operacoes"))
                {
                    return true;
                }
            }
            return false;
        }
        public bool HasIntegrationServices()
        {
            foreach (var feature in Features)
            {
                if (feature.Services.Any(s => s.Category.ToLower() == "integracoes"))
                {
                    return true;
                }
            }
            return false;
        }
        public bool HasTestServices()
        {
            foreach (var feature in Features)
            {
                if (feature.Services.Any(s => s.Category.ToLower() == "testes"))
                {
                    return true;
                }
            }
            return false;
        }
        public int GetTotalTestHours => Features
                .SelectMany(f => f.Services)
                .Where(s => s.Category.ToLower() == "testes")
                .Sum(s => s.Hours);

        public int GetTotalReportHours =>
         GetTotalTestHours + GetBudgetedDevelopmentHours + AnalysisHours;

        public string FormatServiceNameWithComplexity(ServiceModel service)
        {
            bool isFeminine = IsFeminine(service.ServiceType);

            string formattedComplexity = service.Complexity.ToLower() switch
            {
                "facil" => "Simples",
                "medio" => isFeminine ? "Média" : "Médio",
                "complexo" => isFeminine ? "Complexa" : "Complexo",
                _ => service.Complexity
            };
            string formatServiceName = service.ServiceType.ToLower() switch
            {
                "web" => "Tela Web",
                "operacao" => "Operação Api",
                "pdf" => "Relatório PDF",
                "excel_word" => "Excel / Word",
                "procedure" => "Procedure",
                "modelagem" => "Modelagem",
                "trigger" => "Trigger",
                "funcao" => "Função",
                "scripts" => "Script SQL",
                "console" => "Console",
                _ => service.ServiceType
            };

            return $"{formatServiceName} {formattedComplexity}";
        }

        private bool IsFeminine(string serviceType)
        {
            var feminineServices = new List<string> { "procedure", "modelagem", "funcao", "web", "operacao" };

            return feminineServices.Any(feminineService => serviceType.ToLower().Contains(feminineService.ToLower()));
        }

    }

}