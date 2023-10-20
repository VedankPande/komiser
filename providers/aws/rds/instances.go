package rds

import (
	"context"
	"fmt"
	"time"

	log "github.com/sirupsen/logrus"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/pricing"
	"github.com/aws/aws-sdk-go-v2/service/pricing/types"
	"github.com/aws/aws-sdk-go-v2/service/rds"
	"github.com/tailwarden/komiser/models"
	"github.com/tailwarden/komiser/providers"
	"github.com/tailwarden/komiser/utils"
)

func Instances(ctx context.Context, client providers.ProviderClient) ([]models.Resource, error) {
	var config rds.DescribeDBInstancesInput
	resources := make([]models.Resource, 0)
	rdsClient := rds.NewFromConfig(*client.AWSClient)

	oldRegion := client.AWSClient.Region
	client.AWSClient.Region = "us-east-1"
	pricingClient := pricing.NewFromConfig(*client.AWSClient)
	client.AWSClient.Region = oldRegion

	for {
		output, err := rdsClient.DescribeDBInstances(ctx, &config)
		if err != nil {
			return resources, err
		}

		for _, instance := range output.DBInstances {
			tags := make([]models.Tag, 0)
			for _, tag := range instance.TagList {
				tags = append(tags, models.Tag{
					Key:   *tag.Key,
					Value: *tag.Value,
				})
			}

			//get deployment type
			var _deploymentType = GetDeploymentType(instance)
			//get instance name
			var _instanceName = GetInstanceName(instance)

			//get engine and db edition
			engineInfo := SplitEngine(*instance.Engine, "-")

			startOfMonth := utils.BeginningOfMonth(time.Now())
			hourlyUsage := 0
			if (*instance.InstanceCreateTime).Before(startOfMonth) {
				hourlyUsage = int(time.Since(startOfMonth).Hours())
			} else {
				hourlyUsage = int(time.Since(*instance.InstanceCreateTime).Hours())
			}

			//define filter
			filter := []types.Filter{
				{
					Field: aws.String("instanceType"),
					Value: aws.String(*instance.DBInstanceClass),
					Type:  types.FilterTypeTermMatch,
				},
				{
					Field: aws.String("regionCode"),
					Value: aws.String(client.AWSClient.Region),
					Type:  types.FilterTypeTermMatch,
				},
				{
					Field: aws.String("databaseEngine"),
					Value: aws.String(DBEngineMap[engineInfo["engine"]]),
					Type:  types.FilterTypeTermMatch,
				},
				{
					Field: aws.String("deploymentOption"),
					Value: aws.String(_deploymentType),
					Type:  types.FilterTypeTermMatch,
				},
			}

			//for oracle and sqlserver instances, include license and edition in the filter
			if engineInfo["engine"] == "oracle" || engineInfo["engine"] == "sqlserver" {
				filter = append(filter, []types.Filter{{
					Field: aws.String("licenseModel"),
					Value: aws.String(DBLicenseInfo[*instance.LicenseModel]),
					Type:  types.FilterTypeTermMatch,
				}, {
					Field: aws.String("databaseEdition"),
					Value: aws.String(DBEditionInfo[engineInfo["edition"]]),
					Type:  types.FilterTypeTermMatch,
				}}...)

			}

			for _, filterItem := range filter {

				log.Infof("%v: %v", *filterItem.Field, *filterItem.Value)
			}
			pricingOutput, err := pricingClient.GetProducts(ctx, &pricing.GetProductsInput{
				ServiceCode: aws.String("AmazonRDS"),
				Filters:     filter,
				MaxResults:  aws.Int32(1),
			})
			if err != nil {
				log.Warnf("Couldn't fetch invocations metric for %s: %v", _instanceName, err)
			}

			hourlyCost := GetHourlyCost(pricingOutput)
			monthlyCost := float64(hourlyUsage) * hourlyCost

			resources = append(resources, models.Resource{
				Provider:   "AWS",
				Account:    client.Name,
				Service:    "RDS Instance",
				Region:     client.AWSClient.Region,
				ResourceId: *instance.DBInstanceArn,
				Cost:       monthlyCost,
				Name:       _instanceName,
				FetchedAt:  time.Now(),
				Tags:       tags,
				Link:       fmt.Sprintf("https:/%s.console.aws.amazon.com/rds/home?region=%s#database:id=%s", client.AWSClient.Region, client.AWSClient.Region, *instance.DBInstanceIdentifier),
			})
		}

		if aws.ToString(output.Marker) == "" {
			break
		}

		config.Marker = output.Marker
	}
	log.WithFields(log.Fields{
		"provider":  "AWS",
		"account":   client.Name,
		"region":    client.AWSClient.Region,
		"service":   "RDS Instance",
		"resources": len(resources),
	}).Info("Fetched resources")
	return resources, nil
}
