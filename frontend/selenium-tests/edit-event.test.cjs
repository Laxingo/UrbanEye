const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");

const baseUrl = "http://localhost:5173";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const CURRENT_USER_EMAIL = "samuel.pinho.fernandes@gmail.com";

async function setupDriver() {
  const options = new chrome.Options();
  options.addArguments("--start-maximized");
  return await new Builder().forBrowser("chrome").setChromeOptions(options).build();
}

async function runEditEventTest() {
  const driver = await setupDriver();

  try {
    console.log("TC000 - Login");

    await driver.get(baseUrl);

    await driver.wait(until.elementLocated(By.css("input[type='email']")), 15000);
    await driver.findElement(By.css("input[type='email']")).sendKeys(CURRENT_USER_EMAIL);

    await driver.wait(until.elementLocated(By.css("input[type='password']")), 15000);
    await driver.findElement(By.css("input[type='password']")).sendKeys("familia123");

    await sleep(300);
    await driver.findElement(By.css(".btn-primary")).click();

    await driver.wait(until.urlContains("/dashboard"), 20000);
    console.log("Login efetuado com sucesso");

    // Esperar pelos cards reais
    await driver.wait(until.elementLocated(By.css(".event-card")), 20000);

    // 1. Expandir "+ occurrences" se existir
    const expandBtn = await driver.findElements(
      By.xpath("//div[contains(@class,'occ-divider')]/span[contains(text(), '+ occurrences')]")
    );

    if (expandBtn.length > 0) {
      console.log("A expandir lista de eventos...");
      await expandBtn[0].click();
      await sleep(400);
    } else {
      console.log("Não existe + occurrences (lista já está completa).");
    }

    // 2. Recolher todos os eventos
    const cards = await driver.findElements(By.css(".event-card"));
    console.log(`Encontrados ${cards.length} eventos após expandir.`);

    let found = false;

    for (let i = 0; i < cards.length; i++) {
      console.log(`A verificar evento ${i + 1}/${cards.length}`);

      const card = cards[i];

      // Abrir modal
      await driver.executeScript("arguments[0].click();", card);

      // Esperar modal abrir
      await driver.wait(until.elementLocated(By.css(".modal")), 20000);

      // Ler email
      const creatorEl = await driver.findElement(By.xpath("//*[contains(text(),'Reported By')]"));
      const creatorText = await creatorEl.getText();

      if (creatorText.includes(CURRENT_USER_EMAIL)) {
        console.log("✔ Evento criado pelo utilizador encontrado!");

        // EDITAR
        const editBtn = await driver.findElement(By.css(".icon-btn"));
        await editBtn.click();

        const titleInput = await driver.wait(
          until.elementLocated(By.css("input[name='title']")),
          20000
        );

        await titleInput.clear();
        await titleInput.sendKeys("Evento editado por Selenium");

        await driver.findElement(By.css(".save-btn")).click();

        console.log("✔ Evento editado com sucesso");
        found = true;
        break;
      }

      // FECHAR MODAL — clicando na overlay
      const overlay = await driver.findElement(By.css(".overlay"));
      await driver.executeScript("arguments[0].click();", overlay);
      await sleep(300);
    }

    if (!found) {
      console.log("❌ Nenhum evento criado pelo utilizador foi encontrado.");
    }

  } catch (err) {
    console.error("Erro no teste:", err);
  } finally {
    await driver.quit();
  }
}

runEditEventTest();
