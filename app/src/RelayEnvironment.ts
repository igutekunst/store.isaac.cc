import {
  Environment,
  Network,
  RecordSource,
  Store,
  FetchFunction,
} from "relay-runtime";

const HTTP_ENDPOINT = "https://api.staging.isaac.cc/graphql/";

const fetchFn: FetchFunction = async (request, variables) => {
  try {
    const resp = await fetch(HTTP_ENDPOINT, {
      method: "POST",
      headers: {
        Accept:
          "application/graphql-response+json; charset=utf-8, application/json; charset=utf-8",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: request.text,
        variables,
      }),
    });

    if (!resp.ok) {
      throw new Error(`Network response was not ok: ${resp.statusText}`);
    }

    const jsonResponse = await resp.json();
    if (!jsonResponse) {
      throw new Error('Received empty JSON response');
    }

    return jsonResponse;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error; // Re-throw the error after logging
  }
};

function createRelayEnvironment() {
  return new Environment({
    network: Network.create(fetchFn),
    store: new Store(new RecordSource()),
  });
}

let relayEnvironment: Environment | undefined;

export function initRelayEnvironment() {
  const environment = relayEnvironment ?? createRelayEnvironment();

  // For SSG and SSR always create a new Relay environment.
  if (typeof window === "undefined") {
    return environment;
  }

  // Create the Relay environment once in the client
  // and then reuse it.
  if (!relayEnvironment) {
    relayEnvironment = environment;
  }

  return relayEnvironment;
}
