using BudgetGenerator.Services;
using BudgetGenerator.Services.Implementation;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Rotativa.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();


var app = builder.Build();

RotativaConfiguration.Setup(Directory.GetCurrentDirectory(), "Rotativa");

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Login}/{action=Index}/{id?}");

app.Run();
