

namespace BudgetGenerator.Models
{
    public class ReportInputModel
    {
        public List<FeatureModel> Features { get; set; } = new();
        public string ReportTitle { get; set; }

        public int AnalysisHours { get; set; }
    }
}