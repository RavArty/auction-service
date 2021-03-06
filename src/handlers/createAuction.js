import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
// import core
const middy = require("@middy/core");
// import some middlewares
const httpJsonBodyParser = require("@middy/http-json-body-parser");
const httpErrorHandler = require("@middy/http-error-handler");
const httpEventNormalizer = require("@middy/http-event-normalizer");
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const { title } = event.body;
  const now = new Date();

  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: now.toISOString(),
    highestBid: {
      amount: 0,
    },
  };

  try {
    await dynamodb
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = middy(createAuction)
  .use(httpJsonBodyParser())
  .use(httpErrorHandler())
  .use(httpEventNormalizer());
