using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnTap.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPubLocalityFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "Pubs",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Pubs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Place",
                table: "Pubs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Town",
                table: "Pubs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Village",
                table: "Pubs",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "City",
                table: "Pubs");

            migrationBuilder.DropColumn(
                name: "Place",
                table: "Pubs");

            migrationBuilder.DropColumn(
                name: "Town",
                table: "Pubs");

            migrationBuilder.DropColumn(
                name: "Village",
                table: "Pubs");

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "Pubs",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500,
                oldNullable: true);
        }
    }
}
