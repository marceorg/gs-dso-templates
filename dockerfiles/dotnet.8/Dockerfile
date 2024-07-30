FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY drop .
USER $APP_UID
ENTRYPOINT ["dotnet", "#{APP_NAME}#.dll"]
