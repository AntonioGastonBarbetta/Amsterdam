import axios, { AxiosResponse } from "axios";
import { execSync } from "child_process";

describe("API Endpoint Tests", () => {
  test("POST API Lists", async () => {
    const url: string = execSync(
      `cat ../outputs.json | jq -r '.BlueListsApiStacks.BlueListsApiUrl'`,
    )
      .toString()
      .trim();
    const response: AxiosResponse = await axios.post(
      url + "v1/lists",
      {
        name: "Test List",
      },
      {
        headers: {
          Authorization: "Bearer blue@putazo.com",
          "Content-Type": "application/json",
        },
      },
    );
    expect(response.status).toBe(200);
    expect(response.data).not.toBeNull();
    expect(response.data).not.toBe("");
    expect(response.data).not.toBe("{}");
    expect(response.data).not.toBe({});
    expect(response.data.id).not.toBe(undefined);
    expect(response.data.name).not.toBe(undefined);
    expect(response.data.createdAt).not.toBe(undefined);
    expect(response.data.owner).not.toBe(undefined);
  });

  test("GET API Lists", async () => {
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
    expect(response.data).not.toBeNull();
    expect(response.data).not.toBe("");
    expect(response.data).not.toBe("{}");
    expect(response.data).not.toBe({});
    expect(response.data.lists).not.toBe(undefined);
  });

  test("DELETE API Lists", async () => {
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
    const deleteResponse: AxiosResponse = await axios.delete(
      url + "v1/lists/" + listId,
      {
        headers: {
          Authorization: "Bearer blue@putazo.com",
          "Content-Type": "application/json",
        },
      },
    );
    expect(deleteResponse.status).toBe(200);
  }, 10000);

  test("OPTIONS API Lists", async () => {
    const url: string = execSync(
      `cat ../outputs.json | jq -r '.BlueListsApiStacks.BlueListsApiUrl'`,
    )
      .toString()
      .trim();
    const response: AxiosResponse = await axios.options(url + "v1/lists", {
      headers: {
        Origin: "http://example.com",
        Authorization: "Bearer test@complyedge.io",
        "Content-Type": "application/json",
      },
    });
    expect(response.headers["access-control-allow-origin"]).toEqual("*");
  });
});
