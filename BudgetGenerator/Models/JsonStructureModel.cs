using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BudgetGenerator.Models
{
    public class Complexity
    {
        public string Pontos { get; set; }
        public int Horas { get; set; }
    }

    public class Web
    {
        public Complexity Facil { get; set; }
        public Complexity Medio { get; set; }
        public Complexity Complexo { get; set; }
    }

    public class Relatorios
    {
        public Complexity Pdf { get; set; }
        public Complexity ExcelWord { get; set; }
    }

    public class SQL
    {
        public Complexity Procedure { get; set; }
        public Complexity Job { get; set; }
        public Complexity Trigger { get; set; }
        public Complexity Funcao { get; set; }
        public Complexity Scripts { get; set; }
        public Complexity Modelagem { get; set; }
    }

    public class Api
    {
        public Complexity Operacao { get; set; }
    }

    public class Servicos
    {
        public Complexity Console { get; set; }
    }

    public class Operacoes
    {
        public Web Telas { get; set; }
        public Relatorios Relatorios { get; set; }
        public SQL Sql { get; set; }
        public Api Api { get; set; }
        public Servicos Servicos { get; set; }
    }

    public class Integracoes
    {
        public Web Telas { get; set; }
        public Relatorios Relatorios { get; set; }
        public SQL Sql { get; set; }
        public Api Api { get; set; }
        public Servicos Servicos { get; set; }
    }

    public class Testes
    {
        public Web Telas { get; set; }
        public Relatorios Relatorios { get; set; }
        public SQL Sql { get; set; }
        public Api Api { get; set; }
    }

    public class Root
    {
        public Operacoes Operacoes { get; set; }
        public Integracoes Integracoes { get; set; }
        public Testes Testes { get; set; }
    }

}