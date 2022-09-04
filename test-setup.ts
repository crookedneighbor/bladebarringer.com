import { vi } from "vitest";
import { defineComponent } from "vue";
import {
  mount as testMount,
  flushPromises,
  RouterLinkStub,
} from "@vue/test-utils";

export const queryContentSpy = {
  only: vi.fn().mockReturnThis(),
  sort: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  find: vi.fn().mockReturnValue([]),
};
export const queryContent = vi.fn().mockReturnValue(queryContentSpy);

export const mount = async (Component: Parameters<typeof testMount>[0]) => {
  const name = Component.name;

  if (!Component.components) {
    Component.components = {};
  }

  Component.components.NuxtLink = RouterLinkStub;

  const WrappedAsyncComponent = defineComponent({
    components: { [name]: Component },
    template: `<Suspense><${name}/></Suspense>`,
  });
  const wrapper = testMount(WrappedAsyncComponent);

  await flushPromises();

  return wrapper;
};

vi.mock("#imports", () => ({
  queryContent,
}));
