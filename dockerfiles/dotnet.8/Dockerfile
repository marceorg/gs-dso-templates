FROM mcr.microsoft.com/dotnet/aspnet:8.0
EXPOSE 80
WORKDIR /app
COPY drop .
USER $APP_UID
ENTRYPOINT ["./testrepo"]