using Newtonsoft.Json.Linq;

namespace BudgetGenerator.Services
{
    public class MatrixService
    {
        private readonly string _matrixFilePath;

        public MatrixService()
        {
            _matrixFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "data", "matriz_horas.json");
        }

        public JObject LoadMatrixData()
        {
            string json = File.ReadAllText(_matrixFilePath);
            return JObject.Parse(json);
        }
    }
}
