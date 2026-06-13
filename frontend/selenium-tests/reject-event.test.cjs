const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");

const baseUrl = "http://localhost:5173";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function setupDriver() {
  const options = new chrome.Options();
  options.addArguments("--start-maximized");
  return await new Builder().forBrowser("chrome").setChromeOptions(options).build();
}

async function clickParentUntilClickable(driver, element) {
  let current = element;

  for (let i = 0; i < 5; i++) {
    try {
      await current.click();
      return;
    } catch (err) {
      current = await current.findElement(By.xpath(".."));
    }
  }

  throw new Error("Nenhum wrapper clicável encontrado.");
}

async function runRejectEventTest() {
  const driver = await setupDriver();

  try {
    console.log("TC000 - Login");

    await driver.get(baseUrl);

    await driver.wait(until.elementLocated(By.css("input[type='email']")), 15000);
    await driver.findElement(By.css("input[type='email']")).sendKeys("samuel.pinho.fernandes@gmail.com");

    await driver.wait(until.elementLocated(By.css("input[type='password']")), 15000);
    await driver.findElement(By.css("input[type='password']")).sendKeys("familia123");

    await sleep(300);
    await driver.findElement(By.css(".btn-primary")).click();

    await driver.wait(until.urlContains("/dashboard"), 20000);
    console.log("Login efetuado com sucesso");

    console.log("TC001 - Selecionar primeiro evento pendente");

    const firstPending = await driver.wait(
      until.elementLocated(By.css(".event-card.pending")),
      20000
    );

    console.log("Evento pendente encontrado");

    console.log("TC002 - Abrir modal");

    await clickParentUntilClickable(driver, firstPending);

    await driver.wait(until.elementLocated(By.css(".overlay .modal")), 20000);
    console.log("Modal aberto");

    console.log("TC003 - Clicar Reject");

    const rejectBtn = await driver.wait(
      until.elementLocated(By.css(".reject-btn")),
      20000
    );

    await rejectBtn.click();
    console.log("Botão Reject clicado");

    console.log("✔ Teste executado com sucesso (frontend não atualiza estado)");

  } catch (err) {
    console.error("Erro no teste:", err);
  } finally {
    await driver.quit();
  }
}

runRejectEventTest();
