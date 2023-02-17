package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tailwarden/komiser/models"
	"github.com/tailwarden/komiser/utils"
)

func (handler *ApiHandler) DashboardStatsHandler(w http.ResponseWriter, r *http.Request) {
	regions := struct {
		Count int `bun:"count" json:"total"`
	}{}

	handler.db.NewRaw("SELECT COUNT(*) as count FROM (SELECT DISTINCT region FROM resources) AS temp").Scan(handler.ctx, &regions)

	resources := struct {
		Count int `bun:"count" json:"total"`
	}{}

	handler.db.NewRaw("SELECT COUNT(*) as count FROM resources").Scan(handler.ctx, &resources)

	cost := struct {
		Sum float64 `bun:"sum" json:"total"`
	}{}

	handler.db.NewRaw("SELECT SUM(cost) as sum FROM resources").Scan(handler.ctx, &cost)

	accounts := struct {
		Count int `bun:"count" json:"total"`
	}{}

	handler.db.NewRaw("SELECT COUNT(*) as count FROM (SELECT DISTINCT account FROM resources) AS temp").Scan(handler.ctx, &accounts)

	output := struct {
		Resources int     `json:"resources"`
		Regions   int     `json:"regions"`
		Costs     float64 `json:"costs"`
		Accounts  int     `json:"accounts"`
	}{
		Resources: resources.Count,
		Regions:   regions.Count,
		Costs:     cost.Sum,
		Accounts:  accounts.Count,
	}

	respondWithJSON(w, 200, output)
}

func (handler *ApiHandler) ResourcesBreakdownStatsHandler(w http.ResponseWriter, r *http.Request) {
	input := models.InputResources{}

	err := json.NewDecoder(r.Body).Decode(&input)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	groups := make([]models.OutputResources, 0)

	handler.db.NewRaw(fmt.Sprintf("SELECT %s as label, COUNT(*) as total FROM resources GROUP BY %s ORDER by total desc;", input.Filter, input.Filter)).Scan(handler.ctx, &groups)

	segments := groups

	if len(groups) > 3 {
		segments = groups[:4]
		if len(groups) > 4 {
			sum := 0
			for i := 4; i < len(groups); i++ {
				sum += groups[i].Total
			}

			segments = append(segments, models.OutputResources{
				Label: "Other",
				Total: sum,
			})
		}
	}
	respondWithJSON(w, 200, segments)
}

func (handler *ApiHandler) LocationBreakdownStatsHandler(w http.ResponseWriter, r *http.Request) {
	groups := make([]models.OutputResources, 0)

	handler.db.NewRaw("SELECT region as label, COUNT(*) as total FROM resources GROUP BY region ORDER by total desc;").Scan(handler.ctx, &groups)

	locations := make([]models.OutputLocations, 0)

	for _, group := range groups {

		location := utils.GetLocationFromRegion(group.Label)

		if location.Label != "" {
			locations = append(locations, models.OutputLocations{
				Name:      location.Name,
				Label:     location.Label,
				Latitude:  location.Latitude,
				Longitude: location.Longitude,
				Resources: group.Total,
			})
		}
	}

	respondWithJSON(w, 200, locations)
}