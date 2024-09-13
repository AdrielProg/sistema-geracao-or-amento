namespace BudgetGenerator.Models
{
    public class ReportModel
    {
        public string ReportTitle { get; set; }
        public List<FeatureModel> Features { get; set; } = new();
        public int BudgetedHours => Features.Sum(f => f.AmountHours);

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
    }
}