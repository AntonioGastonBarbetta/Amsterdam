import axios, { AxiosResponse } from "axios";
import { execSync } from "child_process";

describe("API Endpoint Tests", () => {
  test("GET API Items", async () => {
    const url: string = execSync(
      `cat ../outputs.json | jq -r '.BlueListsApiStacks.BlueListsApiUrl'`,
    )
      .toString()
      .trim();
    const response: AxiosResponse = await axios.get(url + "v1/lists", {
      headers: {
        Authorization: "Bearer blue@putazo.com",
        "Content-Type": "application/json",
      },
    });
    expect(response.status).toBe(200);
    expect(response.data.lists).not.toBe(undefined);
    expect(response.data.lists.length).not.toBe(0);
    const listId = response.data.lists[response.data.lists.length - 1].id;
    const itemsResponse: AxiosResponse = await axios.get(
      url + "v1/lists/" + listId + "/items",
      {
        headers: {
          Authorization: "Bearer blue@putazo.com",
          "Content-Type": "application/json",
        },
      },
    );
    expect(itemsResponse.status).toBe(200);
    expect(itemsResponse.data.items).not.toBe(undefined);
  });

  test("PUT API Items", async () => {
    const url: string = execSync(
      `cat ../outputs.json | jq -r '.BlueListsApiStacks.BlueListsApiUrl'`,
    )
      .toString()
      .trim();
    const response: AxiosResponse = await axios.get(url + "v1/lists", {
      headers: {
        Authorization: "Bearer blue@putazo.com",
        "Content-Type": "application/json",
      },
    });
    expect(response.status).toBe(200);
    expect(response.data.lists).not.toBe(undefined);
    expect(response.data.lists.length).not.toBe(0);
    const listId = response.data.lists[response.data.lists.length - 1].id;
    const itemsResponse: AxiosResponse = await axios.put(
      url + "v1/lists/" + listId + "/items",
      {
        items: [
          {
            text: "Lorem Ipsum",
          },
        ],
      },
      {
        headers: {
          Authorization: "Bearer blue@putazo.com",
          "Content-Type": "application/json",
        },
      },
    );
    expect(itemsResponse.status).toBe(200);
    expect(itemsResponse.data.items).not.toBe(undefined);
    expect(itemsResponse.data.items[0].text).toBe("Lorem Ipsum");
  }, 10000);

  test("OPTIONS API Items", async () => {
    const url: string = execSync(
      `cat ../outputs.json | jq -r '.BlueListsApiStacks.BlueListsApiUrl'`,
    )
      .toString()
      .trim();
    const response: AxiosResponse = await axios.options(
      url + "v1/lists/1/items",
      {
        headers: {
          Origin: "http://example.com",
          Authorization: "Bearer test@complyedge.io",
          "Content-Type": "application/json",
        },
      },
    );
    expect(response.headers["access-control-allow-origin"]).toEqual("*");
  });
});
