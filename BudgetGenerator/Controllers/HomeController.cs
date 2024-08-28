
using BudgetGenerator.Services;
using Microsoft.AspNetCore.Mvc;

namespace BudgetGenerator.Controllers;

public class HomeController : Controller
{
    public IActionResult Index() => View();
}
