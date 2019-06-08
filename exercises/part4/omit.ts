// Webdriver typings (don't touch!)
namespace WebDriver {
  export interface Capability {
    resolution: string
  }

  export interface Options {
    url: string,
    capabilities: WebDriver.Capability[]
  }
}

/**
 * WebDriver is an  external package (emulated here), 
 * which definitions we can use without problem by doing the following
 */

// webdriver.config.ts
export const config: WebDriver.Options = {
  url: "http://localhost",
  capabilities: [{
    resolution: "1024x768",
  }]
}

/**
 * However, it turns out there is another external package, that allows us to configure 
 * capabilities differently, using a callback:
 */
interface WebDriverHooks {
  capabilities: (browserName: string) => WebDriver.Capability
}

/**
 * So, a valid configuration looks like
 * (note that this one is untyped, this is just an example)
 */
export const config2 = {
  url: "http://localhost",
  capabilities: (browserName: string) => {
    return {
      resolution: "1024x768"
    }
  }
}

/**
 * However, trying to naivily type this fails,
 * as we can never satisfy `capabilities` this way, 
 * since it has to be both a function and array
 */
export const config3: WebDriver.Options & WebDriverHooks = {
  url: "http://localhost",
  capabilities: (browserName) => { // NOTE: this line will keep failing, it is just demonstrating the problem
    return {
      resolution: "1024x768"
    }
  }
}

/**
 * So, we need to drop the original definition of "capabilities" using "Omit"
 */
const config4: Omit<WebDriver.Options, "capabilities"> & WebDriverHooks = {
  url: "http://localhost",
  capabilities: (browserName) => { // NOTE: this shouldn't fail anymore
    return {
      resolution: "1024x768"
    }
  }
}

/**
 * Implement the the of Omit properly.
 * 
 * An example would be: 
 * Omit<{ a: number, b: boolean }, "a"> -> { b: boolean }
 * 
 * This can be achieved by using the built-in types `Pick` and `Exclude`
 * 
 * The TypeScript built-in types are documented here:
 * https://www.typescriptlang.org/docs/handbook/utility-types.html
 */

type Omit<Type, Key> = Pick<Type, Exclude<keyof Type, Key>>

