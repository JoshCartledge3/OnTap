using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnTap.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AuthSubject = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    DisplayName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_AuthSubject",
                table: "Users",
                column: "AuthSubject",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_DrinkRatings_Users_UserId",
                table: "DrinkRatings",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PubRatings_Users_UserId",
                table: "PubRatings",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DrinkRatings_Users_UserId",
                table: "DrinkRatings");

            migrationBuilder.DropForeignKey(
                name: "FK_PubRatings_Users_UserId",
                table: "PubRatings");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
