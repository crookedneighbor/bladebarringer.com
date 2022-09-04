import { describe, test, expect } from "vitest";

import RecentBlogPosts from "../RecentBlogPosts.vue";
import { queryContent } from "#imports";
import { mount, queryContentSpy } from "../../../test-setup";

describe("RecentBlogPosts Component", () => {
  test("queries for the 5 most recently published blog posts", async () => {
    const wrapper = await mount(RecentBlogPosts);

    expect(queryContent).toBeCalledTimes(1);
    expect(queryContent).toBeCalledWith("blog");
    expect(queryContentSpy.only).toBeCalledTimes(1);
    expect(queryContentSpy.only).toBeCalledWith([
      "title",
      "publishedAt",
      "_path",
    ]);
    expect(queryContentSpy.sort).toBeCalledTimes(1);
    expect(queryContentSpy.sort).toBeCalledWith({ publishedAt: -1 });
    expect(queryContentSpy.limit).toBeCalledTimes(1);
    expect(queryContentSpy.limit).toBeCalledWith(5);
    expect(queryContentSpy.find).toBeCalledTimes(1);
  });

  test("renders links returned from querying content", async () => {
    queryContentSpy.find.mockReturnValue([
      {
        title: "title 1",
        _path: "/blog/title-1",
        publishedAt: "2022-08-14",
      },
      {
        title: "title 2",
        _path: "/blog/title-2",
        publishedAt: "2022-08-13",
      },
    ]);

    const wrapper = await mount(RecentBlogPosts);

    const links = wrapper.findAll("ul li");
    expect(links.length).toBe(2);
    expect(links.at(0).text()).toContain("title 1 - Aug");
    expect(links.at(1).text()).toContain("title 2 - Aug");
  });
});
