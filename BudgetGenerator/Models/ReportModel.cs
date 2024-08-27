namespace BudgetGenerator.Models
{
    public class ReportModel
    {
        public List<FeatureModel> Features { get; set; } = new();

        public int BudgetedHours => Features.Sum(f => f.AmountHours);

    }
}
