using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnTap.Api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveBars : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DELETE FROM "Pubs" WHERE "VenueType" = 'Bar';
                """);

            migrationBuilder.DropColumn(
                name: "VenueType",
                table: "Pubs");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "VenueType",
                table: "Pubs",
                type: "character varying(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "Pub");
        }
    }
}
