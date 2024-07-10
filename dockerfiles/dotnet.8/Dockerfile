FROM mcr.microsoft.com/dotnet/aspnet:8.0
EXPOSE 80
WORKDIR /app
COPY drop .
USER $APP_UID
ENV ASPNETCORE_HTTP_PORTS=80
ENTRYPOINT ["dotnet", "#{APP_NAME}#.dll"]
