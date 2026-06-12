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

async function runInvalidLoginTest() {
  const driver = await setupDriver();

  try {
    // ---------------------------------------------------------
    // Step 1 — Aceder à página de login
    // ---------------------------------------------------------
    console.log("TC001 - Aceder à página de login");

    await driver.get(baseUrl);
    await driver.wait(until.elementLocated(By.css(".subtitle")), 20000);
    console.log("Página apresentada");

    // ---------------------------------------------------------
    // Step 2 — Inserir email válido + password inválida
    // ---------------------------------------------------------
    console.log("TC002 - Inserir email válido + password inválida");

    await driver.wait(until.elementLocated(By.css("input[type='email']")), 20000);
    const emailInput = await driver.findElement(By.css("input[type='email']"));
    await emailInput.sendKeys("samuel.pinho.fernandes@gmail.com");

    await driver.wait(until.elementLocated(By.css("input[type='password']")), 20000);
    const passInput = await driver.findElement(By.css("input[type='password']"));
    await passInput.sendKeys("senhaErrada123");

    console.log("Campos aceitaram os dados");

    // ---------------------------------------------------------
    // Step 3 — Clicar em Sign In e validar erro
    // ---------------------------------------------------------
    console.log("TC003 - Clicar em 'Sign In' e validar erro");

    const button = await driver.findElement(By.css(".btn-primary"));
    await sleep(500);
    await button.click();

    // Espera extra para animação do toaster
    await sleep(1500);

    // Seletor do toaster (ajusta aqui se necessário)
    const toastSelector = ".toast-error";

    // Esperar até 20 segundos pelo toaster
    const toast = await driver.wait(
      until.elementLocated(By.css(toastSelector)),
      20000
    );

    await sleep(500); // garantir que está visível

    console.log("Mensagem de erro apresentada:", await toast.getText());

    // Garantir que NÃO redireciona para o dashboard
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes("/dashboard")) {
      console.log("❌ ERRO: Utilizador foi redirecionado para o dashboard (não deveria)");
    } else {
      console.log("✔️ Utilizador permanece na página de login (correto)");
    }

  } catch (err) {
    console.error("Erro no teste:", err);
  } finally {
    await driver.quit();
  }
}

runInvalidLoginTest();
