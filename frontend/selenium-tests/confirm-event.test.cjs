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
      return; // SUCCESS
    } catch (err) {
      current = await current.findElement(By.xpath("..")); // go to parent
    }
  }

  throw new Error("Nenhum wrapper clicável encontrado.");
}

async function runConfirmEventTest() {
  const driver = await setupDriver();

  try {
    // LOGIN
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

    // ENCONTRAR PRIMEIRO EVENTO PENDENTE
    console.log("TC001 - Procurar primeiro evento pendente");

    const firstPending = await driver.wait(
      until.elementLocated(By.css(".event-card.pending")),
      20000
    );

    console.log("Evento pendente encontrado");

    // ABRIR MODAL — SUBIR ATÉ ENCONTRAR ELEMENTO CLICÁVEL
    console.log("TC002 - Abrir modal de detalhes");

    await clickParentUntilClickable(driver, firstPending);

    await driver.wait(until.elementLocated(By.css(".overlay .modal")), 20000);
    console.log("Modal aberto");

    // CONFIRMAR EVENTO
    console.log("TC003 - Confirmar evento");

    await driver.wait(until.elementLocated(By.css(".confirm-btn")), 20000);
    const confirmBtn = await driver.findElement(By.css(".confirm-btn"));
    await confirmBtn.click();

    console.log("Botão Confirm clicado");

    await sleep(1500);

    // VALIDAR ESTADO CONFIRMADO
    console.log("TC004 - Validar estado confirmado");

    await driver.wait(
      until.elementLocated(By.css(".event-card.confirmed")),
      20000
    );

    console.log("✔ Evento confirmado com sucesso");

  } catch (err) {
    console.error("Erro no teste:", err);
  } finally {
    await driver.quit();
  }
}

runConfirmEventTest();
