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

        public Dictionary<string, (int Simples, int Medio, int Complexo)> ContarComplexidades()
        {
            var serviceComplexities = new Dictionary<string, (int Simples, int Medio, int Complexo)>
        {
            { "Telas_WEB", (0, 0, 0) },
            { "Relatórios_PDF", (0, 0, 0) },
            { "Relatórios_ExcelWord", (0, 0, 0) },
            { "SQL_Procedure", (0, 0, 0) },
            { "SQL_JOB", (0, 0, 0) },
            { "SQL_Trigger", (0, 0, 0) },
            { "SQL_Função", (0, 0, 0) },
            { "SQL_Scripts", (0, 0, 0) },
            { "SQL_Modelagem", (0, 0, 0) },
            { "API_Operação", (0, 0, 0) },
            { "Serviços_Console", (0, 0, 0) }
        };

            foreach (var feature in Features)
            {
                foreach (var service in feature.Services)
                {
                    string key = service.Category + "_" + service.ServiceType;

                    if (serviceComplexities.ContainsKey(key))
                    {
                        switch (service.Complexity)
                        {
                            case "Simples":
                                serviceComplexities[key] = (serviceComplexities[key].Simples + 1, serviceComplexities[key].Medio, serviceComplexities[key].Complexo);
                                break;
                            case "Médio":
                                serviceComplexities[key] = (serviceComplexities[key].Simples, serviceComplexities[key].Medio + 1, serviceComplexities[key].Complexo);
                                break;
                            case "Complexo":
                                serviceComplexities[key] = (serviceComplexities[key].Simples, serviceComplexities[key].Medio, serviceComplexities[key].Complexo + 1);
                                break;
                        }
                    }
                    else
                    {
                        // Caso a chave não exista no dicionário, adicionar uma nova chave
                        serviceComplexities[key] = service.Complexity switch
                        {
                            "Simples" => (1, 0, 0),
                            "Médio" => (0, 1, 0),
                            "Complexo" => (0, 0, 1),
                            _ => (0, 0, 0)
                        };
                    }
                }
            }

            return serviceComplexities;
        }
    }
}