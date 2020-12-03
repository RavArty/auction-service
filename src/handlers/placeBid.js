import AWS from "aws-sdk";
// import core
const middy = require("@middy/core");
// import some middlewares
const httpJsonBodyParser = require("@middy/http-json-body-parser");
const httpErrorHandler = require("@middy/http-error-handler");
const httpEventNormalizer = require("@middy/http-event-normalizer");
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: "set highestBid.amount = :amount",
    ExpressionAttributeValues: {
      ":amount": amount,
    },
    ReturnValues: "ALL_NEW",
  };

  let updatedAuction;

  try {
    const result = await dynamodb.update(params).promise();
    updatedAuction = result.Attributes;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = middy(placeBid)
  .use(httpJsonBodyParser())
  .use(httpErrorHandler())
  .use(httpEventNormalizer());
