import { test, expect } from "@playwright/test";

const UI_URL = "http://127.0.0.1:5173/";

//naming test according to our purpose
test("should allow the user to sign in", async ({ page }) => {
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
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});

test("should allow the user to register", async ({ page }) => {
  //for generating random new email for every test
  const testEmail = `test_register_${
    Math.floor(Math.random() * 90000) + 10000
  }@test.com`;

  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign In" }).click();
  await page.getByRole("link", { name: "Create an account here" }).click();
  await expect(
    page.getByRole("heading", { name: "Create an Account" })
  ).toBeVisible();

  await page.locator("[name=firstName]").fill("test_firstName");
  await page.locator("[name=lastName]").fill("test_lastName");
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill("password1234");
  await page.locator("[name=confirmPassword]").fill("password1234");

  await page.getByRole("button", { name: "Create Account" }).click();

  await expect(page.getByText("Registration Successful!")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});
