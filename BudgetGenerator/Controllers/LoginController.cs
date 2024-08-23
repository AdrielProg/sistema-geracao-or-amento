using Microsoft.AspNetCore.Mvc;
using BudgetGenerator.Models;

namespace BudgetGenerator.Controllers
{
    public class LoginController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Authenticate(LoginModel login)
        {

            if (login.Username == "admin" && login.Password == "1234")
            {
                return RedirectToAction("Index", "Home");
            }

            ModelState.AddModelError("", "Username ou senha incorretos.");
            return View("Index");
        }
    }
}