import { buildSize } from "build-size-super-plugin";

export async function main() {
  await buildSize({
    path: "./build/static/js",
  });
}
