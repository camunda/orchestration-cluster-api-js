#!/bin/bash

# Deploy the BPMN model and capture the response

RESPONSE=$(curl -s -X POST \
  'http://localhost:8080/v2/deployments' \
  -H 'Content-Type: multipart/form-data' \
  -H 'Accept: application/json' \
  -F 'resources=@./tests-integration/fixtures/test-process.bpmn')

PROCESS_DEFINITION_KEY=$(echo "$RESPONSE" | jq -r '.. | .processDefinitionKey? // empty' | head -1)

echo "Process Definition Key: $PROCESS_DEFINITION_KEY"

if [[ -z "$PROCESS_DEFINITION_KEY" ]]; then
  echo "Error: processDefinitionKey empty" >&2
  exit 1
fi

# Create Process Instance

CREATE_PAYLOAD=$(jq -n --arg k "$PROCESS_DEFINITION_KEY" '{processDefinitionKey: $k, variables: {}, runtimeInstructions: [{ type: "TERMINATE_PROCESS_INSTANCE", afterElementId: "Activity_106kosb" }]}' )
PROCESS_INSTANCE_RESPONSE=$(curl -s -X POST \
  'http://localhost:8080/v2/process-instances' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d "$CREATE_PAYLOAD")

echo "$PROCESS_INSTANCE_RESPONSE" | jq '.' || echo "$PROCESS_INSTANCE_RESPONSE"

PROCESS_INSTANCE_KEY=$(echo "$PROCESS_INSTANCE_RESPONSE" | jq -r '.processInstanceKey')

# Get the Process Instance by Key

echo
echo "GET processInstanceKey=$PROCESS_INSTANCE_KEY" >&2
CANCEL_RESPONSE_STATUS=$(curl -s -o /dev/null -w '%{http_code}' -X GET \
  "http://localhost:8080/v2/process-instances/$PROCESS_INSTANCE_KEY/" 
)

if [[ "$CANCEL_RESPONSE_STATUS" == "200" ]]; then
  echo "Get succeeded (200)." >&2
else
  echo
  echo "#### Get failed, HTTP $CANCEL_RESPONSE_STATUS ####" >&2
  echo
fi