import { test, expect } from "@playwright/test";
import path from "path";

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

test("should allow user to add a hotel", async ({ page }) => {
  await page.goto(`${UI_URL}add-hotel`);

  await page.locator("[name=name]").fill("Test Hotel");
  await page.locator("[name=city]").fill("Test City");
  await page.locator("[name=country]").fill("Test Country");
  await page
    .locator("[name=description]")
    .fill("This is a description for the Test Hotel");
  await page.locator("[name=pricePerNight]").fill("100");
  await page.selectOption("select[name=starRating]", "4"); // because of dropdown

  await page.getByText("Budget").click(); // because of radio button

  await page.getByLabel("Free Wifi").check(); // because of check boxes
  await page.getByLabel("Parking").check();

  await page.locator("[name=adultCount]").fill("2");
  await page.locator("[name=childCount]").fill("4");

  await page.setInputFiles("[name=imageFiles]", [
    path.join(__dirname, "files", "1.jpg"),
    // path.join(__dirname, "files", "2.jpg"),
  ]);

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel Saved!")).toBeVisible(); //for toast
});

test("should display hotels", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await expect(page.getByText("Dublin Getaways")).toBeVisible();
  await expect(page.getByText("Lorem ipsum dolor sit amet")).toBeVisible();
  await expect(page.getByText("Dublin, Ireland")).toBeVisible();
  await expect(page.getByText("All Inclusive")).toBeVisible();
  await expect(page.getByText("₹119 per night")).toBeVisible();
  await expect(page.getByText("2 adults, 3 children")).toBeVisible();
  await expect(page.getByText("2 Star Rating")).toBeVisible();

  await expect(
    page.getByRole("link", { name: "View Details" }).first()
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();
});

test("should edit hotel", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await page.getByRole("link", { name: "View Details" }).first().click();

  await page.waitForSelector("[name=name]", { state: "attached" }); // waiting for the name to be displayed because lots of things haoppening when fetching hotel data
  await expect(page.locator("[name=name]")).toHaveValue("Dublin Getaways"); // first time name when fetching hotel
  await page.locator("[name=name]").fill("Dublin Getaways UPDATED");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel Updated!")).toBeVisible();

  //reloading the page to get the updated value
  await page.reload();

  //checking for updated value
  await expect(page.locator("[name=name]")).toHaveValue(
    "Dublin Getaways UPDATED"
  );

  //reset the updated value by filling the previous value to test everytime with that data
  await page.locator("[name=name]").fill("Dublin Getaways");
  await page.getByRole("button", { name: "Save" }).click();
});
