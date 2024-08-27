using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BudgetGenerator.Models
{
    public class FeatureModel
    {
        public required string Name { get; set; }

        public string Description { get; set; }
        public List<ServiceModel> Services { get; set; } = new List<ServiceModel>();
        public int AmountHours => Services.Sum(s => s.Hours);
    }
}