using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnTap.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPubImportFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "DogsAllowed",
                table: "Pubs",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OpeningHours",
                table: "Pubs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "OsmId",
                table: "Pubs",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OsmType",
                table: "Pubs",
                type: "character varying(8)",
                maxLength: 8,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "OutdoorSeating",
                table: "Pubs",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentMethodsAccepted",
                table: "Pubs",
                type: "character varying(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Pubs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ServesFood",
                table: "Pubs",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<string[]>(
                name: "SportsBroadcasters",
                table: "Pubs",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VenueType",
                table: "Pubs",
                type: "character varying(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "Pub");

            migrationBuilder.AddColumn<string>(
                name: "WheelchairAccess",
                table: "Pubs",
                type: "character varying(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Pubs_OsmType_OsmId",
                table: "Pubs",
                columns: new[] { "OsmType", "OsmId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Pubs_OsmType_OsmId",
                table: "Pubs");

            migrationBuilder.DropColumn(
                name: "DogsAllowed",
                table: "Pubs");

            migrationBuilder.DropColumn(
                name: "OpeningHours",
                table: "Pubs");

            migrationBuilder.DropColumn(
                name: "OsmId",
                table: "Pubs");

            migrationBuilder.DropColumn(
                name: "OsmType",
                table: "Pubs");

            migrationBuilder.DropColumn(
                name: "OutdoorSeating",
                table: "Pubs");

            migrationBuilder.DropColumn(
                name: "PaymentMethodsAccepted",
                table: "Pubs");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Pubs");

            migrationBuilder.DropColumn(
                name: "ServesFood",
                table: "Pubs");

            migrationBuilder.DropColumn(
                name: "SportsBroadcasters",
                table: "Pubs");

            migrationBuilder.DropColumn(
                name: "VenueType",
                table: "Pubs");

            migrationBuilder.DropColumn(
                name: "WheelchairAccess",
                table: "Pubs");
        }
    }
}
