var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddSingleton<Amazon.SQS.IAmazonSQS>(new Amazon.SQS.AmazonSQSClient(builder.Configuration["AWS:AccessKeyId"], builder.Configuration["AWS:SecretAccessKey"], builder.Configuration["AWS:SessionToken"], Amazon.RegionEndpoint.USEast1));

builder.Services.AddSingleton<ReasignacionEspacios.Services.ReasignacionService>();

builder.Services.AddSingleton<ReasignacionEspacios.Services.EventListenerService>(provider =>
{
    var sqs = provider.GetRequiredService<Amazon.SQS.IAmazonSQS>();
    var service = provider.GetRequiredService<ReasignacionEspacios.Services.ReasignacionService>();

    var queueUrl = builder.Configuration["AWS:QueueUrl"];

    return new ReasignacionEspacios.Services.EventListenerService(sqs, service, queueUrl);
});

// Esto permitirá que el event listener arranque junto a la aplicación
var app = builder.Build();

app.MapControllers();

var eventListener = app.Services.GetRequiredService<ReasignacionEspacios.Services.EventListenerService>();

_ = eventListener.EscucharEventosAsync(CancellationToken.None);

app.Run();
