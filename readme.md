# Power Apps Code Apps: A "Quick and Dirty" How To
[Power Apps Code Apps](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/overview) let you bring custom React applications into Power Platform, hosting them natively within an ecosystem you already know and trust. Build fully bespoke UIs in Visual Studio Code using the tools and frameworks you love, then deploy directly into Power Platform — inheriting all the enterprise-grade security, governance, and compliance that comes standard with Power Apps.

This is a quick-and-dirty guide to get you up and running quickly!

*Note: Throughout this walk-through, Copilot CLI is used to scaffold the React app itself. It would likely handle the prepping, building, and deploying to Power Platform just as capably — but in the interest of transparency, I've listed out each individual command along with what it does, so you get a real feel for what's happening under the hood rather than treating it as a black box.*

## Setup
Before you begin, install the following:
- [Visual Studio Code](https://code.visualstudio.com/)
- [NodeJS](https://nodejs.org/)
- [Power Platform PAC CLI](https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction)
- [GitHub Copilot CLI](https://github.com/features/copilot/cli) - *if you're like me and don't know React, you can use this to vibe-code anything!*

## Vibe-Code a React App!
In your terminal, navigate (`cd`) to a folder and run `copilot` to pull up the Copilot CLI.

Once Copilot boots, type in a prompt like the following:

```
Make me a typescript-based React app that has a button and upon the button being clicked show a random fact about Formula 1.
```

![prompt](https://i.imgur.com/COfb8o6.png)

Copilot will jump into action and run necessary commands to initialize a new React app and then code it according to your prompt.

Several minutes later, Copilot should confirm it is done:

![complete](https://i.imgur.com/Q0u5W3n.png)

## Run your Vibe-Coded React App
With the app now made, you can run it and see how it works!

In another terminal (NOT Copilot CLI), ensure you have all necessary packages for your app installed by running `npm install`

Now run `npm run dev`.

![npm run dev](https://i.imgur.com/aOU9Wfi.png)

Doing so will use vite to serve your React app on a local port (`http://localhost:5173/` in my case). Navigate to that URL to test it locally.

![test](https://i.imgur.com/MbYykkW.png)

Yay, we have a working react app that does something! Anything you don't like or want to change? Go back to your terminal with Copilot CLI and ask it! That easy. 😊

## Prepare your Vibe-Coded React App to be a Power Apps Code App
The app, in its current state, is not *quite* ready to be a Power Apps Code app just yet... we must do a few more things to prepare it to integrate with Power Apps:
1. Add the [@microsoft/power-apps](https://www.npmjs.com/package/@microsoft/power-apps) npm package to the project.
2. Add the [@microsoft/power-apps-vite](https://www.npmjs.com/package/@microsoft/power-apps-vite) npm package to the project.
3. Add the Power Apps Vite plugin to your `vite.config.ts` file.

First, to add the [@microsoft/power-apps](https://www.npmjs.com/package/@microsoft/power-apps) npm package, in a terminal run:

```
npm install @microsoft/power-apps
```

Then, to add the [@microsoft/power-apps-vite](https://www.npmjs.com/package/@microsoft/power-apps-vite) npm package, in a terminal run:

```
npm install @microsoft/power-apps-vite
```

Finally, to add the Power Apps Vite plugin, open your project's `vite.config.ts` file (it should be there) and replace it with the following:

```
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { powerApps } from "@microsoft/power-apps-vite/plugin"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), powerApps()],
});
```

## Prepare for Push
The few steps left focus on preparing your app to be "pushed" (uploaded) to your Power Platform environment.

First, you must **enable code apps** in your Power Apps environment. See in depth guide [here](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/overview#enable-code-apps-on-a-power-platform-environment), but summarized below:

Go to "Features" in your Environment settings.
![features](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/media/enable-settings-products-features.png)

And then enable code apps:
![enable](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/media/enable-code-apps.png)

Great, no your environment can accept a code app!

Next, let's prepare the app to be pushed via the PAC CLI! The following assumes you have already authenticated with the PAC CLI. If you haven't yet, follow [these steps](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/auth) to use `pac auth create` and `pac auth select` to authenticate and then select a target environment.

Run the following to set up your app's `power.config.json` file, a file that contains data about how (and where) the app should be in Power Platform.

```
pac code init --displayName "F1 Fun Facts"
```

You'll see that command set up a `power.config.json` file in your project defining the apps name and destination environment.

## Test in Power Apps Locally
You're now set up! Before pushing to the cloud, you'll test in a **local version of Power Apps**.

Now, run `npm run dev` like you did above in a previous step. This time, you should see there is *also* a URL presented to you where the React app can be tested locally as a **Code App**!

![as code app](https://i.imgur.com/UlDUwZL.png)

Copy + Paste that URL into a browser to test it locally!

![local power app](https://i.imgur.com/DFtzPOa.png)

As you can see above, it will render "locally" to show you what it *will* look like as a Power App. A banner along the top will show clearly indicating it is running locally **NOT yet** in the cloud.

## Push!
The *final* step is to **push** the code app to the cloud (your environment) with the PAC CLI!'

First, full build the app to prepare the build artifacts to be pushed. Run:

```
npm run build
```

You'll see artifacts be added to the `dist/` folder of your project.

And finally, run the following to make the final push:

```
pac code push
```

![push](https://i.imgur.com/CMpoE0U.png)

*(ignore the `dotnet tool run` before my `pac code push`... I am using the PAC CLI as a dotnet tool!*)

You'll see confirmation of the push and the URL where the app is available.

And there it is

![app](https://i.imgur.com/B0zG0sP.png)

Press the play button to play in Power Apps. 

![playing](https://i.imgur.com/RaYzw7i.png)

Happy vibe coding of Power Apps Code Apps 😊