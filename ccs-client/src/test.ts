// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import "zone.js/testing";
import { getTestBed } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";

declare const require: {
  context(
    path: string,
    deep?: boolean,
    filter?: RegExp
  ): {
    keys(): string[];
    // eslint-disable-next-line @typescript-eslint/member-ordering
    <T>(id: string): T;
  };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context("./", true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);

beforeEach(() => patchConsoleToFailOnError());

const orgConsoleError = window.console.error;

export const patchConsoleToFailOnError = () => {
  window.console.error = (...args: any[]) => {
    orgConsoleError.apply(this, args);

    try {
      throw new Error("console.error");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.info("console.error", args, err);
    }
    fail("console.error was called, this is not allowed in a unit test run");
  };
};
