# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# copy csproj and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# copy the rest of the source code and build
COPY . ./
RUN dotnet publish -c Release -o out

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/out ./

# Expose the port your app uses
EXPOSE 8080

# Run the app
ENTRYPOINT ["dotnet", "TodoApi.dll"]