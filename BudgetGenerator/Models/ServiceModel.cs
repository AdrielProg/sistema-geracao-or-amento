

namespace BudgetGenerator.Models
{
    public class ServiceModel
    {
        public required string ServiceType { get; set; }
        public string Category { get; set; }
        public string Area { get; set; }
        public string Complexity { get; set; }
        public int Hours { get; set; }
    }
}