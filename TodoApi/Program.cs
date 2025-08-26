using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

using TodoApi.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddSingleton<TodoRepository>();

// ==== CORS Ayarları ====
// builder.Services.AddCors(options =>
// {
//     options.AddDefaultPolicy(policy =>
//     {
//         policy
//             .AllowAnyOrigin()    // Herhangi bir origin'den isteğe izin ver
//             .AllowAnyHeader()    // Herhangi bir header kabul et
//             .AllowAnyMethod();   // GET, POST, PUT, DELETE vs izinli
//     });
// });

// CORS ayarı
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


var app = builder.Build();

// ==== Middleware ====
// app.UseCors();             // CORS'u pipeline'a ekle

app.UseCors("AllowAll"); // <-- bunu ekledik

app.UseAuthorization();
app.MapControllers();

app.Run();