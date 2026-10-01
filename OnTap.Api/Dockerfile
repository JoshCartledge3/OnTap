FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["OnTap.Api/OnTap.Api.csproj", "OnTap.Api/"]
RUN dotnet restore "OnTap.Api/OnTap.Api.csproj"
COPY OnTap.Api/ OnTap.Api/
WORKDIR "/src/OnTap.Api"

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./OnTap.Api.csproj" --no-restore -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false /p:SkipNswagGeneration=true

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OnTap.Api.dll"]
