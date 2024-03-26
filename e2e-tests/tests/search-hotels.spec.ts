import { test, expect } from "@playwright/test";

const UI_URL = "http://127.0.0.1:5173/";

//testing if user is signed in to further test for hotel operations
test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  //get the sign in button (which is of element <Link> in <Header> component)
  await page.getByRole("link", { name: "Sign In" }).click();

  //expects heading "Sign In" when "Sign In" button clicked
  //heading "Sign In" is in <h1> tag
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  //it will locate email and password inputs on the page which will fill and test the 1@1.com and password
  await page.locator("[name=email]").fill("1@1.com");
  await page.locator("[name=password]").fill("password123");

  //get the login button (which is of type <button></button>)
  await page.getByRole("button", { name: "Login" }).click();

  //after successful sign in test it will expect below roles to be on page
  await expect(page.getByText("Successfully Logged In!")).toBeVisible();
});

test("should show hotel search results", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("Dublin");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("Hotels found in Dublin")).toBeVisible();
  await expect(page.getByText("Dublin Getaways")).toBeVisible();
});

// test("should show hotel detail", async ({ page }) => {
//   await page.goto(UI_URL);

//   await page.getByPlaceholder("Where are you going?").fill("Dublin");
//   await page.getByRole("button", { name: "Search" }).click();

//   await page.getByText("Dublin Getaways").click();
//   await expect(page).toHaveURL(/detail/);
//   await expect(page.getByRole("button", { name: "Book now" })).toBeVisible();
// });

// test("should book hotel", async ({ page }) => {
//   await page.goto(UI_URL);

//   await page.getByPlaceholder("Where are you going?").fill("Dublin");

//   const date = new Date();
//   date.setDate(date.getDate() + 3);
//   const formattedDate = date.toISOString().split("T")[0];
//   await page.getByPlaceholder("Check-out Date").fill(formattedDate);

//   await page.getByRole("button", { name: "Search" }).click();

//   await page.getByText("Dublin Getaways").click();
//   await page.getByRole("button", { name: "Book now" }).click();

//   await expect(page.getByText("Total Cost: £357.00")).toBeVisible();

//   const stripeFrame = page.frameLocator("iframe").first();
//   await stripeFrame
//     .locator('[placeholder="Card number"]')
//     .fill("4242424242424242");
//   await stripeFrame.locator('[placeholder="MM / YY"]').fill("04/30");
//   await stripeFrame.locator('[placeholder="CVC"]').fill("242");
//   await stripeFrame.locator('[placeholder="ZIP"]').fill("24225");

//   await page.getByRole("button", { name: "Confirm Booking" }).click();
//   await expect(page.getByText("Booking Saved!")).toBeVisible();

//   await page.getByRole("link", { name: "My Bookings" }).click();
//   await expect(page.getByText("Dublin Getaways")).toBeVisible();
// });
