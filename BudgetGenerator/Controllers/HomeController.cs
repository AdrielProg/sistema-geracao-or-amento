
using BudgetGenerator.Services;
using Microsoft.AspNetCore.Mvc;


namespace BudgetGenerator.Controllers
{
    public class HomeController : Controller
    {
        private readonly MatrixService _matrixService;
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _matrixService = new MatrixService();
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }


    }
}
