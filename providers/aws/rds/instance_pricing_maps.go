package rds

var DBEngineMap = map[string]string{
	"aurora-mysql":      "Aurora MySQL",
	"aurora-postgresql": "Aurora PostgreSQL",
	"mariadb":           "MariaDB",
	"mysql":             "MySQL",
	"postgres":          "PostgreSQL",
	"sqlserver":         "SQL Server",
	"oracle":            "Oracle",
}

// db edition for Oracle and postgres
var DBEditionInfo = map[string]string{
	"ee":  "Enterprise",
	"se2": "Standard Two",
	"se":  "Standard",
	"web": "Web",
	"ex":  "Express",
}

var DBLicenseInfo = map[string]string{
	"license-included":       "License included",
	"bring-your-own-license": "Bring your own license",
	"general-public-license": "General public license",
}
