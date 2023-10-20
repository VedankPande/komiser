package rds

import (
	"encoding/json"
	"strconv"
	"strings"

	log "github.com/sirupsen/logrus"

	"github.com/aws/aws-sdk-go-v2/service/pricing"
	"github.com/aws/aws-sdk-go-v2/service/rds/types"
	"github.com/tailwarden/komiser/models"
)

func SplitEngine(engineName string, delimeter string) map[string]string {

	engineSplitSlice := strings.Split(engineName, delimeter)

	var engineInfo = map[string]string{}

	engineInfo["engine"] = engineSplitSlice[0]
	if len(engineSplitSlice) > 1 {
		engineInfo["edition"] = engineSplitSlice[1]
	} else {
		engineInfo["edition"] = ""
	}

	return engineInfo
}

func GetInstanceName(instance types.DBInstance) string {
	var instanceName string

	if instance.DBName == nil {
		instanceName = *instance.DBInstanceIdentifier
	} else {
		instanceName = *instance.DBName
	}

	return instanceName
}

func GetDeploymentType(instance types.DBInstance) string {
	var deploymentType string

	if instance.MultiAZ {
		deploymentType = "Multi-AZ"
	} else {
		deploymentType = "Single-AZ"
	}

	return deploymentType
}

func GetHourlyCost(pricingOutput *pricing.GetProductsOutput) float64 {
	hourlyCost := 0.0
	if pricingOutput != nil && len(pricingOutput.PriceList) > 0 {
		log.Infof(`Raw pricingOutput.PriceList[0] : %s`, pricingOutput.PriceList[0])

		pricingResult := models.PricingResult{}
		err := json.Unmarshal([]byte(pricingOutput.PriceList[0]), &pricingResult)
		if err != nil {
			log.Fatalf("Failed to unmarshal JSON: %v", err)
		}

		for _, onDemand := range pricingResult.Terms.OnDemand {
			for _, priceDimension := range onDemand.PriceDimensions {
				hourlyCost, err = strconv.ParseFloat(priceDimension.PricePerUnit.USD, 64)
				if err != nil {
					log.Fatalf("Failed to parse hourly cost: %v", err)
				}
				break
			}
			break
		}

		//log.Printf("Hourly cost RDS: %f", hourlyCost)
	}

	return hourlyCost
}
