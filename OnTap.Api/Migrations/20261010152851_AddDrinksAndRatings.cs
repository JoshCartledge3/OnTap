using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnTap.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddDrinksAndRatings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Drinks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Category = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Abv = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Drinks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PubRatings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    PubId = table.Column<Guid>(type: "uuid", nullable: false),
                    Rating = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PubRatings", x => x.Id);
                    table.CheckConstraint("CK_PubRatings_Rating", "\"Rating\" BETWEEN 1 AND 5");
                    table.ForeignKey(
                        name: "FK_PubRatings_Pubs_PubId",
                        column: x => x.PubId,
                        principalTable: "Pubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PubDrinks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PubId = table.Column<Guid>(type: "uuid", nullable: false),
                    DrinkId = table.Column<Guid>(type: "uuid", nullable: false),
                    ServingType = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PubDrinks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PubDrinks_Drinks_DrinkId",
                        column: x => x.DrinkId,
                        principalTable: "Drinks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PubDrinks_Pubs_PubId",
                        column: x => x.PubId,
                        principalTable: "Pubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DrinkRatings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    PubDrinkId = table.Column<Guid>(type: "uuid", nullable: false),
                    Rating = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DrinkRatings", x => x.Id);
                    table.CheckConstraint("CK_DrinkRatings_Rating", "\"Rating\" BETWEEN 1 AND 5");
                    table.ForeignKey(
                        name: "FK_DrinkRatings_PubDrinks_PubDrinkId",
                        column: x => x.PubDrinkId,
                        principalTable: "PubDrinks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DrinkRatings_PubDrinkId",
                table: "DrinkRatings",
                column: "PubDrinkId");

            migrationBuilder.CreateIndex(
                name: "IX_DrinkRatings_UserId_PubDrinkId",
                table: "DrinkRatings",
                columns: new[] { "UserId", "PubDrinkId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PubDrinks_DrinkId",
                table: "PubDrinks",
                column: "DrinkId");

            migrationBuilder.CreateIndex(
                name: "IX_PubDrinks_PubId_DrinkId_ServingType",
                table: "PubDrinks",
                columns: new[] { "PubId", "DrinkId", "ServingType" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PubRatings_PubId",
                table: "PubRatings",
                column: "PubId");

            migrationBuilder.CreateIndex(
                name: "IX_PubRatings_UserId_PubId",
                table: "PubRatings",
                columns: new[] { "UserId", "PubId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DrinkRatings");

            migrationBuilder.DropTable(
                name: "PubRatings");

            migrationBuilder.DropTable(
                name: "PubDrinks");

            migrationBuilder.DropTable(
                name: "Drinks");
        }
    }
}
