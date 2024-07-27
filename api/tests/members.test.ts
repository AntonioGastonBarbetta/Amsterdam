import axios, { AxiosResponse } from "axios";
import { execSync } from "child_process";

describe("API Endpoint Tests", () => {
  test("GET API Members", async () => {
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
    const membersResponse: AxiosResponse = await axios.get(
      url + "v1/lists/" + listId + "/users",
      {
        headers: {
          Authorization: "Bearer blue@putazo.com",
          "Content-Type": "application/json",
        },
      },
    );
    expect(membersResponse.status).toBe(200);
    expect(membersResponse.data.members).not.toBe(undefined);
    expect(membersResponse.data.members.length).not.toBe(0);
  }, 10000);

  test("POST API Members", async () => {
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
    const membersResponse: AxiosResponse = await axios.post(
      url + "v1/lists/" + listId + "/users/blue@trolazo.com",
      {
        headers: {
          Authorization: "Bearer blue@putazo.com",
          "Content-Type": "application/json",
        },
      },
    );
    expect(membersResponse.status).toBe(200);
    expect(membersResponse.data.members).not.toBe(undefined);
    expect(membersResponse.data.members.toString()).toContain(
      "blue@trolazo.com",
    );
  }, 10000);

  test("DELETE API Members", async () => {
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
    const membersResponse: AxiosResponse = await axios.delete(
      url + "v1/lists/" + listId + "/users/blue@trolazo.com",
      {
        headers: {
          Authorization: "Bearer blue@putazo.com",
          "Content-Type": "application/json",
        },
      },
    );
    expect(membersResponse.status).toBe(200);
  }, 20000);

  test("OPTIONS API Members", async () => {
    const url: string = execSync(
      `cat ../outputs.json | jq -r '.BlueListsApiStacks.BlueListsApiUrl'`,
    )
      .toString()
      .trim();
    const response: AxiosResponse = await axios.options(
      url + "v1/lists/1/users",
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
