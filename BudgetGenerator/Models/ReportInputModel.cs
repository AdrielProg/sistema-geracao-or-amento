

using System.ComponentModel.DataAnnotations;

namespace BudgetGenerator.Models
{
    public class ReportInputModel
    {
        [Required(ErrorMessage = "O título do relatório é obrigatório.")]
        [StringLength(80, ErrorMessage = "O título do relatório deve ter no máximo 100 caracteres.")]
        public required string ReportTitle { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "O número de horas de análise deve ser maior que 0.")]
        public int AnalysisHours { get; set; }

        [Required(ErrorMessage = "Pelo menos uma funcionalidade deve ser adicionada.")]
        public required List<FeatureModel> Features { get; set; }
    }
}